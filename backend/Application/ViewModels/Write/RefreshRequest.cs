using System.ComponentModel.DataAnnotations;

namespace Application.ViewModels.Write;

public class RefreshRequest
{
    [Required]
    public required string RefreshToken { get; set; }
}
