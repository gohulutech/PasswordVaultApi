using System;
using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.Write;

public class PasswordEntryCreateDto
{
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Username { get; set; }

    [Required]
    public required string EncryptedPassword { get; set; }

    [Required]
    public required string Salt { get; set; }

    [Required]
    public required string IV { get; set; }
}
