using Domain.Interfaces;
using SQLite;
using Domain;

namespace Infrastructure;

public class RefreshTokenRepository(SQLiteAsyncConnection db) : IRefreshTokenRepository
{
    public async Task<RefreshToken?> FindByToken(string token)
    {
        var entity = await db.Table<RefreshTokenEntity>().Where(t => t.Token == token).FirstOrDefaultAsync();
        return entity != null ? MapFromEntity(entity) : null;
    }

    public async Task<RefreshToken> Save(RefreshToken refreshToken)
    {
        var entity = await db.FindAsync<RefreshTokenEntity>(refreshToken.Id);
        if (entity == null)
        {
            entity = new RefreshTokenEntity
            {
                Token = refreshToken.Token,
                UserId = refreshToken.UserId,
                Expires = refreshToken.Expires
            };
            await db.InsertAsync(entity);
            return MapFromEntity(entity);
        }

        entity.Token = refreshToken.Token;
        entity.UserId = refreshToken.UserId;
        entity.Expires = refreshToken.Expires;
        await db.UpdateAsync(entity);
        return MapFromEntity(entity);
    }

    public async Task RevokeAllForUser(int userId)
    {
        var entities = await db.Table<RefreshTokenEntity>().Where(t => t.UserId == userId).ToListAsync();
        foreach (var entity in entities)
        {
            entity.Revoked = true;
        }
        await db.UpdateAllAsync(entities);
    }

    private RefreshToken MapFromEntity(RefreshTokenEntity entity)
    {
        var refreshToken = RefreshToken.CreateRefreshToken(entity.Id, entity.Token, entity.UserId, entity.Expires);
        if (entity.Revoked)
        {
            refreshToken.Revoke();
        }
        return refreshToken;
    }
}
