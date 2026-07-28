namespace Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> FindByEmail(string email);
    Task<User?> FindByUsername(string username);
    Task<User> Save(User user);
}
