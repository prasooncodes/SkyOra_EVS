using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace skyora1.Models
{
    public class Passenger
    {
        [Key]
        public int PassengerId { get; set; }

        // ✅ Correct FK
        public int BookingId { get; set; }
        [JsonIgnore]

        [ForeignKey(nameof(BookingId))]
        public Booking Booking { get; set; }

        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
    }
}