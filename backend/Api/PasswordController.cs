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
            var passwordEntry = await passwordEntryService.GetPasswordEntry(id);
            if (passwordEntry == null) return NotFound();
            return Ok(passwordEntry);
        }

        [HttpPost]
        public async Task<ActionResult<PasswordEntryDetailDto>> CreatePasswordEntry([FromBody] PasswordEntryCreateDto passwordEntryCreateDto)
        {
            var createdEntry = await passwordEntryService.Create(passwordEntryCreateDto);
            return CreatedAtAction(nameof(GetPasswordEntry), new { id = createdEntry.Id }, createdEntry);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePasswordEntry(int id, [FromBody] PasswordEntryUpdateDto passwordEntryUpdateDto)
        {
            if (id != passwordEntryUpdateDto.Id) return BadRequest();
            var updatedEntry = await passwordEntryService.Update(passwordEntryUpdateDto);
            if (updatedEntry == null) return NotFound();
            return Ok(updatedEntry);
        }
    }
}
