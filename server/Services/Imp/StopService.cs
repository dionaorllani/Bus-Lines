using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Services
{
    public class StopService : IStopService
    {
        private readonly BusDbContext _context;

        public StopService(BusDbContext context)
        {
            _context = context;
        }

        public async Task<List<StopDTO>> GetStopsAsync()
        {
            return await _context.Stops
              .Include(s => s.City)
              .Where(s => !s.IsDeleted)
              .Select(s => new StopDTO
              {
                  Id = s.Id,
                  StationName = s.StationName,
                  CityName = s.City.Name,
                  BusScheduleIds = s.BusScheduleStops.Select(bss => bss.BusScheduleId).ToList()
              })
              .ToListAsync();
        }

        public async Task<StopDTO> GetStopByIdAsync(int id)
        {
            var stop = await _context.Stops
              .Include(s => s.City)
              .Include(s => s.BusScheduleStops)
              .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

            if (stop == null)
            {
                return null;
            }

            return new StopDTO
            {
                Id = stop.Id,
                StationName = stop.StationName,
                CityName = stop.City.Name,
                BusScheduleIds = stop.BusScheduleStops?.Select(bss => bss.BusScheduleId).ToList() ?? new List<int>()
            };
        }

        public async Task<StopDTO> AddStopAsync(StopPostDTO stopDTO)
        {
            // Check if the city exists and is not deleted
            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stopDTO.CityName);
            if (city == null || city.IsDeleted)
            {
                throw new ArgumentException("City not found or has been deleted");
            }

            // Check if the stop already exists with the same StationName
            var existingStop = await _context.Stops.FirstOrDefaultAsync(s => s.StationName == stopDTO.StationName && s.CityId == city.Id);

            // If stop exists and is not deleted, throw an exception
            if (existingStop != null && !existingStop.IsDeleted)
            {
                throw new ArgumentException("Stop already exists.");
            }

            // If stop exists and is deleted, update IsDeleted to false
            if (existingStop != null && existingStop.IsDeleted)
            {
                existingStop.IsDeleted = false;
                await _context.SaveChangesAsync();

                return new StopDTO
                {
                    Id = existingStop.Id,
                    StationName = existingStop.StationName,
                    CityName = city.Name
                };
            }

            // If stop does not exist, create a new Stop entity from the DTO
            var stop = new Stop
            {
                CityId = city.Id,
                StationName = stopDTO.StationName,
                IsDeleted = false
            };

            // Add stop to context and save changes
            _context.Stops.Add(stop);
            await _context.SaveChangesAsync();

            return new StopDTO
            {
                Id = stop.Id,
                StationName = stop.StationName,
                CityName = city.Name
            };
        }

        public async Task UpdateStopAsync(int id, StopPostDTO stopDTO)
        {
            var existingStop = await _context.Stops.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

            if (existingStop == null)
            {
                throw new ArgumentException("Stop not found");
            }

            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stopDTO.CityName);
            if (city == null || city.IsDeleted)
            {
                throw new ArgumentException("City not found for the given CityId");
            }

            existingStop.CityId = city.Id;
            existingStop.StationName = stopDTO.StationName;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteStopAsync(int id)
        {
            var stop = await _context.Stops.FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
            if (stop == null)
            {
                throw new ArgumentException("Stop not found");
            }

            // Set IsDeleted to true
            stop.IsDeleted = true;
            // Mark stop as modified in context
            _context.Entry(stop).State = EntityState.Modified;
            // Save changes to the database
            await _context.SaveChangesAsync();
        }
    }
}
