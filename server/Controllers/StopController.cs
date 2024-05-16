using Microsoft.AspNetCore.Mvc;
using server.DTOs;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StopController : ControllerBase
    {
        private readonly IStopService _stopService;

        public StopController(IStopService stopService)
        {
            _stopService = stopService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StopDTO>>> GetStops()
        {
            var stops = await _stopService.GetStopsAsync();
            return stops;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StopDTO>> GetStop(int id)
        {
            var stop = await _stopService.GetStopByIdAsync(id);
            if (stop == null)
            {
                return NotFound();
            }
            return stop;
        }

        [HttpPost]
        public async Task<ActionResult<StopDTO>> PostStop(StopPostDTO stopDTO)
        {
            try
            {
                var stop = await _stopService.AddStopAsync(stopDTO);
                return CreatedAtAction(nameof(GetStop), new { id = stop.Id }, stop);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStop(int id, [FromBody] StopPostDTO stopDto)
        {
            try
            {
                await _stopService.UpdateStopAsync(id, stopDto);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStop(int id)
        {
            try
            {
                await _stopService.DeleteStopAsync(id);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
