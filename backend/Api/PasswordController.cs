using Application;
using Application.ViewModels.Write;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordController(IPasswordEntryService passwordEntryService) : ControllerBase
    {
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return 0;
            return int.Parse(userIdClaim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetPasswordEntries()
        {
            var userId = GetUserId();
            return Ok(await passwordEntryService.GetPasswordEntries(userId));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPasswordEntry(int id)
        {
            var userId = GetUserId();
            var passwordEntry = await passwordEntryService.GetPasswordEntry(id, userId);
            if (passwordEntry == null) return NotFound();
            return Ok(passwordEntry);
        }

        [HttpPost]
        public async Task<ActionResult<PasswordEntryDetailDto>> CreatePasswordEntry([FromBody] PasswordEntryCreateDto passwordEntryCreateDto)
        {
            var userId = GetUserId();
            var createdEntry = await passwordEntryService.Create(userId, passwordEntryCreateDto);
            return CreatedAtAction(nameof(GetPasswordEntry), new { id = createdEntry.Id }, createdEntry);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePasswordEntry(int id, [FromBody] PasswordEntryUpdateDto passwordEntryUpdateDto)
        {
            if (id != passwordEntryUpdateDto.Id) return BadRequest();
            var userId = GetUserId();
            var updatedEntry = await passwordEntryService.Update(userId, passwordEntryUpdateDto);
            if (updatedEntry == null) return NotFound();
            return Ok(updatedEntry);
        }
    }
}
