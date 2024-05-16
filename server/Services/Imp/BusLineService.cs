using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;

namespace server.Services
{
    public class BusLineService : IBusLineService
    {
        private readonly BusDbContext _context;

        public BusLineService(BusDbContext context)
        {
            _context = context;
        }

        public async Task<List<BusLine>> GetBusLinesAsync(string startCityName = null, string destinationCityName = null)
        {
            var query = _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .AsQueryable();

            if (!string.IsNullOrEmpty(startCityName))
            {
                query = query.Where(bl => bl.StartCity.Name == startCityName);
            }

            if (!string.IsNullOrEmpty(destinationCityName))
            {
                query = query.Where(bl => bl.DestinationCity.Name == destinationCityName);
            }

            return await query.ToListAsync();
        }

        public async Task<BusLine> GetBusLineAsync(int id)
        {
            return await _context.BusLines
                // Include the start city and destination city for each bus line
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                // Find the bus line with the specified ID
                .FirstOrDefaultAsync(bl => bl.Id == id);
        }

        public async Task<BusLine> AddBusLineAsync(BusLineDTO busLineDTO)
        {
            // Check if a bus line with the same start and destination city already exists
            var existingBusLine = await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .FirstOrDefaultAsync(bl => bl.StartCity.Name == busLineDTO.StartCityName && bl.DestinationCity.Name == busLineDTO.DestinationCityName);

            if (existingBusLine != null)
            {
                throw new ArgumentException("Bus line with the same start and destination city already exists.");
            }

            // Find the start and destination cities by their names (same logic as before)
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName);

            // Check if the start and destination cities are found (same logic as before)
            if (startCity == null || destinationCity == null)
            {
                throw new ArgumentException("Invalid start city or destination city name.");
            }

            // Create a new bus line (same logic as before)
            var busLine = new BusLine
            {
                StartCityId = startCity.Id,
                DestinationCityId = destinationCity.Id
            };

            // Add the bus line to the database (same logic as before)
            _context.BusLines.Add(busLine);
            await _context.SaveChangesAsync();

            // Return the added bus line (same logic as before)
            return busLine;
        }


        public async Task UpdateBusLineAsync(int id, BusLineDTO busLineDTO)
        {
            // Find the bus line with the specified ID
            var existingBusLine = await _context.BusLines.FindAsync(id);
            if (existingBusLine == null)
            {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }

            // Find the start and destination cities by their names
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName);

            // Check if the start and destination cities are found
            if (startCity == null && !string.IsNullOrWhiteSpace(busLineDTO.StartCityName))
            {
                throw new ArgumentException("Start city not found.");
            }

            if (destinationCity == null && !string.IsNullOrWhiteSpace(busLineDTO.DestinationCityName))
            {
                throw new ArgumentException("Destination city not found.");
            }

            // Update the bus line's start and destination cities
            existingBusLine.StartCityId = startCity?.Id ?? existingBusLine.StartCityId; // Use null-coalescing for optional assignment
            existingBusLine.DestinationCityId = destinationCity?.Id ?? existingBusLine.DestinationCityId;

            try
            {
                // Mark the bus line as modified and save changes
                _context.Entry(existingBusLine).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public async Task DeleteBusLineAsync(int id)
        {
            // Find the bus line with the specified ID
            var busLine = await _context.BusLines.FindAsync(id);
            if (busLine == null)
            {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }

            // Remove the bus line from the database
            _context.BusLines.Remove(busLine);
            await _context.SaveChangesAsync();
        }
    }
}