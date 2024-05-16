using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IBusScheduleService
    {
        public Task<List<BusScheduleDTO>> GetBusSchedules(string startCityName, string destinationCityName, DateTime? departureDate);
        public Task<BusScheduleDTO> GetBusSchedule(int id);
        public Task<BusScheduleDTO> AddBusSchedule(BusScheduleDTO busScheduleDTO);
        public Task<bool> UpdateBusSchedule(int id, BusScheduleDTO busScheduleDTO);
        public Task DeleteBusSchedule(int id);

    }
}