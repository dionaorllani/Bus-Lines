using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;

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
              .FirstOrDefaultAsync(s => s.Id == id);

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
            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stopDTO.CityName);
            if (city == null)
            {
                throw new ArgumentException("City not found");
            }

            var stop = new Stop
            {
                CityId = city.Id,
                StationName = stopDTO.StationName
            };

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
            var existingStop = await _context.Stops.FindAsync(id);

            if (existingStop == null)
            {
                throw new ArgumentException("Stop not found");
            }

            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Name == stopDTO.CityName);
            if (city == null)
            {
                throw new ArgumentException("City not found for the given CityId");
            }

            existingStop.CityId = city.Id;
            existingStop.StationName = stopDTO.StationName;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteStopAsync(int id)
        {
            var stop = await _context.Stops.FindAsync(id);
            if (stop == null)
            {
                throw new ArgumentException("Stop not found");
            }

            _context.Stops.Remove(stop);
            await _context.SaveChangesAsync();
        }
    }
}