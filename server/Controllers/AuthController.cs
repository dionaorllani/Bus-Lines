using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using server.Services;
using server.Utilities;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BusDbContext _userContext;
        private readonly ITokenService _tokenService;

        public AuthController(BusDbContext userContext, ITokenService tokenService)
        {
            _userContext = userContext;
            _tokenService = tokenService; 
        }

        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginModel)
        {
            if (loginModel is null)
            {
                return BadRequest("Invalid client request");
            }

            var user = await _userContext.Users.FirstOrDefaultAsync(u => u.Email == loginModel.Email);
            if (user == null || !PasswordHasher.VerifyPassword(loginModel.Password, user.Password))
            {
                return new UnauthorizedResult();
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, loginModel.Email),
                new Claim(CustomClaimTypes.UserId, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(4);

            _userContext.SaveChanges();

            return Ok(new AuthenticatedResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken
            });
        }
    }
}
