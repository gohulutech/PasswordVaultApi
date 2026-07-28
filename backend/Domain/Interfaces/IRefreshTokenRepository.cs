namespace Domain.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> FindByToken(string token);
    Task<RefreshToken> Save(RefreshToken refreshToken);
    Task RevokeAllForUser(int userId);
}
