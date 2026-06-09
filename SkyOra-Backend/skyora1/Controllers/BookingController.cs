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
using Microsoft.Extensions.Logging;
using PdfSharpCore;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using System.Net;

[Route("api/[controller]")]
[ApiController]
//[Authorize]
public class BookingController : ControllerBase
{
    private readonly IBooking _booking;
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly ILogger<BookingController> _logger;

    public BookingController(IBooking booking, AppDbContext db, IConfiguration config, ILogger<BookingController> logger)
    {
        _booking = booking;
        _db = db;
        _config = config;
        _logger = logger;
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

            var user = await _db.users.FindAsync(userId);
            if (user != null && !string.IsNullOrWhiteSpace(user.Email))
            {
                var emailResult = await TrySendTicketEmailAsync(savedBooking, user.Email);
                if (!emailResult.Success)
                {
                    _logger.LogWarning("Booking {BookingId} was created but ticket email could not be sent. {Reason}", savedBooking.BookingId, emailResult.Message);
                }
            }

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

            var emailResult = await TrySendTicketEmailAsync(booking, user.Email);
            if (!emailResult.Success)
            {
                return StatusCode(500, new { message = "Failed to send email.", detail = emailResult.Message });
            }

            return Ok(new { message = emailResult.Message });
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

    private async Task<(bool Success, string Message)> TrySendTicketEmailAsync(GetBookingDto booking, string recipientEmail)
    {
        var host = _config["Smtp:Host"];
        var portStr = _config["Smtp:Port"];
        var enableSslStr = _config["Smtp:EnableSsl"];
        var username = _config["Smtp:Username"];
        var password = _config["Smtp:Password"];
        var from = _config["Smtp:From"] ?? username ?? "no-reply@skyora.com";

        if (string.IsNullOrWhiteSpace(host) || string.IsNullOrWhiteSpace(portStr) ||
            string.Equals(host, "smtp.example.com", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogWarning("SMTP is not configured for booking {BookingId}; skipping ticket email.", booking.BookingId);
            return (false, "SMTP configuration is missing.");
        }

        if (!int.TryParse(portStr, out int port)) port = 25;
        var enableSsl = bool.TryParse(enableSslStr, out var es) && es;

        var pdfBytes = GenerateTicketPdfBytes(booking);
        var passengerHtml = new StringBuilder();
        if (booking.Passengers != null && booking.Passengers.Any())
        {
            passengerHtml.AppendLine("<ul>");
            foreach (var p in booking.Passengers)
            {
                var seatInfo = string.IsNullOrWhiteSpace(p.SeatNumber)
                    ? string.Empty
                    : $" - Seat {p.SeatNumber} ({p.SeatType})";

                passengerHtml.AppendLine($"<li>{p.Name} ({p.Age}) - {p.Gender}{seatInfo}</li>");
            }
            passengerHtml.AppendLine("</ul>");
        }
        else
        {
            passengerHtml.AppendLine("<p>No passenger details were provided.</p>");
        }

        var htmlBody = $@"
<html>
  <body style='font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;'>
    <h2 style='color: #0f766e;'>SkyOra Flight Ticket</h2>
    <p>Dear traveler,</p>
    <p>Your flight ticket for booking #{booking.BookingId} is attached as a PDF. Please keep it safe for check-in and travel documentation.</p>
    <p><strong>Route:</strong> {(booking.Flight != null ? $"{booking.Flight.Source} to {booking.Flight.Destination}" : "N/A")}<br/>
    <strong>Departure Date:</strong> {booking.BookingDate:dd MMM yyyy}<br/>
    <strong>Total Amount:</strong> {booking.TotalAmount:C}<br/>
    <strong>Passenger Count:</strong> {booking.NumberOfPassengers}</p>
    <h3>Passengers</h3>
    {passengerHtml}
    <p>Thank you for choosing SkyOra.</p>
  </body>
</html>";

        var message = new MailMessage();
        message.From = new MailAddress(from);
        message.To.Add(recipientEmail);
        message.Subject = $"SkyOra Ticket - Booking #{booking.BookingId}";
        message.Body = htmlBody;
        message.IsBodyHtml = true;
        message.Attachments.Add(new Attachment(new MemoryStream(pdfBytes), "SkyOra_Ticket.pdf", "application/pdf"));

        try
        {
            using (var client = new SmtpClient(host, port))
            {
                client.EnableSsl = enableSsl;
                if (!string.IsNullOrWhiteSpace(username))
                {
                    client.Credentials = new NetworkCredential(username, password);
                }
                await client.SendMailAsync(message);
            }

            return (true, "Ticket emailed successfully with PDF attachment.");
        }
        catch (SmtpException sx)
        {
            _logger.LogError(sx, "Failed to send ticket email for booking {BookingId}.", booking.BookingId);
            return (false, sx.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while sending ticket email for booking {BookingId}.", booking.BookingId);
            return (false, ex.Message);
        }
    }

    private static byte[] GenerateTicketPdfBytes(GetBookingDto booking)
    {
        var document = new PdfDocument();
        var page = document.AddPage();
        page.Size = PageSize.A4;
        page.Orientation = PageOrientation.Portrait;

        using var gfx = XGraphics.FromPdfPage(page);
        var fontTitle = new XFont("Segoe UI", 24, XFontStyle.Bold);
        var fontSubtitle = new XFont("Segoe UI", 14, XFontStyle.Bold);
        var fontBody = new XFont("Segoe UI", 11);
        var fontSmall = new XFont("Segoe UI", 9);
        var fontBold = new XFont("Segoe UI", 11, XFontStyle.Bold);

        var backgroundBrush = new XSolidBrush(XColor.FromArgb(0xEE, 0xF2, 0xFF));
        var headerBrush = new XLinearGradientBrush(new XPoint(0, 0), new XPoint(0, 220), XColor.FromArgb(0x5C, 0x0F, 0xD9), XColor.FromArgb(0xFF, 0x63, 0x00));

        gfx.DrawRectangle(backgroundBrush, 0, 0, page.Width.Point, page.Height.Point);

        gfx.DrawRoundedRectangle(new XPen(XColors.Transparent), headerBrush, 30, 30, 535, 140, 24, 24);
        gfx.DrawString("SkyOra Airlines", fontTitle, XBrushes.White, new XRect(50, 55, 500, 40), XStringFormats.TopLeft);
        gfx.DrawString("CONFIRMED", new XFont("Segoe UI", 13, XFontStyle.Bold), XBrushes.White, new XRect(390, 70, 120, 24), XStringFormats.TopLeft);

        var routeBoxWidth = 160;
        var routeBoxHeight = 80;
        var routeY = 210;
        var routeXPositions = new[] { 40, 220, 400 };
        var routeLabels = new[] { "Departure", "Flight Number", "Arrival" };
        var routeValues = new[]
        {
            booking.Flight?.Source ?? "Unknown",
            booking.Flight?.FlightNo ?? booking.FlightId.ToString(),
            booking.Flight?.Destination ?? "Unknown"
        };

        for (var i = 0; i < routeXPositions.Length; i++)
        {
            gfx.DrawRoundedRectangle(new XPen(XColor.FromArgb(0xE8, 0xEA, 0xFF)), new XSolidBrush(XColor.FromArgb(0xF8, 0xF9, 0xFF)), routeXPositions[i], routeY, routeBoxWidth, routeBoxHeight, 18, 18);
            gfx.DrawString(routeValues[i], fontSubtitle, XBrushes.Black, new XRect(routeXPositions[i] + 16, routeY + 20, routeBoxWidth - 20, 30), XStringFormats.TopLeft);
            gfx.DrawString(routeLabels[i], fontSmall, XBrushes.Gray, new XRect(routeXPositions[i] + 16, routeY + 48, routeBoxWidth - 20, 20), XStringFormats.TopLeft);
        }

        var detailBoxes = new[]
        {
            ("Travel Date", booking.BookingDate.ToString("dd MMM yyyy")),
            ("Boarding Time", booking.Flight?.DepartureTime.ToString("HH:mm") ?? booking.BookingDate.ToString("HH:mm")),
            ("Arrival Time", booking.Flight?.ArrivalTime.ToString("HH:mm") ?? booking.ReturnDate.ToString("HH:mm")),
            ("Class", booking.Passengers?.FirstOrDefault()?.SeatType ?? "Economy"),
            ("Gate", "TBD"),
            ("PNR", booking.FlightId.ToString())
        };

        var detailX = new[] { 40, 220, 400 };
        var detailY = 320;
        var detailWidth = 150;
        var detailHeight = 70;
        for (var i = 0; i < detailBoxes.Length; i++)
        {
            var x = detailX[i % 3];
            var y = detailY + (i / 3) * 90;
            gfx.DrawRoundedRectangle(new XPen(XColor.FromArgb(0xE5, 0xE7, 0xEB)), new XSolidBrush(XColors.White), x, y, detailWidth, detailHeight, 16, 16);
            gfx.DrawString(detailBoxes[i].Item1, new XFont("Segoe UI", 9, XFontStyle.Bold), XBrushes.Gray, new XRect(x + 12, y + 10, detailWidth - 20, 16), XStringFormats.TopLeft);
            gfx.DrawString(detailBoxes[i].Item2, fontBody, XBrushes.Black, new XRect(x + 12, y + 32, detailWidth - 20, 26), XStringFormats.TopLeft);
        }

        gfx.DrawString("Passengers", fontSubtitle, XBrushes.Black, new XRect(40, 500, 200, 24), XStringFormats.TopLeft);
        gfx.DrawRectangle(new XPen(XColor.FromArgb(0xE5, 0xE7, 0xEB)), 40, 525, 515, 140);
        gfx.DrawRectangle(new XPen(XColor.FromArgb(0xE5, 0xE7, 0xEB)), 40, 525, 515, 30);
        gfx.DrawString("Name", fontBold, XBrushes.Black, new XRect(50, 532, 140, 20), XStringFormats.TopLeft);
        gfx.DrawString("Age", fontBold, XBrushes.Black, new XRect(205, 532, 40, 20), XStringFormats.TopLeft);
        gfx.DrawString("Gender", fontBold, XBrushes.Black, new XRect(300, 532, 70, 20), XStringFormats.TopLeft);
        gfx.DrawString("Seat Type", fontBold, XBrushes.Black, new XRect(420, 532, 100, 20), XStringFormats.TopLeft);

        var rowY = 560;
        if (booking.Passengers != null && booking.Passengers.Any())
        {
            foreach (var passenger in booking.Passengers)
            {
                gfx.DrawString(passenger.Name, fontBody, XBrushes.Black, new XRect(50, rowY, 140, 20), XStringFormats.TopLeft);
                gfx.DrawString(passenger.Age.ToString(), fontBody, XBrushes.Black, new XRect(205, rowY, 40, 20), XStringFormats.TopLeft);
                gfx.DrawString(passenger.Gender, fontBody, XBrushes.Black, new XRect(300, rowY, 70, 20), XStringFormats.TopLeft);
                gfx.DrawString(passenger.SeatType, fontBody, XBrushes.Black, new XRect(420, rowY, 100, 20), XStringFormats.TopLeft);
                rowY += 24;
            }
        }
        else
        {
            gfx.DrawString("No passenger details were provided.", fontBody, XBrushes.Black, new XRect(50, rowY, 300, 20), XStringFormats.TopLeft);
        }

        gfx.DrawString("Please arrive at the boarding gate 45 minutes before departure and keep this ticket handy for verification.", fontSmall, XBrushes.Gray, new XRect(40, 690, 360, 42), XStringFormats.TopLeft);
        gfx.DrawRoundedRectangle(new XPen(XColor.FromArgb(0x0D, 0x1E, 0x3D)), new XSolidBrush(XColor.FromArgb(0x0D, 0x1E, 0x3D)), 430, 690, 120, 50, 16, 16);
        gfx.DrawString("BOARDING READY", new XFont("Segoe UI", 9, XFontStyle.Bold), XBrushes.White, new XRect(440, 706, 100, 20), XStringFormats.Center);

        using var stream = new MemoryStream();
        document.Save(stream, false);
        return stream.ToArray();
    }
}