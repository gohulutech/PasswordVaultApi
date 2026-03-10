using System;
using Application.ViewModels.Write;
using Domain;
using Domain.Interfaces;

namespace Application;

public class PasswordEntryService(IPasswordEntryRepository passwordEntryRepository) : IPasswordEntryService
{
    public async Task<List<PasswordEntryPreviewDto>> GetPasswordEntries()
    {
        var passwordEntries = await passwordEntryRepository.GetPasswordEntries();
        return passwordEntries.Select(passwordEntry => new PasswordEntryPreviewDto(passwordEntry.Id, passwordEntry.Name, passwordEntry.Username)).ToList();
    }

    public async Task<PasswordEntryDetailDto> Create(PasswordEntryCreateDto passwordEntryCreateDto)
    {
        var passwordEntry = PasswordEntry.CreatePasswordEntry(0,
            passwordEntryCreateDto.Name,
            passwordEntryCreateDto.Username,
            Password.Create(passwordEntryCreateDto.Password));

        var createdPasswordEntry = await passwordEntryRepository.SavePasswordEntry(passwordEntry);
        return new PasswordEntryDetailDto(createdPasswordEntry.Id, createdPasswordEntry.Name, createdPasswordEntry.Username, createdPasswordEntry.Password.Value);
    }
}
