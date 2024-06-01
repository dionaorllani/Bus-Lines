using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.DataAccess;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly BusDbContext _userContext;
        private readonly ITokenService _tokenService;

        public TokenController(BusDbContext userContext, ITokenService tokenService)
        {
            this._userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        [HttpPost]
        [Route("refresh")]
        public IActionResult Refresh(string accessToken, string refreshToken)
        {
            if (accessToken is null || refreshToken is null)
                return BadRequest("Invalid client request");

            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var email = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = _userContext.Users.SingleOrDefault(u => u.Email == email);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime < DateTime.Now)
                return BadRequest("Invalid client request");

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
            /*var newRefreshToken = _tokenService.GenerateRefreshToken();*/

            /*user.RefreshToken = newRefreshToken;
            _userContext.SaveChanges();*/

            return Ok(new AuthenticatedResponse()
            {
                Token = newAccessToken,
                RefreshToken = refreshToken
            });
        }

        [HttpPost, Authorize]
        [Route("revoke")]
        public IActionResult Revoke()
        {
            var email = User.Identity.Name;

            var user = _userContext.Users.SingleOrDefault(u => u.Email == email);
            if (user == null) return BadRequest();

            user.RefreshToken = null;

            _userContext.SaveChanges();

            return NoContent();
        }
    }
}
