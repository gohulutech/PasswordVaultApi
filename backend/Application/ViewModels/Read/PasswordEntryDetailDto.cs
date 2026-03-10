public class PasswordEntryDetailDto
{
    public PasswordEntryDetailDto(int id, string name, string username, string encryptedPassword, string salt, string IV)
    {
        this.Id = id;
        this.Name = name;
        this.Username = username;
        this.EncryptedPassword = encryptedPassword;
        this.Salt = salt;
        this.IV = IV;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public string EncryptedPassword { get; set; }
    public string Salt { get; set; }
    public string IV { get; set; }
}