namespace Domain;

public class PasswordEntry
{
    private PasswordEntry(int id, string name, string username, string password)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required");
        if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Password is required");

        this.Id = id;
        this.Name = name;
        this.Username = username;
        this.Password = password;
    }

    public int Id { get; private set; }
    public string Name { get; private set; } = "";
    public string Username { get; private set; } = "";
    public string Password { get; private set; } = "";

    public static PasswordEntry CreatePasswordEntry(int id, string name, string username, string password)
    {
        return new PasswordEntry(id, name, username, password);
    }
}
