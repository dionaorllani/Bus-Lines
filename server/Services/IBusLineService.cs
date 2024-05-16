using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IBusLineService
    {
        Task<List<BusLine>> GetBusLinesAsync(string startCityName = null, string destinationCityName = null);
        public Task<BusLine> GetBusLineAsync(int id);
        public Task<BusLine> AddBusLineAsync(BusLineDTO busLineDTO);
        public Task UpdateBusLineAsync(int id, BusLineDTO busLineDTO);
        public Task DeleteBusLineAsync(int id);
    }
}