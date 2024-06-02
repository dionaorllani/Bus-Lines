using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
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
                .Where(bl => !bl.IsDeleted) // Exclude deleted bus lines
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
            var line = await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .FirstOrDefaultAsync(bl => bl.Id == id && !bl.IsDeleted);

            if (line == null) {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }
            return line;
        }

        public async Task<BusLine> AddBusLineAsync(BusLineDTO busLineDTO)
        {
            // Check if bus line already exists with the same start and destination city
            var existingBusLine = await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .FirstOrDefaultAsync(bl => bl.StartCity.Name == busLineDTO.StartCityName && bl.DestinationCity.Name == busLineDTO.DestinationCityName);

            // If bus line exists and is not deleted, throw an exception
            if (existingBusLine != null && !existingBusLine.IsDeleted)
            {
                throw new ArgumentException("Bus line with the same start and destination city already exists.");
            }

            // If bus line exists and is deleted, update IsDeleted to false
            if (existingBusLine != null && existingBusLine.IsDeleted)
            {
                existingBusLine.IsDeleted = false;
                await _context.SaveChangesAsync();
                return existingBusLine;
            }

            // Validate start and destination cities
            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName && !c.IsDeleted);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName && !c.IsDeleted);

            if (startCity == null || destinationCity == null)
            {
                throw new ArgumentException("Invalid start city or destination city name, or the city has been deleted.");
            }

            // If bus line does not exist, create a new BusLine entity from the DTO
            var busLine = new BusLine
            {
                StartCityId = startCity.Id,
                DestinationCityId = destinationCity.Id,
                IsDeleted = false
            };

            // Add bus line to context and save changes
            _context.BusLines.Add(busLine);
            await _context.SaveChangesAsync();

            // Return the newly created bus line
            return busLine;
        }

        public async Task UpdateBusLineAsync(int id, BusLineDTO busLineDTO)
        {
            var existingBusLine = await _context.BusLines.FirstOrDefaultAsync(bl => bl.Id == id && !bl.IsDeleted);
            if (existingBusLine == null)
            {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }

            var startCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.StartCityName && !c.IsDeleted);
            var destinationCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == busLineDTO.DestinationCityName && !c.IsDeleted);

            if (startCity == null && !string.IsNullOrWhiteSpace(busLineDTO.StartCityName))
            {
                throw new ArgumentException("Start city not found.");
            }

            if (destinationCity == null && !string.IsNullOrWhiteSpace(busLineDTO.DestinationCityName))
            {
                throw new ArgumentException("Destination city not found.");
            }

            existingBusLine.StartCityId = startCity?.Id ?? existingBusLine.StartCityId;
            existingBusLine.DestinationCityId = destinationCity?.Id ?? existingBusLine.DestinationCityId;

            _context.Entry(existingBusLine).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBusLineAsync(int id)
        {
            var busLine = await _context.BusLines.FirstOrDefaultAsync(bl => bl.Id == id && !bl.IsDeleted);
            if (busLine == null)
            {
                throw new KeyNotFoundException($"BusLine with ID {id} not found.");
            }

            busLine.IsDeleted = true;
            _context.Entry(busLine).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
