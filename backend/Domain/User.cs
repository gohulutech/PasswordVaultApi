namespace Domain;

public class User
{
    private User(int id, string email, string username, string passwordHash, DateTime createdAt)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required");
        if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required");
        if (string.IsNullOrWhiteSpace(passwordHash)) throw new ArgumentException("Password hash is required");

        Id = id;
        Email = email;
        Username = username;
        PasswordHash = passwordHash;
        CreatedAt = createdAt;
    }

    public int Id { get; private set; }
    public string Email { get; private set; }
    public string Username { get; private set; }
    public string PasswordHash { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public static User CreateUser(int id, string email, string username, string passwordHash, DateTime createdAt)
    {
        return new User(id, email, username, passwordHash, createdAt);
    }
}
