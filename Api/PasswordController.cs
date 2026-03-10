using Application;
using Application.ViewModels.Write;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordController(IPasswordEntryService passwordEntryService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetPasswordEntries()
        {
            return Ok(await passwordEntryService.GetPasswordEntries());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPasswordEntry(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("Create")]
        public async Task<ActionResult<PasswordEntryDetailDto>> CreatePasswordEntry(PasswordEntryCreateDto passwordEntryCreateDto)
        {
            var createdEntry = await passwordEntryService.Create(passwordEntryCreateDto);
            return CreatedAtAction(nameof(GetPasswordEntry), new { id = createdEntry.Id }, createdEntry);
        }
    }
}
