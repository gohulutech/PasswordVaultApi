using Application.ViewModels.Read;
using Application.ViewModels.Write;

namespace Application;

public interface IAuthService
{
    Task<AuthResponse?> Register(RegisterRequest registerRequest);
    Task<AuthResponse?> Login(LoginRequest loginRequest);
    Task<AuthResponse?> Refresh(string refreshToken);
    Task Logout(int userId);
}