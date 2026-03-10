namespace Application
{
    public interface IVaultService
    {
        Task<List<PasswordEntryPreviewDto>> LoadVault();
        Task<PasswordEntryDetailDto> SavePasswordEntry(PasswordEntryDetailDto passwordEntryDetailDto);
    }
}