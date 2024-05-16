using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("[controller]")]
[ApiController]
public class BusScheduleController : ControllerBase
{
    private readonly IBusScheduleService _busScheduleService;

    public BusScheduleController(IBusScheduleService busScheduleService)
    {
        _busScheduleService = busScheduleService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BusScheduleDTO>>> GetBusSchedules(
        [FromQuery] string startCityName = null,
        [FromQuery] string destinationCityName = null,
        [FromQuery] DateTime? departureDate = null)
    {
        var busScheduleDTOs = await _busScheduleService.GetBusSchedules(startCityName, destinationCityName, departureDate);
        return busScheduleDTOs;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BusScheduleDTO>> GetBusSchedule(int id)
    {
        var busScheduleDTO = await _busScheduleService.GetBusSchedule(id);
        if (busScheduleDTO == null)
        {
            return NotFound();
        }
        return busScheduleDTO;
    }

    [HttpPost]
    public async Task<ActionResult<BusScheduleDTO>> AddBusSchedule(BusScheduleDTO busScheduleDTO)
    {
        try
        {
            var addedBusScheduleDTO = await _busScheduleService.AddBusSchedule(busScheduleDTO);
            return CreatedAtAction(nameof(GetBusSchedule), new { id = addedBusScheduleDTO.Id }, addedBusScheduleDTO);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBusSchedule(int id, BusScheduleDTO busScheduleDTO)
    {
        try
        {
            bool updated = await _busScheduleService.UpdateBusSchedule(id, busScheduleDTO);
            if (!updated)
                return NotFound();
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBusSchedule(int id)
    {
        try
        {
            await _busScheduleService.DeleteBusSchedule(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}