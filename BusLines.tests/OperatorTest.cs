using Moq;
using server.Controllers;
using server.Entities;
using server.Services;
using server.Models;
using Microsoft.AspNetCore.Mvc;

namespace BusLines.tests
{
    public class OperatorTest
    {
        private readonly Mock<IOperatorService> _operatorService;

        public OperatorTest()
        {
            _operatorService = new Mock<IOperatorService>();
        }

        [Fact]
        public async Task GetOperators_ShouldReturnListOfOperators()
        {
            // Arrange
            var operators = new List<Operator>();

            _operatorService.Setup(x => x.GetOperatorsAsync()).ReturnsAsync(operators);

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.GetOperators();

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task AddOperator_ShouldReturnCreatedOperator()
        {
            // Arrange
            var operatorDTO = new OperatorDTO { Name = "New Operator" };
            var expectedOperator = new Operator { Id = 1, Name = "New Operator" };

            _operatorService.Setup(x => x.AddOperatorAsync(It.IsAny<OperatorDTO>()))
                .ReturnsAsync(expectedOperator);

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.AddOperator(operatorDTO);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var createdOperator = Assert.IsAssignableFrom<Operator>(createdResult.Value);
            Assert.Equal(expectedOperator.Id, createdOperator.Id);
            Assert.Equal(expectedOperator.Name, createdOperator.Name);
        }

        [Fact]
        public async Task AddOperator_ShouldReturnConflictWhenOperatorAlreadyExists()
        {
            // Arrange
            var operatorDTO = new OperatorDTO { Name = "New Operator" };
            var existingOperator = new Operator { Id = 1, Name = "New Operator" };

            _operatorService.Setup(x => x.AddOperatorAsync(It.IsAny<OperatorDTO>()))
                .ThrowsAsync(new ArgumentException("Operator already exists."));

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.AddOperator(operatorDTO);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result);
            Assert.Equal("Operator already exists.", conflictResult.Value);
        }

        [Fact]
        public async Task UpdateOperator_ShouldReturnNoContent()
        {
            // Arrange
            int operatorId = 1;
            var operatorDTO = new OperatorDTO { Name = "Updated Operator Name" };

            _operatorService.Setup(x => x.UpdateOperatorAsync(operatorId, It.IsAny<OperatorDTO>()))
                .Returns(Task.CompletedTask);

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.UpdateOperator(operatorId, operatorDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task UpdateOperator_ShouldReturnNotFoundWhenOperatorNotFound()
        {
            // Arrange
            int operatorId = 1;
            var operatorDTO = new OperatorDTO { Name = "Updated Operator Name" };

            _operatorService.Setup(x => x.UpdateOperatorAsync(operatorId, It.IsAny<OperatorDTO>()))
                .ThrowsAsync(new ArgumentException("Operator not found."));

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.UpdateOperator(operatorId, operatorDTO);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Operator not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task DeleteOperator_ShouldReturnNoContent()
        {
            // Arrange
            int operatorId = 1;

            _operatorService.Setup(x => x.DeleteOperatorAsync(operatorId))
                .Returns(Task.CompletedTask);

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.DeleteOperator(operatorId);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteOperator_ShouldReturnNotFoundWhenOperatorNotFound()
        {
            // Arrange
            int operatorId = 1;

            _operatorService.Setup(x => x.DeleteOperatorAsync(operatorId))
                .ThrowsAsync(new ArgumentException("Operator not found."));

            var operatorController = new OperatorController(_operatorService.Object);

            // Act
            var result = await operatorController.DeleteOperator(operatorId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Operator not found.", notFoundResult.Value);
        }
    }
}