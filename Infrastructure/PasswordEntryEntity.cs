using SQLite;

namespace Infrastructure;

internal class PasswordEntryEntity
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    public string Name { get; set; }
    public string Username { get; set; }
    public string EncryptedPassword { get; set; }
}
