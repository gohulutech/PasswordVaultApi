using SQLite;

namespace Infrastructure;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(SQLiteAsyncConnection conn)
    {
        await conn.CreateTableAsync<PasswordEntryEntity>();
    }
}