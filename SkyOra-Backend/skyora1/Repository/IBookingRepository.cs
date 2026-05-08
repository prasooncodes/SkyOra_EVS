using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.DTO;
using skyora1.Models;

namespace skyora1.Repository
{
    public class IBookingRepository : IBooking
    {
        private readonly AppDbContext appDbContext;
        public IBookingRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
            
        }
        public async Task<int> AddBooking(BookingDto booking)
        {
            var book= new Booking
            {
                UserId = booking.UserId,
                FlightId=booking.FlightId,
                NumberOfPassengers=booking.NumberOfPassengers,
                TotalAmount=booking.TotalAmount,
                BookingStatus=booking.BookingStatus
            };
            await appDbContext.bookings.AddAsync(book);
            await appDbContext.SaveChangesAsync();
            return booking.BookingId;

        }

        public async Task<int> DeleteBooking(int id)
        {
            var bookingelement=await appDbContext.bookings.FirstOrDefaultAsync(x=>x.BookingId==id);
            if (bookingelement != null)
            {
                appDbContext.bookings.Remove(bookingelement);
                appDbContext.SaveChanges();
                return id;

            }
            else
                return 404;
        }
        public async Task<List<GetBookingDto>> GetBookingAsync()
        {
            return await appDbContext.bookings
                .Include(b => b.Passengers)
                .Select(b => new GetBookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    FlightId = b.FlightId,
                    NumberOfPassengers = b.NumberOfPassengers,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus,
                    Passengers = b.Passengers
                })
                .ToListAsync();
        }


        public async Task<GetBookingDto> GetBookingById(int id)
        {
            return await appDbContext.bookings
                .Include(b => b.Passengers)
                .Where(b => b.BookingId == id)
                .Select(b => new GetBookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    FlightId = b.FlightId,
                    NumberOfPassengers = b.NumberOfPassengers,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus,
                    Passengers = b.Passengers
                })
                .FirstOrDefaultAsync();
        }
    }
}
