using Application;
using Application.ViewModels.Write;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Api;

[Route("api/auth")]
[ApiController]
[EnableRateLimiting("auth-endpoints")]
public class AuthController(IAuthService authService, IConfiguration configuration) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
    {
        var result = await authService.Register(registerRequest);
        if (result == null) return Conflict(new { error = "User already exists" });

        SetRefreshTokenCookie(result.RefreshToken);
        return Created("", new { accessToken = result.AccessToken, userId = result.UserId, username = result.Username });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        var result = await authService.Login(loginRequest);
        if (result == null) return Unauthorized(new { error = "Invalid credentials" });

        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(new { accessToken = result.AccessToken, userId = result.UserId, username = result.Username });
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new { error = "No refresh token" });

        var result = await authService.Refresh(refreshToken);
        if (result == null) return Unauthorized(new { error = "Invalid refresh token" });

        SetRefreshTokenCookie(result.RefreshToken);
        return Ok(new { accessToken = result.AccessToken, userId = result.UserId, username = result.Username });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        await authService.Logout(userId);

        ClearRefreshTokenCookie();
        return Ok(new { message = "Logged out" });
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var expiryDays = int.Parse(configuration.GetSection("JwtSettings")["RefreshTokenExpiry"]!);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(expiryDays),
            Path = "/"
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    private void ClearRefreshTokenCookie()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(-1),
            Path = "/"
        };

        Response.Cookies.Append("refreshToken", "", cookieOptions);
    }
}
