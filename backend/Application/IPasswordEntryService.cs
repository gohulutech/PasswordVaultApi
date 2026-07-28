using System;
using Application.ViewModels.Write;

namespace Application;

public interface IPasswordEntryService
{
    Task<PasswordEntryDetailDto> Create(int userId, PasswordEntryCreateDto passwordEntryCreateDto);
    Task<PasswordEntryDetailDto?> GetPasswordEntry(int id, int userId);
    Task<List<PasswordEntryPreviewDto>> GetPasswordEntries(int userId);
    Task<PasswordEntryDetailDto?> Update(int userId, PasswordEntryUpdateDto passwordEntryUpdateDto);
}
