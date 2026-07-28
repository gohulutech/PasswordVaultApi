namespace Domain;

public class RefreshToken
{
    private RefreshToken(int id, string token, int userId, DateTime expires, bool revoked)
    {
        if (string.IsNullOrWhiteSpace(token)) throw new ArgumentException("Token is required");
        if (userId <= 0) throw new ArgumentException("Valid UserId is required");

        Id = id;
        Token = token;
        UserId = userId;
        Expires = expires;
        Revoked = revoked;
    }

    public int Id { get; private set; }
    public string Token { get; private set; }
    public int UserId { get; private set; }
    public DateTime Expires { get; private set; }
    public bool Revoked { get; private set; }

    public bool IsExpired => DateTime.UtcNow >= Expires;
    public bool IsActive => !Revoked && !IsExpired;

    public static RefreshToken CreateRefreshToken(int id, string token, int userId, DateTime expires)
    {
        return new RefreshToken(id, token, userId, expires, revoked: false);
    }

    public void Revoke()
    {
        Revoked = true;
    }
}
