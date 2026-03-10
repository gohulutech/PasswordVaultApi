using System;
using Application.ViewModels.Write;

namespace Application;

public interface IPasswordEntryService
{
    Task<PasswordEntryDetailDto> Create(PasswordEntryCreateDto passwordEntryCreateDto);
    Task<List<PasswordEntryPreviewDto>> GetPasswordEntries();
}
