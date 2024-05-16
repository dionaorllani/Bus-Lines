using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using server.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class BusScheduleService : IBusScheduleService
{
    private readonly BusDbContext _context;

    public BusScheduleService(BusDbContext context)
    {
        _context = context;
    }

    public async Task<List<BusScheduleDTO>> GetBusSchedules(string startCityName, string destinationCityName, DateTime? departureDate)
    {
        // Build the query with includes for related entities
        IQueryable<BusSchedule> query = _context.BusSchedules
            .Include(bs => bs.BusLine)
                .ThenInclude(bl => bl.StartCity)
            .Include(bs => bs.BusLine)
                .ThenInclude(bl => bl.DestinationCity)
            .Include(bs => bs.Operator)
            .Include(bs => bs.BusScheduleStops)
                .ThenInclude(bss => bss.Stop);

        // Apply filters
        if (!string.IsNullOrEmpty(startCityName))
        {
            query = query.Where(bs => bs.BusLine.StartCity.Name == startCityName);
        }

        if (!string.IsNullOrEmpty(destinationCityName))
        {
            query = query.Where(bs => bs.BusLine.DestinationCity.Name == destinationCityName);
        }

        // Order by departure time
        if (departureDate.HasValue)
        {
            query = query.Where(bs => bs.Departure.Date == departureDate.Value.Date);
        }

        // Get bus schedules and map to DTOs
        query = query.OrderBy(bs => bs.Departure); // Order by departure time
        var busSchedules = await query.ToListAsync();

        return busSchedules.Select(bs => new BusScheduleDTO
        {
            Id = bs.Id,
            StartCityName = bs.BusLine.StartCity.Name,
            DestinationCityName = bs.BusLine.DestinationCity.Name,
            OperatorName = bs.Operator.Name,
            Departure = bs.Departure,
            Arrival = bs.Arrival,
            Price = bs.Price,
            StationNames = bs.BusScheduleStops.Select(bss => bss.Stop.StationName).ToList()
        }).ToList();
    }

    public async Task<BusScheduleDTO> GetBusSchedule(int id)
    {
        // Build the query with includes
        var busSchedule = await _context.BusSchedules
            .Include(bs => bs.BusLine)
                .ThenInclude(bl => bl.StartCity)
            .Include(bs => bs.BusLine)
                .ThenInclude(bl => bl.DestinationCity)
            .Include(bs => bs.Operator)
            .Include(bs => bs.BusScheduleStops)
                .ThenInclude(bss => bss.Stop)
            .FirstOrDefaultAsync(bs => bs.Id == id);

        // Return null if not found
        if (busSchedule == null)
            return null;

        // Map to DTO
        return new BusScheduleDTO
        {
            Id = busSchedule.Id,
            StartCityName = busSchedule.BusLine.StartCity.Name,
            DestinationCityName = busSchedule.BusLine.DestinationCity.Name,
            OperatorName = busSchedule.Operator.Name,
            Departure = busSchedule.Departure,
            Arrival = busSchedule.Arrival,
            Price = busSchedule.Price,
            StationNames = busSchedule.BusScheduleStops.Select(bss => bss.Stop.StationName).ToList()
        };
    }

    public async Task<BusScheduleDTO> AddBusSchedule(BusScheduleDTO busScheduleDTO)
    {
        // Validate price
        if (busScheduleDTO.Price <= 0)
        {
            throw new ArgumentException("Price must be greater than 0.");
        }

        // Find bus line based on city names
        var busLine = await _context.BusLines
            .Include(bl => bl.StartCity)
            .Include(bl => bl.DestinationCity)
            .FirstOrDefaultAsync(bl =>
                bl.StartCity.Name == busScheduleDTO.StartCityName &&
                bl.DestinationCity.Name == busScheduleDTO.DestinationCityName);

        // Throw exception if bus line not found
        if (busLine == null)
        {
            throw new KeyNotFoundException("Bus line not found for the specified cities.");
        }

        // Find operator
        var @operator = await _context.Operators.FirstOrDefaultAsync(op => op.Name == busScheduleDTO.OperatorName);
        if (@operator == null)
        {
            throw new KeyNotFoundException("Operator not found.");
        }

        // Create new bus schedule entity
        var busSchedule = new BusSchedule
        {
            BusLineId = busLine.Id,
            OperatorId = @operator.Id,
            Departure = busScheduleDTO.Departure,
            Arrival = busScheduleDTO.Arrival,
            Price = busScheduleDTO.Price,
            BusScheduleStops = new List<BusScheduleStop>()
        };

        // Add stops if station names provided
        if (busScheduleDTO.StationNames != null)
        {
            foreach (var stationName in busScheduleDTO.StationNames)
            {
                var stop = await _context.Stops.FirstOrDefaultAsync(s => s.StationName == stationName);
                if (stop == null)
                {
                    throw new KeyNotFoundException($"Stop with name {stationName} not found.");
                }

                busSchedule.BusScheduleStops.Add(new BusScheduleStop
                {
                    StopId = stop.Id
                });
            }
        }

        // Add bus schedule to context and save changes
        _context.BusSchedules.Add(busSchedule);
        await _context.SaveChangesAsync();

        // Map to DTO and return
        return new BusScheduleDTO
        {
            Id = busSchedule.Id,
            StartCityName = busLine.StartCity.Name,
            DestinationCityName = busLine.DestinationCity.Name,
            OperatorName = @operator.Name,
            Departure = busSchedule.Departure,
            Arrival = busSchedule.Arrival,
            Price = busSchedule.Price,
            StationNames = busScheduleDTO.StationNames
        };
    }

    public async Task<bool> UpdateBusSchedule(int id, BusScheduleDTO busScheduleDTO)
    {
        // Find existing bus schedule
        var existingBusSchedule = await _context.BusSchedules
            .Include(bs => bs.BusLine)
                .ThenInclude(bl => bl.StartCity)
            .Include(bs => bs.BusLine)
                .ThenInclude(bl => bl.DestinationCity)
            .Include(bs => bs.Operator)
            .Include(bs => bs.BusScheduleStops)
            .FirstOrDefaultAsync(bs => bs.Id == id);

        // Throw exception if not found
        if (existingBusSchedule == null)
        {
            return false;  // Not found
        }

        // Check if city names have changed and update accordingly
        if (existingBusSchedule.BusLine.StartCity.Name != busScheduleDTO.StartCityName ||
            existingBusSchedule.BusLine.DestinationCity.Name != busScheduleDTO.DestinationCityName)
        {
            var busLine = await _context.BusLines
                .Include(bl => bl.StartCity)
                .Include(bl => bl.DestinationCity)
                .FirstOrDefaultAsync(bl =>
                    bl.StartCity.Name == busScheduleDTO.StartCityName &&
                    bl.DestinationCity.Name == busScheduleDTO.DestinationCityName);
            if (busLine == null)
            {
                throw new KeyNotFoundException("No bus line found with the specified start and destination cities.");
            }
            existingBusSchedule.BusLineId = busLine.Id;  // Update the bus line ID
        }

        // Update other fields
        if (busScheduleDTO.Departure != default)
            existingBusSchedule.Departure = busScheduleDTO.Departure;
        if (busScheduleDTO.Arrival != default)
            existingBusSchedule.Arrival = busScheduleDTO.Arrival;
        if (busScheduleDTO.Price > 0) // Update price only if positive
            existingBusSchedule.Price = busScheduleDTO.Price; 

        // Update the operator if necessary
        if (!string.IsNullOrEmpty(busScheduleDTO.OperatorName) &&
            existingBusSchedule.Operator.Name != busScheduleDTO.OperatorName)
        {
            var operatorEntity = await _context.Operators.FirstOrDefaultAsync(op => op.Name == busScheduleDTO.OperatorName);
            if (operatorEntity == null)
            {
                throw new KeyNotFoundException("Operator not found.");
            }
            existingBusSchedule.OperatorId = operatorEntity.Id;
        }

        // Remove deleted stops
        existingBusSchedule.BusScheduleStops.Clear();
        if (busScheduleDTO.StationNames != null && busScheduleDTO.StationNames.Any())
        {
            // Add new stops
            foreach (var stationName in busScheduleDTO.StationNames)
            {
                var stop = await _context.Stops.FirstOrDefaultAsync(s => s.StationName == stationName);
                if (stop == null)
                {
                    throw new KeyNotFoundException($"Stop with name {stationName} not found.");
                }
                existingBusSchedule.BusScheduleStops.Add(new BusScheduleStop { StopId = stop.Id });
            }
        }

        // Save changes to context
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task DeleteBusSchedule(int id)
    {
        // Find existing bus schedule
        var busSchedule = await _context.BusSchedules.FindAsync(id);
        if (busSchedule == null) // Throw exception if not found
            throw new KeyNotFoundException("Bus schedule not found.");

        // Remove the bus schedule
        _context.BusSchedules.Remove(busSchedule);
        // Save changes to context
        await _context.SaveChangesAsync();
    }
}
