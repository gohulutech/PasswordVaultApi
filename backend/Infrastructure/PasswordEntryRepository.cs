using Domain.Interfaces;
using SQLite;
using Domain;

namespace Infrastructure;

public class PasswordEntryRepository(SQLiteAsyncConnection db) : IPasswordEntryRepository
{
    public async Task<List<PasswordEntry>> GetPasswordEntries(int userId)
    {
        var result = await db.Table<PasswordEntryEntity>()
            .Where(e => e.UserId == userId)
            .ToListAsync();
        return result.Select(MapFromEntity).ToList();
    }

    public async Task<PasswordEntry?> GetPasswordEntry(int id, int userId)
    {
        var entity = await db.Table<PasswordEntryEntity>()
            .Where(e => e.Id == id && e.UserId == userId)
            .FirstOrDefaultAsync();
        if (entity == null) return null;
        return MapFromEntity(entity);
    }

    public async Task<PasswordEntry> SavePasswordEntry(PasswordEntry passwordEntry)
    {
        var entity = await db.FindAsync<PasswordEntryEntity>(passwordEntry.Id);
        if (entity == null)
        {
            entity = new PasswordEntryEntity
            {
                UserId = passwordEntry.UserId,
                Name = passwordEntry.Name,
                Username = passwordEntry.Username,
                EncryptedPassword = passwordEntry.EncryptedPassword,
            };
            await db.InsertAsync(entity);
            return MapFromEntity(entity);
        }

        entity.UserId = passwordEntry.UserId;
        entity.Name = passwordEntry.Name;
        entity.Username = passwordEntry.Username;
        entity.EncryptedPassword = passwordEntry.EncryptedPassword;
        await db.UpdateAsync(entity);
        return MapFromEntity(entity);
    }

    private PasswordEntry MapFromEntity(PasswordEntryEntity entity)
    {
        return PasswordEntry.CreatePasswordEntry(entity.Id,
            entity.UserId,
            entity.Name,
            entity.Username,
            entity.EncryptedPassword);
    }
}
