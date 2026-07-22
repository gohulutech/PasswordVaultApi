using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.Write;

public class PasswordEntryCreateDto
{
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Username { get; set; }

    [Required]
    public required string Password { get; set; }
}
