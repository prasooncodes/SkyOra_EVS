using Microsoft.AspNetCore.Mvc;
using skyora1.DTO;
using skyora1.Models;
using skyora1.Repository;

[Route("api/[controller]")]
[ApiController]
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
    public async Task<IActionResult> AddBooking([FromBody] BookingDto booking)
    {
        var bookingId = await _booking.AddBooking(booking);
        return CreatedAtAction(nameof(GetBookingById),
            new { id = bookingId },
            booking);
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