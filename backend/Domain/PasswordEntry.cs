namespace Domain;

public class PasswordEntry
{
    private PasswordEntry(int id, int userId, string name, string username, string encryptedPassword)
    {
        if (userId <= 0) throw new ArgumentException("Valid UserId is required");
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required");

        this.Id = id;
        this.UserId = userId;
        this.Name = name;
        this.Username = username;
        this.EncryptedPassword = encryptedPassword;
    }

    public int Id { get; private set; }
    public int UserId { get; private set; }
    public string Name { get; private set; }
    public string Username { get; private set; }
    public string EncryptedPassword { get; private set; }

    public static PasswordEntry CreatePasswordEntry(int id, int userId, string name, string username, string encryptedPassword)
    {
        return new PasswordEntry(id, userId, name, username, encryptedPassword);
    }

    public void UpdatePassword(string newPassword)
    {
        EncryptedPassword = newPassword;
    }

    public void UpdateUsername(string newUsername)
    {
        Username = newUsername;
    }

    public void UpdateName(string newName)
    {
        Name = newName;
    }
}
