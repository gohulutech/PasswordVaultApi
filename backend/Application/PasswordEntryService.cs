using System;
using Application.Utilities;
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

    public async Task<PasswordEntryDetailDto?> GetPasswordEntry(int id)
    {
        var passwordEntry = await passwordEntryRepository.GetPasswordEntry(id);
        if (passwordEntry == null) return null;
        return new PasswordEntryDetailDto(passwordEntry.Id,
            passwordEntry.Name,
            passwordEntry.Username,
            SimpleEncryptor.Decrypt(passwordEntry.EncryptedPassword));
    }

    public async Task<PasswordEntryDetailDto> Create(PasswordEntryCreateDto passwordEntryCreateDto)
    {
        var encryptedPassword = SimpleEncryptor.Encrypt(passwordEntryCreateDto.Password);
        var passwordEntry = PasswordEntry.CreatePasswordEntry(0,
            passwordEntryCreateDto.Name,
            passwordEntryCreateDto.Username,
            encryptedPassword);

        var createdPasswordEntry = await passwordEntryRepository.SavePasswordEntry(passwordEntry);
        return new PasswordEntryDetailDto(createdPasswordEntry.Id,
            createdPasswordEntry.Name,
            createdPasswordEntry.Username,
            SimpleEncryptor.Decrypt(createdPasswordEntry.EncryptedPassword));
    }

    public async Task<PasswordEntryDetailDto?> Update(PasswordEntryUpdateDto passwordEntryUpdateDto)
    {
        var existingEntry = await passwordEntryRepository.GetPasswordEntry(passwordEntryUpdateDto.Id);
        if (existingEntry == null) return null;

        var encryptedPassword = SimpleEncryptor.Encrypt(passwordEntryUpdateDto.Password);
        var updatedEntry = PasswordEntry.CreatePasswordEntry(
            passwordEntryUpdateDto.Id,
            passwordEntryUpdateDto.Name,
            passwordEntryUpdateDto.Username,
            encryptedPassword);

        var savedEntry = await passwordEntryRepository.SavePasswordEntry(updatedEntry);
        return new PasswordEntryDetailDto(savedEntry.Id,
            savedEntry.Name,
            savedEntry.Username,
            SimpleEncryptor.Decrypt(savedEntry.EncryptedPassword));
    }

}
