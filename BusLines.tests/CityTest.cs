using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Controllers;
using server.Entities;
using server.Models;
using server.Services;

namespace BusLines.tests
{
    public class CityTest
    {
        private readonly Mock<ICityService> _cityService;

        public CityTest()
        {
            _cityService = new Mock<ICityService>();
        }
        [Fact]
        public void Test1()
        {
            var cities = getCities();
             _cityService.Setup(x => x.GetCitiesAsync()).Returns(cities);
            var cityController = new CityController(_cityService.Object);
            var result = cityController.GetCities().Result;
            Assert.NotNull(result);
        }

        public async Task<List<City>> getCities()
        {
            return new List<City>();
        }

        [Fact]
        public async Task AddCity_ShouldReturnCreatedCity()
        {
            // Arrange
            var cityDTO = new CityDTO { Name = "New York" };
            var expectedCity = new City { Id = 1, Name = "New York" };

            _cityService.Setup(x => x.AddCityAsync(It.IsAny<CityDTO>()))
                .ReturnsAsync(expectedCity);

            var cityController = new CityController(_cityService.Object);

            // Act
            var result = await cityController.AddCity(cityDTO);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var createdCity = Assert.IsAssignableFrom<City>(createdResult.Value);
            Assert.Equal(expectedCity.Id, createdCity.Id);
            Assert.Equal(expectedCity.Name, createdCity.Name);
        }

        [Fact]
        public async Task AddCity_ShouldReturnConflictWhenCityAlreadyExists()
        {
            // Arrange
            var cityDTO = new CityDTO { Name = "New York" };
            var existingCity = new City { Id = 1, Name = "New York" };

            _cityService.Setup(x => x.AddCityAsync(It.IsAny<CityDTO>()))
                .ThrowsAsync(new ArgumentException("City already exists."));

            var cityController = new CityController(_cityService.Object);

            // Act
            var result = await cityController.AddCity(cityDTO);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.Equal("City already exists.", conflictResult.Value);
        }

        [Fact]
        public async Task UpdateCity_ShouldReturnNoContent()
        {
            // Arrange
            int cityId = 1;
            var cityDTO = new CityDTO { Name = "Updated City Name" };

            _cityService.Setup(x => x.UpdateCityAsync(cityId, It.IsAny<CityDTO>()))
                .Returns(Task.CompletedTask);

            var cityController = new CityController(_cityService.Object);

            // Act
            var result = await cityController.UpdateCity(cityId, cityDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateCity_ShouldReturnNotFoundWhenCityNotFound()
        {
            // Arrange
            int cityId = 1;
            var cityDTO = new CityDTO { Name = "Updated City Name" };

            _cityService.Setup(x => x.UpdateCityAsync(cityId, It.IsAny<CityDTO>()))
                .ThrowsAsync(new ArgumentException("City not found."));

            var cityController = new CityController(_cityService.Object);

            // Act
            var result = await cityController.UpdateCity(cityId, cityDTO);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("City not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task DeleteCity_ShouldReturnNoContent()
        {
            // Arrange
            int cityId = 1;

            _cityService.Setup(x => x.DeleteCityAsync(cityId))
                .Returns(Task.CompletedTask);

            var cityController = new CityController(_cityService.Object);

            // Act
            var result = await cityController.DeleteCity(cityId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteCity_ShouldReturnNotFoundWhenCityNotFound()
        {
            // Arrange
            int cityId = 1;

            _cityService.Setup(x => x.DeleteCityAsync(cityId))
                .ThrowsAsync(new ArgumentException("City not found."));

            var cityController = new CityController(_cityService.Object);

            // Act
            var result = await cityController.DeleteCity(cityId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("City not found.", notFoundResult.Value);
        }
    }
}