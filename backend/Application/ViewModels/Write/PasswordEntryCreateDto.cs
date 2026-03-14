using System;
using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.Write;

public class PasswordEntryCreateDto
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string EncryptedPassword { get; set; }

    [Required]
    public string Salt { get; set; }

    [Required]
    public string IV { get; set; }
}
