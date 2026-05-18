using skyora1.Models;

namespace skyora1.DTO
{
    public class BookingDto
    {
        public int UserId { get; set; }

        public int BookingId { get; set; }
        public int FlightId { get; set; }

        public int NumberOfPassengers { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;

        public List<PassengerDTO> Passengers { get; set; } = new List<PassengerDTO>();

        public DateOnly BookingDate { get; set; }
        public DateOnly ReturnDate { get; set; }
    }
    public class GetBookingDto
    {
        public int UserId { get; set; }

        public int BookingId { get; set; }
        public int FlightId { get; set; }

        public int NumberOfPassengers { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public DateOnly BookingDate { get; set; }
        public DateOnly ReturnDate { get; set; }
        public ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
        
        // ✅ NEW: Include Flight details for displaying flight information in booking view
        public FlightDto Flight { get; set; }
    }
    public class EditBookingDto
    {
        public decimal TotalAmount { get; set; }
        public DateOnly BookingDate { get; set; }
        public DateOnly ReturnDate { get; set; }
    }
}
