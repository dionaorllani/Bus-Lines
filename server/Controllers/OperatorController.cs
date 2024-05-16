using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OperatorController : ControllerBase
    {
        private readonly IOperatorService _operatorService;

        public OperatorController(IOperatorService operatorService)
        {
            _operatorService = operatorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOperators()
        {
            var operators = await _operatorService.GetOperatorsAsync();
            return Ok(operators);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOperator(int id)
        {
            var oper = await _operatorService.GetOperatorByIdAsync(id);
            if (oper == null)
            {
                return NotFound();
            }
            return Ok(oper);
        }

        [HttpPost]
        public async Task<IActionResult> AddOperator([FromBody] OperatorDTO operatorDTO)
        {
            try
            {
                var oper = await _operatorService.AddOperatorAsync(operatorDTO);
                return CreatedAtAction(nameof(GetOperator), new { id = oper.Id }, oper);
            }
            catch (ArgumentException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOperator(int id, [FromBody] OperatorDTO operatorDTO)
        {
            try
            {
                await _operatorService.UpdateOperatorAsync(id, operatorDTO);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOperator(int id)
        {
            try
            {
                await _operatorService.DeleteOperatorAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
