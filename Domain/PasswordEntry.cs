namespace Domain;

public class PasswordEntry
{
    private PasswordEntry(int id, string name, string username, Password password)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required");

        this.Id = id;
        this.Name = name;
        this.Username = username;
        this.Password = password;
    }

    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Username { get; private set; }
    public Password Password { get; private set; }

    public static PasswordEntry CreatePasswordEntry(int id, string name, string username, Password password)
    {
        return new PasswordEntry(id, name, username, password);
    }

    public void UpdatePassword(string newPassword)
    {
        Password = Password.Create(newPassword);
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
