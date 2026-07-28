namespace Application.ViewModels.Read;

public class AuthResponse
{
    public AuthResponse(string accessToken, string refreshToken, int userId, string username)
    {
        AccessToken = accessToken;
        RefreshToken = refreshToken;
        UserId = userId;
        Username = username;
    }

    public string AccessToken { get; }
    public string RefreshToken { get; }
    public int UserId { get; }
    public string Username { get; }
}