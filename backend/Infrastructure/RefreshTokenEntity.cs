using SQLite;

namespace Infrastructure;

internal class RefreshTokenEntity
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    public string Token { get; set; }
    public int UserId { get; set; }
    public DateTime Expires { get; set; }
    public bool Revoked { get; set; }
}