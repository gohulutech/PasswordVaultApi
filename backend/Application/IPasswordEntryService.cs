using System;
using Application.ViewModels.Write;

namespace Application;

public interface IPasswordEntryService
{
    Task<PasswordEntryDetailDto> Create(PasswordEntryCreateDto passwordEntryCreateDto);
    Task<PasswordEntryDetailDto?> GetPasswordEntry(int id);
    Task<List<PasswordEntryPreviewDto>> GetPasswordEntries();
    Task<PasswordEntryDetailDto?> Update(PasswordEntryUpdateDto passwordEntryUpdateDto);
}
