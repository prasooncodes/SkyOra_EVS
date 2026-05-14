using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using skyora1.DTO;
using skyora1.Models;
using skyora1.Repository;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBooking _booking;

    public BookingController(IBooking booking)
    {
        _booking = booking;
    }

    // ✅ GET ALL
    [HttpGet]
    public async Task<IActionResult> GetAllBooking()
    {
        return Ok(await _booking.GetBookingAsync());
    }

    // ✅ GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookingById(int id)
    {
        var result = await _booking.GetBookingById(id);
        if (result == null)
            return NotFound("Booking Not Found");

        return Ok(result);
    }

    // ✅ ADD BOOKING
    [HttpPost]
    public async Task<IActionResult> AddBooking([FromBody] BookingDto bookingDto)
    {
        // 1. Safely extract User ID from the JWT Token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "User session expired. Please login again." });
        }

        if (!int.TryParse(userIdClaim, out int userId))
        {
            return BadRequest(new { message = "Invalid User ID format in token." });
        }

        // 2. Assign the ID from the Token to the DTO (Prevents identity theft)
        bookingDto.UserId = userId;

        // 3. Basic Validation
        if (bookingDto.NumberOfPassengers <= 0)
        {
            return BadRequest(new { message = "You must book at least one seat." });
        }

        try
        {
            var resultId = await _booking.AddBooking(bookingDto);

            if (resultId == 0) return BadRequest(new { message = "Failed to create booking." });

            // ✅ FIX: Fetch the complete booking with passengers from database
            var savedBooking = await _booking.GetBookingById(resultId);

            // ✅ Return the complete GetBookingDto containing BookingId, Passengers, and all data
            return CreatedAtAction(nameof(GetBookingById), new { id = resultId }, savedBooking);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error during booking.", detail = ex.Message });
        }
    }

    // ✅ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var result = await _booking.DeleteBooking(id);
        if (result == 404)
            return NotFound("Booking Not Found");

        return Ok("Booking Deleted Successfully");
    }
}