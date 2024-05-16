// TicketController.cs
using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTickets([FromQuery] int? userId = null)
        {
            var result = await _ticketService.GetAllTickets(userId);
            return result;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicket(int id)
        {
            var result = await _ticketService.GetTicket(id);
            return result;
        }

        [HttpPost]
        public async Task<IActionResult> AddTicket([FromBody] TicketDTO ticketDTO)
        {
            var result = await _ticketService.AddTicket(ticketDTO);
            return result;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketDTO ticketDTO)
        {
            var result = await _ticketService.UpdateTicket(id, ticketDTO);
            return result;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var result = await _ticketService.DeleteTicket(id);
            return result;
        }
    }
}
