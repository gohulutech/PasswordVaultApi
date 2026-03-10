using Domain.Interfaces;
using SQLite;
using Domain;

namespace Infrastructure;

public class PasswordEntryRepository(SQLiteAsyncConnection db) : IPasswordEntryRepository
{
    public async Task<List<PasswordEntry>> GetPasswordEntries()
    {
        var result = await db.Table<PasswordEntryEntity>().ToListAsync();
        return result.Select(MapFromEntity).ToList();
    }

    public async Task<PasswordEntry?> GetPasswordEntry(int id)
    {
        var entity = await db.FindAsync<PasswordEntryEntity>(id);
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
                Name = passwordEntry.Name,
                Username = passwordEntry.Username,
                EncryptedPassword = CryptoHelper.Encrypt(passwordEntry.Password)
            };
            await db.InsertAsync(entity);
            return MapFromEntity(entity);
        }

        entity.Name = passwordEntry.Name;
        entity.Username = passwordEntry.Username;
        entity.EncryptedPassword = CryptoHelper.Encrypt(passwordEntry.Password);
        await db.UpdateAsync(entity);
        return MapFromEntity(entity);
    }

    private PasswordEntry MapFromEntity(PasswordEntryEntity entity)
    {
        return PasswordEntry.CreatePasswordEntry(entity.Id, entity.Name, entity.Username, CryptoHelper.Decrypt(entity.EncryptedPassword));
    }
}
