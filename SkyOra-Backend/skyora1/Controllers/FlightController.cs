using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using skyora1.DAL;
using skyora1.Repository;
using skyora1.Models;
using skyora1.DTO;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        readonly IFlights _flightRepository;

        public FlightController(IFlights flightRepository)
        {
            _flightRepository = flightRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllFlights()
        {
            var flights = await _flightRepository.GetAllFlightsAsync();
            return Ok(flights);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlightById(int id)
        {
            try
            {
                var flight = await _flightRepository.GetFlightByIdAsync(id);
                return Ok(flight);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddFlight(FlightDto flight)
        {
            try
            {
                if (flight == null)
                {
                    return BadRequest("Flight data is invalid.");
                }

                var newFlightId = await _flightRepository.AddFlightAsync(flight);

                return CreatedAtAction(nameof(GetFlightById), new { id = newFlightId }, flight);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> EditFlight(int id, FlightDto flight)
        {
            try
            {
                if (id != flight.FlightId)
                {
                    return BadRequest("Flight ID mismatch");
                }

                await _flightRepository.EditFlightAsync(id, flight);
                return Ok(new { Message = "Flight updated successfully", Id = flight.FlightId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Update failed: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            try
            {
                await _flightRepository.DeleteFlightAsync(id);
                return Ok(new { Message = $"Flight with ID {id} was successfully deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
