using server.Entities;
using server.Models;

namespace server.Services
{
    public interface ICityService
    {
        public Task<List<City>> GetCitiesAsync();
        public Task<City> GetCityByIdAsync(int id);
        public Task<City> AddCityAsync(CityDTO cityDTO);
        public Task UpdateCityAsync(int id, CityDTO cityDTO);
        public Task DeleteCityAsync(int id);

    }
}
