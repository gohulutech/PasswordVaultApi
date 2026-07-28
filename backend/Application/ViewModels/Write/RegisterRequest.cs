using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.Write;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(3)]
    public required string Username { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}