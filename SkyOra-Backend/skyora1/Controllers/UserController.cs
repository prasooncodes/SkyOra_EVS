using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using skyora1.DTO;
using skyora1.Models;
using skyora1.Repository;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        readonly IUser _userRepo;

        public UserController(IUser _userRepo)
        {
            this._userRepo = _userRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var allusers = await _userRepo.GetAllUsers();
            return Ok(allusers);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepo.GetUserById(id);
            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return NotFound();
            }
        }
        [HttpPost]
        public async Task<IActionResult> AddUser(UserDto user)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

            var data = await _userRepo.AddUser(user);
            return Ok(data);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto user)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            int data = await _userRepo.UpdateUser(id, user);
            if (data > 0)
            {
                return Ok(data);
            }
            else
            {
                return NotFound();
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            int data = await _userRepo.DeleteUser(id);
            if (data > 0)
            {
                return Ok(data);
            }
            else
            {
                return NotFound();
            }
        }

    }
}
