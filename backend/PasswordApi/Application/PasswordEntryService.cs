using System;
using Application.Utilities;
using Application.ViewModels.Write;
using Domain;
using Domain.Interfaces;

namespace Application;

public class PasswordEntryService(IPasswordEntryRepository passwordEntryRepository, IEncryptionService encryptionService) : IPasswordEntryService
{
    public async Task<List<PasswordEntryPreviewDto>> GetPasswordEntries()
    {
        var passwordEntries = await passwordEntryRepository.GetPasswordEntries();
        return passwordEntries.Select(passwordEntry => new PasswordEntryPreviewDto(passwordEntry.Id, passwordEntry.Name, passwordEntry.Username)).ToList();
    }

    public async Task<PasswordEntryDetailDto?> GetPasswordEntry(int id)
    {
        var passwordEntry = await passwordEntryRepository.GetPasswordEntry(id);
        if (passwordEntry == null) return null;
        return new PasswordEntryDetailDto(passwordEntry.Id,
            passwordEntry.Name,
            passwordEntry.Username,
            await encryptionService.DecryptAsync(passwordEntry.EncryptedPassword));
    }

    public async Task<PasswordEntryDetailDto> Create(PasswordEntryCreateDto passwordEntryCreateDto)
    {
        var encryptedPassword = await encryptionService.EncryptAsync(passwordEntryCreateDto.Password);
        var passwordEntry = PasswordEntry.CreatePasswordEntry(0,
            passwordEntryCreateDto.Name,
            passwordEntryCreateDto.Username,
            encryptedPassword);

        var createdPasswordEntry = await passwordEntryRepository.SavePasswordEntry(passwordEntry);
        return new PasswordEntryDetailDto(createdPasswordEntry.Id,
            createdPasswordEntry.Name,
            createdPasswordEntry.Username,
            await encryptionService.DecryptAsync(passwordEntry.EncryptedPassword));
    }

}
