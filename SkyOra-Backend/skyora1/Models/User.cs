using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace skyora1.Models
{
    public class User
    {
        
        [Key]
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;  // Admin / User
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
       [JsonIgnore]
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    }
}

