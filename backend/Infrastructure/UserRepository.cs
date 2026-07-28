using Domain.Interfaces;
using SQLite;
using Domain;

namespace Infrastructure;

public class UserRepository(SQLiteAsyncConnection db) : IUserRepository
{
    public async Task<User?> FindById(int id)
    {
        var entity = await db.FindAsync<UserEntity>(id);
        return entity != null ? MapFromEntity(entity) : null;
    }

    public async Task<User?> FindByEmail(string email)
    {
        var entity = await db.Table<UserEntity>().Where(u => u.Email == email).FirstOrDefaultAsync();
        return entity != null ? MapFromEntity(entity) : null;
    }

    public async Task<User?> FindByUsername(string username)
    {
        var entity = await db.Table<UserEntity>().Where(u => u.Username == username).FirstOrDefaultAsync();
        return entity != null ? MapFromEntity(entity) : null;
    }

    public async Task<User> Save(User user)
    {
        var entity = await db.FindAsync<UserEntity>(user.Id);
        if (entity == null)
        {
            entity = new UserEntity
            {
                Email = user.Email,
                Username = user.Username,
                PasswordHash = user.PasswordHash,
                CreatedAt = user.CreatedAt
            };
            await db.InsertAsync(entity);
            return User.CreateUser(entity.Id, entity.Email, entity.Username, entity.PasswordHash, entity.CreatedAt);
        }

        entity.Email = user.Email;
        entity.Username = user.Username;
        entity.PasswordHash = user.PasswordHash;
        await db.UpdateAsync(entity);
        return User.CreateUser(entity.Id, entity.Email, entity.Username, entity.PasswordHash, entity.CreatedAt);
    }

    private User MapFromEntity(UserEntity entity)
    {
        return User.CreateUser(entity.Id, entity.Email, entity.Username, entity.PasswordHash, entity.CreatedAt);
    }
}