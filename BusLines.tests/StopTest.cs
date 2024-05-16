using Moq;
using Xunit;
using server.Controllers;
using server.Models;
using server.Services;
using Microsoft.AspNetCore.Mvc;

namespace BusLines.tests
{
    public class StopTest
    {
        private readonly Mock<IStopService> _stopService;

        public StopTest()
        {
            _stopService = new Mock<IStopService>();
        }

        [Fact]
        public async Task GetStops_ShouldReturnListOfStops()
        {
            // Arrange
            var stops = new List<StopDTO>();

            _stopService.Setup(x => x.GetStopsAsync()).ReturnsAsync(stops);

            var stopController = new StopController(_stopService.Object);

            // Act
            var result = await stopController.GetStops();

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetStopById_ShouldReturnStopById()
        {
            // Arrange
            var stop = new StopDTO();

            _stopService.Setup(x => x.GetStopByIdAsync(It.IsAny<int>())).ReturnsAsync(stop);

            var stopController = new StopController(_stopService.Object);

            // Act
            var result = await stopController.GetStop(1);

            // Assert
            Assert.IsType<ActionResult<StopDTO>>(result);
        }

        [Fact]
        public async Task UpdateStop_ShouldReturnNoContent()
        {
            // Arrange
            _stopService.Setup(x => x.UpdateStopAsync(It.IsAny<int>(), It.IsAny<StopPostDTO>()))
                .Returns(Task.CompletedTask);

            var stopController = new StopController(_stopService.Object);

            // Act
            var result = await stopController.UpdateStop(1, new StopPostDTO());

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateStop_ShouldReturnNotFoundWhenStopNotFound()
        {
            // Arrange
            _stopService.Setup(x => x.UpdateStopAsync(It.IsAny<int>(), It.IsAny<StopPostDTO>()))
                .ThrowsAsync(new ArgumentException("Stop not found."));

            var stopController = new StopController(_stopService.Object);

            // Act
            var result = await stopController.UpdateStop(1, new StopPostDTO());

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Stop not found.", notFoundResult.Value);
        }


    }
}