public class PasswordEntryDetailDto
{
    public PasswordEntryDetailDto(int id, string name, string username, string password)
    {
        this.Id = id;
        this.Name = name;
        this.Username = username;
        this.Password = password;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}