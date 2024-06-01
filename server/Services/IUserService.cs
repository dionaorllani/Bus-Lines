using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IUserService
    {
        public Task<List<UserDTO>> GetUsers(string? email = null);
        public Task<IActionResult> AddUser(UserDTO user);
        public Task<UserDTO> GetUser(int id);
        public Task<IActionResult> UpdateUser(int id, UserDTO user);
        public Task<IActionResult> DeleteUser(int id);
    }
}