using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.ViewModels.Read;
using Application.ViewModels.Write;
using Domain;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Application;

public class AuthService(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponse?> Register(RegisterRequest registerRequest)
    {
        var existingUser = await userRepository.FindByEmail(registerRequest.Email);
        if (existingUser != null) return null;

        var existingUsername = await userRepository.FindByUsername(registerRequest.Username);
        if (existingUsername != null) return null;

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerRequest.Password);
        var user = User.CreateUser(0, registerRequest.Email, registerRequest.Username, passwordHash, DateTime.UtcNow);
        var savedUser = await userRepository.Save(user);

        return await GenerateAuthResponse(savedUser);
    }

    public async Task<AuthResponse?> Login(LoginRequest loginRequest)
    {
        var user = await userRepository.FindByEmail(loginRequest.Email);
        if (user == null) return null;

        if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.PasswordHash)) return null;

        return await GenerateAuthResponse(user);
    }

    public async Task<AuthResponse?> Refresh(string refreshToken)
    {
        var storedToken = await refreshTokenRepository.FindByToken(refreshToken);
        if (storedToken == null || !storedToken.IsActive) return null;

        var user = await userRepository.FindById(storedToken.UserId);
        if (user == null) return null;

        // Revoke the old refresh token
        storedToken.Revoke();
        await refreshTokenRepository.Save(storedToken);

        return await GenerateAuthResponse(user);
    }

    public async Task Logout(int userId)
    {
        await refreshTokenRepository.RevokeAllForUser(userId);
    }

    private async Task<AuthResponse> GenerateAuthResponse(User user)
    {
        var accessToken = GenerateJwtToken(user);
        var refreshToken = await GenerateRefreshToken(user.Id);

        return new AuthResponse(accessToken, refreshToken.Token, user.Id, user.Username);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];
        var expiryMinutes = int.Parse(jwtSettings["AccessTokenExpiry"]!);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<RefreshToken> GenerateRefreshToken(int userId)
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
        var expiryDays = int.Parse(jwtSettings["RefreshTokenExpiry"]!);

        var token = Guid.NewGuid().ToString();
        var expires = DateTime.UtcNow.AddDays(expiryDays);

        var refreshToken = RefreshToken.CreateRefreshToken(0, token, userId, expires);
        return await refreshTokenRepository.Save(refreshToken);
    }
}