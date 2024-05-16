using Microsoft.AspNetCore.Mvc;
using server.Entities;
using server.Models;

namespace server.Services
{
    public interface ITicketService
    {
        public Task<IActionResult> GetAllTickets(int? userId = null);
        public Task<IActionResult> GetTicket(int id);
        public Task<IActionResult> AddTicket(TicketDTO ticketDTO);
        public Task<IActionResult> UpdateTicket(int id, TicketDTO ticketDTO);
        public Task<IActionResult> DeleteTicket(int id);
    }
}