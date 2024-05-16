using server.Models;

namespace server.Services
{
    public interface IStopService
    {
        public Task<List<StopDTO>> GetStopsAsync();
        public Task<StopDTO> GetStopByIdAsync(int id);
        public Task<StopDTO> AddStopAsync(StopPostDTO stopDTO);
        public Task UpdateStopAsync(int id, StopPostDTO stopDTO);
        public Task DeleteStopAsync(int id);

    }
}