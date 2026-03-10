public class PasswordEntryPreviewDto
{
    public PasswordEntryPreviewDto(int id, string name, string username)
    {
        this.Id = id;
        this.Name = name;
        this.Username = username;
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
}