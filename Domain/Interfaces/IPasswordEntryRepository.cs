namespace Domain.Interfaces;

public interface IPasswordEntryRepository
{
    Task<List<PasswordEntry>> GetPasswordEntries();
    Task<PasswordEntry> SavePasswordEntry(PasswordEntry passwordEntry);
    Task<PasswordEntry?> GetPasswordEntry(int id);
}
