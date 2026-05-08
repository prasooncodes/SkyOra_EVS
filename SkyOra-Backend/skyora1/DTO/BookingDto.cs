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
    }
    public class GetBookingDto
    {
        public int UserId { get; set; }

        public int BookingId { get; set; }
        public int FlightId { get; set; }

        public int NumberOfPassengers { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();

    }
}
