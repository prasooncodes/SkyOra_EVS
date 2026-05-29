using Microsoft.EntityFrameworkCore;
using skyora1.Models;

namespace skyora1.DAL
{
    public class AppDbContext:DbContext
    {
        public AppDbContext()
        {

        }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> users { get; set; }
        public DbSet<Flight> flights { get; set; }
        public DbSet<Booking> bookings { get; set; }
        public DbSet<Passenger> passengers { get; set; }
        public DbSet<Feedback> feedbacks { get; set; }
        public DbSet<Messages> messages { get; set; }
        public DbSet<PageView> pageViews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed flight data to populate operational cities
            var departureDate = new DateTime(2026, 5, 13, 8, 0, 0);
            modelBuilder.Entity<Flight>().HasData(
                new Flight { FlightId = 1, FlightNo = "SK101", Source = "Mumbai", Destination = "Delhi", DepartureTime = departureDate.AddHours(0), ArrivalTime = departureDate.AddHours(3), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 15000, EconomyPrice = 8000 },
                new Flight { FlightId = 2, FlightNo = "SK102", Source = "Delhi", Destination = "Bengaluru", DepartureTime = departureDate.AddHours(1), ArrivalTime = departureDate.AddHours(5), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 14000, EconomyPrice = 7500 },
                new Flight { FlightId = 3, FlightNo = "SK103", Source = "Bengaluru", Destination = "Chennai", DepartureTime = departureDate.AddHours(2), ArrivalTime = departureDate.AddHours(4), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 10000, EconomyPrice = 5500 },
                new Flight { FlightId = 4, FlightNo = "SK104", Source = "Mumbai", Destination = "Pune", DepartureTime = departureDate.AddHours(3), ArrivalTime = departureDate.AddHours(5), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 6000, EconomyPrice = 3000 },
                new Flight { FlightId = 5, FlightNo = "SK105", Source = "Delhi", Destination = "Jaipur", DepartureTime = departureDate.AddHours(4), ArrivalTime = departureDate.AddHours(5), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 5000, EconomyPrice = 2500 },
                new Flight { FlightId = 6, FlightNo = "SK106", Source = "Kolkata", Destination = "Delhi", DepartureTime = departureDate.AddHours(5), ArrivalTime = departureDate.AddHours(8), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 12000, EconomyPrice = 6500 },
                new Flight { FlightId = 7, FlightNo = "SK107", Source = "Hyderabad", Destination = "Bengaluru", DepartureTime = departureDate.AddHours(6), ArrivalTime = departureDate.AddHours(8), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 9000, EconomyPrice = 4500 },
                new Flight { FlightId = 8, FlightNo = "SK108", Source = "Mumbai", Destination = "Ahmedabad", DepartureTime = departureDate.AddHours(7), ArrivalTime = departureDate.AddHours(9), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 8000, EconomyPrice = 4000 },
                new Flight { FlightId = 9, FlightNo = "SK109", Source = "Kochi", Destination = "Bengaluru", DepartureTime = departureDate.AddHours(8), ArrivalTime = departureDate.AddHours(10), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 9500, EconomyPrice = 5000 },
                new Flight { FlightId = 10, FlightNo = "SK110", Source = "Lucknow", Destination = "Delhi", DepartureTime = departureDate.AddHours(9), ArrivalTime = departureDate.AddHours(11), TotalBusinessSeats = 32, TotalEconomySeats = 150, AvailableBusinessSeats = 32, AvailableEconomySeats = 150, BusinessPrice = 7000, EconomyPrice = 3500 }
            );
        }
        }
}
