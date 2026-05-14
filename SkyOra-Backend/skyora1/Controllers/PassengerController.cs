using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using skyora1.DTO;
using skyora1.Models;
using skyora1.Repository;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PassengerController : ControllerBase
    {
        private readonly IPassenger _passengerRepository;

        public PassengerController(IPassenger passengerRepository)
        {
            _passengerRepository = passengerRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPassengers()
        {
            var passengers = await _passengerRepository.GetAllPassengerAsync();
            return Ok(passengers);
        }

        [HttpPost]
        public async Task<IActionResult> AddPassenger(PassengerDTO passenger)
        {
            var newPassengerId = await _passengerRepository.AddPassengersAsync(passenger);
            return Ok(new { PassengerId = newPassengerId });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPassengerByBookingId(int id)
        {
            var passengers = await _passengerRepository.GetPassengersByBookingIdAsync(id);

            if(passengers == null || passengers.Count() == 0 )
            {
                return NotFound(new { message = $"No Passengers found for this booking" });
            }

            return Ok(passengers);

        }
    }
}
