public class PasswordEntryDetailDto
{
    public PasswordEntryDetailDto(int id, string name, string username, string encryptedPassword)
    {
        this.Id = id;
        this.Name = name;
        this.Username = username;
        this.EncryptedPassword = encryptedPassword;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public string EncryptedPassword { get; set; }
}