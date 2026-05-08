using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace skyora1.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }

        // ✅ Foreign Key to Users table
        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        // ✅ Foreign Key to Flights table
        public int FlightId { get; set; }

        [ForeignKey(nameof(FlightId))]
        public Flight Flight { get; set; }

        public int NumberOfPassengers { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } = string.Empty;
        public ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
    }
}
