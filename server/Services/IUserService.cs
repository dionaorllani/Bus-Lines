using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IUserService
    {
        public Task<List<UserDTO>> GetUsers(string? email = null);
        public Task<IActionResult> AddUser(User user);
        public Task<UserDTO> GetUser(int id);
        public Task<IActionResult> Login(LoginDTO loginDTO, JwtService jwtService);
        public Task<IActionResult> UpdateUser(int id, User user);
        public Task<IActionResult> DeleteUser(int id);
    }
}