using System;
using Application.Utilities;
using Application.ViewModels.Write;
using Domain;
using Domain.Interfaces;

namespace Application;

public class PasswordEntryService(IPasswordEntryRepository passwordEntryRepository) : IPasswordEntryService
{
    public async Task<List<PasswordEntryPreviewDto>> GetPasswordEntries(int userId)
    {
        var passwordEntries = await passwordEntryRepository.GetPasswordEntries(userId);
        return passwordEntries.Select(passwordEntry => new PasswordEntryPreviewDto(passwordEntry.Id, passwordEntry.Name, passwordEntry.Username)).ToList();
    }

    public async Task<PasswordEntryDetailDto?> GetPasswordEntry(int id, int userId)
    {
        var passwordEntry = await passwordEntryRepository.GetPasswordEntry(id, userId);
        if (passwordEntry == null) return null;
        return new PasswordEntryDetailDto(passwordEntry.Id,
            passwordEntry.Name,
            passwordEntry.Username,
            SimpleEncryptor.Decrypt(passwordEntry.EncryptedPassword));
    }

    public async Task<PasswordEntryDetailDto> Create(int userId, PasswordEntryCreateDto passwordEntryCreateDto)
    {
        var encryptedPassword = SimpleEncryptor.Encrypt(passwordEntryCreateDto.Password);
        var passwordEntry = PasswordEntry.CreatePasswordEntry(0,
            userId,
            passwordEntryCreateDto.Name,
            passwordEntryCreateDto.Username,
            encryptedPassword);

        var createdPasswordEntry = await passwordEntryRepository.SavePasswordEntry(passwordEntry);
        return new PasswordEntryDetailDto(createdPasswordEntry.Id,
            createdPasswordEntry.Name,
            createdPasswordEntry.Username,
            SimpleEncryptor.Decrypt(createdPasswordEntry.EncryptedPassword));
    }

    public async Task<PasswordEntryDetailDto?> Update(int userId, PasswordEntryUpdateDto passwordEntryUpdateDto)
    {
        var existingEntry = await passwordEntryRepository.GetPasswordEntry(passwordEntryUpdateDto.Id, userId);
        if (existingEntry == null) return null;

        var encryptedPassword = SimpleEncryptor.Encrypt(passwordEntryUpdateDto.Password);
        var updatedEntry = PasswordEntry.CreatePasswordEntry(
            passwordEntryUpdateDto.Id,
            userId,
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
