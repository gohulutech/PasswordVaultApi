namespace Domain.Interfaces;

public interface IPasswordEntryRepository
{
    Task<List<PasswordEntry>> GetPasswordEntries(int userId);
    Task<PasswordEntry> SavePasswordEntry(PasswordEntry passwordEntry);
    Task<PasswordEntry?> GetPasswordEntry(int id, int userId);
}
