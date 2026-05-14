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
<<<<<<< HEAD
        public List<PassengerDTO> Passengers { get; set; } = new List<PassengerDTO>();
=======
        public DateOnly BookingDate { get; set; }
        public DateOnly ReturnDate { get; set; }
>>>>>>> 3e4896d93bbfc99fb3a7c31580d04cf8cadd8586
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
    
    // ✅ NEW: Flight DTO for displaying flight information
    public class FlightDto
    {
        public int FlightId { get; set; }
        public string FlightNo { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public decimal BusinessPrice { get; set; }
        public decimal EconomyPrice { get; set; }
    }
}
