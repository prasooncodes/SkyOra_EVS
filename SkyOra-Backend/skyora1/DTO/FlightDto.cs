using System.ComponentModel.DataAnnotations;

namespace skyora1.DTO
{
    public class FlightDto
    {
        [Key]
        public int FlightId { get; set; }
        public string FlightNo { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public int TotalBusinessSeats { get; set; }
        public int TotalEconomySeats { get; set; }
        public int AvailableBusinessSeats { get; set; }
        public int AvailableEconomySeats { get; set; }

        public decimal BusinessPrice { get; set; }
        public decimal EconomyPrice { get; set; }
    }
}
