using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using skyora1.DAL;
using skyora1.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration configuration;
        AppDbContext appDbContext;
        public AuthController(AppDbContext appDbContext, IConfiguration configuration)
        {
            this.configuration = configuration;
            this.appDbContext = appDbContext;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] Login request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Request Body");
            }


            var user = appDbContext.users
                .FirstOrDefault(u => u.Email == request.email);

            if (user == null)
            {
                return Unauthorized("Invalid user credentials.");
            }


            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized("Invalid user credentials.");
            }

            var token = IssueToken(user);

            return Ok(token);
        }
        private string IssueToken(User user)
        {

            var keyBytes = Convert.FromBase64String(configuration["Jwt:Key"]);
            var securityKey = new SymmetricSecurityKey(keyBytes);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {

                new Claim("Myapp_User_Id", user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role)

            };

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
