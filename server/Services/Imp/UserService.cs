using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.DTOs;
using server.Entities;
using server.Models;
using server.Utilities;

namespace server.Services
{
    public class UserService : IUserService
    {
        private readonly BusDbContext _context;
        private readonly IMapper _mapper;

        public UserService(BusDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<UserDTO>> GetUsers(string? email = null)
        {
            var users = await GetUserQuery(email).ToListAsync();
            return _mapper.Map<List<UserDTO>>(users);
        }

        private IQueryable<User> GetUserQuery(string? email = null)
        {
            IQueryable<User> query = _context.Users;

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(e => e.Email == email);
            }

            return query;
        }

        public async Task<UserDTO> GetUser(int id)
        {
            var user = await GetUserById(id);
            return _mapper.Map<UserDTO>(user);
        }

        private async Task<User> GetUserById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<IActionResult> AddUser(User user)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                return new ConflictObjectResult("User already exists.");
            }

            user.Password = PasswordHasher.HashPassword(user.Password);

            if (!Enum.IsDefined(typeof(UserRole), user.Role))
            {
                user.Role = UserRole.User;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new CreatedAtActionResult(nameof(GetUser), "User", new { id = user.Id }, user);
        }

        public async Task<IActionResult> Login(LoginDTO loginDTO, JwtService jwtService)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
            if (user == null || !PasswordHasher.VerifyPassword(loginDTO.Password, user.Password))
            {
                return new UnauthorizedResult();
            }

            var token = jwtService.GenerateToken(user);
            return new OkObjectResult(new { token = token, userId = user.Id, userRole = user.Role });
        }

        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return new NotFoundResult();
            }

            if (!string.IsNullOrWhiteSpace(user.Email) && user.Email != existingUser.Email)
            {
                var emailExists = await _context.Users.AnyAsync(u => u.Email == user.Email);
                if (emailExists)
                {
                    return new ConflictObjectResult("Email already exists for another user.");
                }
            }

            existingUser.FirstName = string.IsNullOrWhiteSpace(user.FirstName) ? existingUser.FirstName : user.FirstName;
            existingUser.LastName = string.IsNullOrWhiteSpace(user.LastName) ? existingUser.LastName : user.LastName;
            existingUser.Email = string.IsNullOrWhiteSpace(user.Email) ? existingUser.Email : user.Email;

            if (!string.IsNullOrWhiteSpace(user.Password))
            {
                existingUser.Password = PasswordHasher.HashPassword(user.Password);
            }

            if (Enum.IsDefined(typeof(UserRole), user.Role))
            {
                existingUser.Role = user.Role;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return new NotFoundResult();
                }
                else
                {
                    throw;
                }
            }

            return new NoContentResult();
        }

        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return new NotFoundResult();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return new NoContentResult();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
