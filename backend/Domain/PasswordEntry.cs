namespace Domain;

public class PasswordEntry
{
    private PasswordEntry(int id, string name, string username, string encryptedPassword, string salt, string IV)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required");

        this.Id = id;
        this.Name = name;
        this.Username = username;
        this.EncryptedPassword = encryptedPassword;
        this.Salt = salt;
        this.IV = IV;
    }

    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Username { get; private set; }
    public string EncryptedPassword { get; private set; }
    public string Salt { get; private set; }
    public string IV { get; private set; }

    public static PasswordEntry CreatePasswordEntry(int id, string name, string username, string encryptedPassword, string salt, string IV)
    {
        return new PasswordEntry(id, name, username, encryptedPassword, salt, IV);
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
