// TicketService.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using System.Linq;
using System.Threading.Tasks;

namespace server.Services
{
    // Service class for handling ticket-related operations.
    public class TicketService : ITicketService
    {
        private readonly BusDbContext _context;

        // Constructor to inject database context.
        public TicketService(BusDbContext dbContext)
        {
            _context = dbContext;
        }

        // Retrieves all tickets, optionally filtered by user ID.
        public async Task<IActionResult> GetAllTickets(int? userId = null)
        {
            // Initialize query to include related entities and select all tickets.
            IQueryable<Ticket> query = _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity);

            // Filter query by user ID if provided.
            if (userId.HasValue)
            {
                query = query.Where(t => t.UserId == userId.Value);
            }

            // Project to DTO and execute query.
            var ticketDtoList = await query.Select(t => new
            {
                Id = t.Id,
                UserId = t.UserId,
                UserName = t.User.FirstName + " " + t.User.LastName,
                BusScheduleId = t.BusScheduleId,
                StartCityName = t.BusSchedule.BusLine.StartCity.Name,
                DestinationCityName = t.BusSchedule.BusLine.DestinationCity.Name,
                Departure = t.BusSchedule.Departure,
                Arrival = t.BusSchedule.Arrival,
                Seat = t.Seat,
                DateOfBooking = t.DateOfBooking
            }).ToListAsync();

            // Return result as HTTP 200 OK with the list of tickets.
            return new OkObjectResult(ticketDtoList);
        }

        // Retrieves a specific ticket by its ID.
        public async Task<IActionResult> GetTicket(int id)
        {
            // Find the ticket with related entities using ID.
            var ticketData = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.StartCity)
                .Include(t => t.BusSchedule)
                    .ThenInclude(bs => bs.BusLine)
                        .ThenInclude(bl => bl.DestinationCity)
                .SingleOrDefaultAsync(t => t.Id == id);

            // If no ticket found, return HTTP 404 Not Found.
            if (ticketData == null)
            {
                return new NotFoundResult();
            }

            // Map the data to a DTO to return.
            var ticketDto = new
            {
                Id = ticketData.Id,
                UserId = ticketData.UserId,
                UserName = ticketData.User.FirstName + " " + ticketData.User.LastName,
                BusScheduleId = ticketData.BusScheduleId,
                StartCityName = ticketData.BusSchedule.BusLine.StartCity.Name,
                DestinationCityName = ticketData.BusSchedule.BusLine.DestinationCity.Name,
                Departure = ticketData.BusSchedule.Departure,
                Arrival = ticketData.BusSchedule.Arrival,
                Seat = ticketData.Seat,
                DateOfBooking = ticketData.DateOfBooking
            };

            // Return result as HTTP 200 OK with ticket details.
            return new OkObjectResult(ticketDto);
        }

        // Adds a new ticket based on the provided DTO.
        public async Task<IActionResult> AddTicket(TicketDTO ticketDTO)
        {
            // Validate the user exists.
            var user = await _context.Users.FindAsync(ticketDTO.UserId);
            if (user == null)
            {
                return new BadRequestObjectResult("User not found.");
            }

            // Validate the bus schedule exists.
            var busSchedule = await _context.BusSchedules.FindAsync(ticketDTO.BusScheduleId);
            if (busSchedule == null)
            {
                return new BadRequestObjectResult("Bus schedule not found.");
            }

            // Validate there are available seats.
            var bookedSeats = await _context.Tickets
                .Where(t => t.BusScheduleId == ticketDTO.BusScheduleId)
                .Select(t => t.Seat)
                .ToListAsync();

            var availableSeats = Enumerable.Range(1, 10).Except(bookedSeats).ToList();
            if (availableSeats.Count == 0)
            {
                return new BadRequestObjectResult("No seats left for this bus schedule.");
            }

            // Assign a random available seat.
            var random = new Random();
            var randomSeatIndex = random.Next(availableSeats.Count);
            var selectedSeat = availableSeats[randomSeatIndex];

            // Create and add new ticket.
            var ticket = new Ticket
            {
                UserId = ticketDTO.UserId,
                BusScheduleId = ticketDTO.BusScheduleId,
                Seat = selectedSeat,
                DateOfBooking = DateTime.Now // Assuming current date/time for booking
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // Construct and return the response.
            var response = new
            {
                id = ticket.Id,
                userId = ticket.UserId,
                busScheduleId = ticket.BusScheduleId,
                seat = ticket.Seat,
                dateOfBooking = ticket.DateOfBooking
            };

            return new CreatedAtActionResult(nameof(GetTicket), "Ticket", new { id = ticket.Id }, response);
        }

        // Updates an existing ticket.
        public async Task<IActionResult> UpdateTicket(int id, TicketDTO ticketDTO)
        {
            // Validate the existing ticket.
            var existingTicket = await _context.Tickets.FindAsync(id);
            if (existingTicket == null)
            {
                return new NotFoundResult();
            }

            // Validate the user and the bus schedule.
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == ticketDTO.UserId);
            if (user == null)
            {
                return new BadRequestObjectResult("User not found.");
            }

            var busSchedule = await _context.BusSchedules.FindAsync(ticketDTO.BusScheduleId);
            if (busSchedule == null)
            {
                return new BadRequestObjectResult("Bus schedule not found.");
            }

            // Validate the seat number is within range and not taken.
            if (ticketDTO.Seat != 0 && (ticketDTO.Seat < 1 || ticketDTO.Seat > 10))
            {
                return new BadRequestObjectResult("Seat number must be between 1 and 10.");
            }

            // Ensure the seat is not already taken for the given bus schedule.
            if (ticketDTO.Seat != 0)
            {
                var isSeatTaken = await _context.Tickets
                    .AnyAsync(t => t.Id != id && t.BusScheduleId == ticketDTO.BusScheduleId && t.Seat == ticketDTO.Seat);

                if (isSeatTaken)
                {
                    return new BadRequestObjectResult("Seat is already taken.");
                }
            }

            // Check seat availability for a new bus schedule.
            if (ticketDTO.BusScheduleId != existingTicket.BusScheduleId)
            {
                var bookedSeats = await _context.Tickets
                    .Where(t => t.BusScheduleId == ticketDTO.BusScheduleId)
                    .Select(t => t.Seat)
                    .ToListAsync();

                var availableSeats = Enumerable.Range(1, 10).Except(bookedSeats).ToList();
                if (availableSeats.Count == 0)
                {
                    return new BadRequestObjectResult("All seats are taken for this bus schedule. Cannot change bus schedule.");
                }
            }

            // Update the ticket details.
            existingTicket.UserId = ticketDTO.UserId;
            existingTicket.User = user;
            existingTicket.BusScheduleId = ticketDTO.BusScheduleId;
            existingTicket.BusSchedule = busSchedule;
            if (ticketDTO.Seat != 0)
            {
                existingTicket.Seat = ticketDTO.Seat;
            }
            existingTicket.DateOfBooking = ticketDTO.DateOfBooking;

            // Save the changes.
            _context.Entry(existingTicket).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // Return HTTP 204 No Content as the update is complete.
            return new NoContentResult();
        }

        // Deletes a ticket based on its ID.
        public async Task<IActionResult> DeleteTicket(int id)
        {
            // Find the ticket.
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return new NotFoundResult();
            }

            // Remove the ticket from the database.
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            // Return HTTP 204 No Content as the ticket has been successfully deleted.
            return new NoContentResult();
        }
    }
}
