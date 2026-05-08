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
    }
}
