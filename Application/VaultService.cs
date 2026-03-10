using Domain;
using Domain.Interfaces;

namespace Application;

public class VaultService(IPasswordEntryRepository passwordEntryRepository) : IVaultService
{
    public Task<List<PasswordEntryPreviewDto>> LoadVault()
    {
        throw new NotImplementedException();
    }

    public async Task<PasswordEntryDetailDto> SavePasswordEntry(PasswordEntryDetailDto passwordEntryDetailDto)
    {
        var passwordEntry = PasswordEntry.CreatePasswordEntry(passwordEntryDetailDto.Id,
            passwordEntryDetailDto.Name,
            passwordEntryDetailDto.Username,
            passwordEntryDetailDto.Password);

        await passwordEntryRepository.SavePasswordEntry(passwordEntry);
        throw new NotImplementedException();
    }
}
