using Domain;
using Xunit;

namespace Domain.Tests;

public class RefreshTokenTests
{
    [Fact]
    public void CreateRefreshToken_WithValidData_ReturnsRefreshToken()
    {
        var expires = DateTime.UtcNow.AddDays(7);

        var refreshToken = RefreshToken.CreateRefreshToken(1, "abc123", 42, expires);

        Assert.Equal(1, refreshToken.Id);
        Assert.Equal("abc123", refreshToken.Token);
        Assert.Equal(42, refreshToken.UserId);
        Assert.Equal(expires, refreshToken.Expires);
        Assert.False(refreshToken.Revoked);
    }

    [Fact]
    public void CreateRefreshToken_SetsRevokedToFalse()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(7));

        Assert.False(refreshToken.Revoked);
    }

    [Fact]
    public void IsExpired_WhenExpiresInFuture_ReturnsFalse()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(7));

        Assert.False(refreshToken.IsExpired);
    }

    [Fact]
    public void IsExpired_WhenExpiresInPast_ReturnsTrue()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(-1));

        Assert.True(refreshToken.IsExpired);
    }

    [Fact]
    public void IsActive_WhenNotRevokedAndNotExpired_ReturnsTrue()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(7));

        Assert.True(refreshToken.IsActive);
    }

    [Fact]
    public void IsActive_WhenRevoked_ReturnsFalse()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(7));
        refreshToken.Revoke();

        Assert.False(refreshToken.IsActive);
    }

    [Fact]
    public void IsActive_WhenExpired_ReturnsFalse()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(-1));

        Assert.False(refreshToken.IsActive);
    }

    [Fact]
    public void Revoke_SetsRevokedToTrue()
    {
        var refreshToken = RefreshToken.CreateRefreshToken(1, "token", 1, DateTime.UtcNow.AddDays(7));

        refreshToken.Revoke();

        Assert.True(refreshToken.Revoked);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void CreateRefreshToken_WithInvalidToken_ThrowsArgumentException(string? token)
    {
        Assert.Throws<ArgumentException>(() =>
            RefreshToken.CreateRefreshToken(1, token!, 1, DateTime.UtcNow.AddDays(7)));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public void CreateRefreshToken_WithInvalidUserId_ThrowsArgumentException(int userId)
    {
        Assert.Throws<ArgumentException>(() =>
            RefreshToken.CreateRefreshToken(1, "token", userId, DateTime.UtcNow.AddDays(7)));
    }
}
