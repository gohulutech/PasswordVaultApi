using Domain;
using Xunit;

namespace Domain.Tests;

public class UserTests
{
    [Fact]
    public void CreateUser_WithValidData_ReturnsUser()
    {
        var now = DateTime.UtcNow;

        var user = User.CreateUser(1, "test@example.com", "testuser", "hashed_password", now);

        Assert.Equal(1, user.Id);
        Assert.Equal("test@example.com", user.Email);
        Assert.Equal("testuser", user.Username);
        Assert.Equal("hashed_password", user.PasswordHash);
        Assert.Equal(now, user.CreatedAt);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void CreateUser_WithInvalidEmail_ThrowsArgumentException(string? email)
    {
        Assert.Throws<ArgumentException>(() =>
            User.CreateUser(1, email!, "testuser", "hashed_password", DateTime.UtcNow));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void CreateUser_WithInvalidUsername_ThrowsArgumentException(string? username)
    {
        Assert.Throws<ArgumentException>(() =>
            User.CreateUser(1, "test@example.com", username!, "hashed_password", DateTime.UtcNow));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void CreateUser_WithInvalidPasswordHash_ThrowsArgumentException(string? passwordHash)
    {
        Assert.Throws<ArgumentException>(() =>
            User.CreateUser(1, "test@example.com", "testuser", passwordHash!, DateTime.UtcNow));
    }
}
