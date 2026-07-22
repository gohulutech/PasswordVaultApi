using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.Write;

public class PasswordEntryUpdateDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Username { get; set; }

    [Required]
    public required string Password { get; set; }
}
