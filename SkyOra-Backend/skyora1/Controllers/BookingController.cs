using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using skyora1.DTO;
using Microsoft.EntityFrameworkCore;
using skyora1.Models;
using skyora1.Repository;
using System.Security.Claims;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Configuration;
using skyora1.DAL;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBooking _booking;
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public BookingController(IBooking booking, AppDbContext db, IConfiguration config)
    {
        _booking = booking;
        _db = db;
        _config = config;
    }

    // GET: api/Booking/flight/{flightId}/reserved-seats
    [HttpGet("flight/{flightId}/reserved-seats")]
    public async Task<IActionResult> GetReservedSeats(int flightId)
    {
        try
        {
            var seats = await _db.bookings
                .Where(b => b.FlightId == flightId)
                .SelectMany(b => b.Passengers)
                .Select(p => p.SeatNumber)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .Distinct()
                .ToListAsync();

            return Ok(seats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to fetch reserved seats.", detail = ex.Message });
        }
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
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(int id, [FromBody] EditBookingDto bookingDto)
    {
        try
        {
            var updatedBooking = await _booking.UpdateBooking(id, bookingDto);
            if (updatedBooking == null)
                return NotFound("Booking Not Found");
            return Ok(updatedBooking);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error during booking update.", detail = ex.Message });
        }
    }

    // POST: api/Booking/{id}/sendticket
    [HttpPost("{id}/sendticket")]
    public async Task<IActionResult> SendTicket(int id)
    {
        try
        {
            var booking = await _booking.GetBookingById(id);
            if (booking == null) return NotFound("Booking not found");

            var user = await _db.users.FindAsync(booking.UserId);
            if (user == null || string.IsNullOrEmpty(user.Email))
                return BadRequest(new { message = "User or user email not found." });

            // Read SMTP configuration
            var host = _config["Smtp:Host"];
            var portStr = _config["Smtp:Port"];
            var enableSslStr = _config["Smtp:EnableSsl"];
            var username = _config["Smtp:Username"];
            var password = _config["Smtp:Password"];
            var from = _config["Smtp:From"] ?? username ?? "no-reply@skyora.com";

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(portStr))
            {
                return StatusCode(500, new { message = "SMTP configuration is missing. Please configure Smtp settings in appsettings.json or appsettings.Development.json." });
            }

            if (!int.TryParse(portStr, out int port)) port = 25;
            var enableSsl = bool.TryParse(enableSslStr, out var es) && es;

            // Build simple HTML email with booking summary
            var sb = new StringBuilder();
            sb.AppendLine($"<h2>SkyOra Ticket - Booking #{booking.BookingId}</h2>");
            sb.AppendLine($"<p>Passenger Count: {booking.NumberOfPassengers}</p>");
            sb.AppendLine($"<p>Total Amount: {booking.TotalAmount:C}</p>");
            sb.AppendLine($"<p>Departure Date: {booking.BookingDate.ToString()}</p>");
            if (booking.ReturnDate != default)
            {
                sb.AppendLine($"<p>Return Date: {booking.ReturnDate.ToString()}</p>");
            }
            if (booking.Flight != null)
            {
                sb.AppendLine($"<p>Flight: {booking.Flight.FlightNo} - {booking.Flight.Source} to {booking.Flight.Destination}</p>");
                sb.AppendLine($"<p>Departure: {booking.Flight.DepartureTime}</p>");
            }
            if (booking.Passengers != null && booking.Passengers.Any())
            {
                sb.AppendLine("<h3>Passengers</h3>");
                sb.AppendLine("<ul>");
                foreach (var p in booking.Passengers)
                {
                    var seatInfo = string.IsNullOrWhiteSpace(p.SeatNumber)
                        ? string.Empty
                        : $" - Seat {p.SeatNumber} ({p.SeatType})";

                    sb.AppendLine($"<li>{p.Name} ({p.Age}) - {p.Gender}{seatInfo}</li>");
                }
                sb.AppendLine("</ul>");
            }

            var message = new MailMessage();
            message.From = new MailAddress(from);
            message.To.Add(user.Email);
            message.Subject = $"SkyOra Ticket - Booking #{booking.BookingId}";
            message.Body = sb.ToString();
            message.IsBodyHtml = true;

            using (var client = new SmtpClient(host, port))
            {
                client.EnableSsl = enableSsl;
                if (!string.IsNullOrEmpty(username))
                {
                    client.Credentials = new System.Net.NetworkCredential(username, password);
                }
                client.Send(message);
            }

            return Ok(new { message = "Ticket emailed successfully." });
        }
        catch (SmtpException sx)
        {
            return StatusCode(500, new { message = "Failed to send email.", detail = sx.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error while sending ticket.", detail = ex.Message });
        }
    }
}