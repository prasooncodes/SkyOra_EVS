using Microsoft.EntityFrameworkCore;
using System.Linq;
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
            var flightExists = await appDbContext.flights.AnyAsync(f => f.FlightId == booking.FlightId);
            if (!flightExists) throw new Exception("Flight with the specified ID does not exist.");

            var book = new Booking
            {
                UserId = booking.UserId,

                FlightId = booking.FlightId,
                NumberOfPassengers = booking.NumberOfPassengers,
                TotalAmount = booking.TotalAmount,
                BookingStatus = booking.BookingStatus,
                Passengers = new List<Passenger>(), // ✅ Initialize passengers collection
                BookingDate=booking.BookingDate,
                ReturnDate=booking.ReturnDate,
            };

            // Validate seat selections to prevent double-booking
            var incomingSeats = booking.Passengers?.Where(p => !string.IsNullOrWhiteSpace(p.SeatNumber)).Select(p => p.SeatNumber).ToList() ?? new List<string>();

            // Check duplicates within the incoming request
            var duplicateInRequest = incomingSeats.GroupBy(s => s).FirstOrDefault(g => g.Count() > 1)?.Key;
            if (!string.IsNullOrEmpty(duplicateInRequest))
            {
                throw new Exception($"Duplicate seat selection in request: {duplicateInRequest}");
            }

            // Check seats already reserved for this flight
            var existingSeats = await appDbContext.bookings
                .Where(b => b.FlightId == booking.FlightId)
                .SelectMany(b => b.Passengers)
                .Select(p => p.SeatNumber)
                .Where(s => !string.IsNullOrWhiteSpace(s))
                .ToListAsync();

            var conflictingSeat = incomingSeats.Intersect(existingSeats).FirstOrDefault();
            if (!string.IsNullOrEmpty(conflictingSeat))
            {
                throw new Exception($"Seat {conflictingSeat} is already reserved. Please choose a different seat.");
            }

            // ✅ Add passengers to the booking if provided
            if (booking.Passengers != null && booking.Passengers.Count > 0)
            {
                foreach (var passengerDto in booking.Passengers)
                {
                    var passenger = new Passenger
                    {
                        Name = passengerDto.Name,
                        Age = passengerDto.Age,
                        Gender = passengerDto.Gender,
                        SeatNumber = passengerDto.SeatNumber,
                        SeatType = passengerDto.SeatType
                        // ✅ Don't set BookingId - EF will set it automatically when booking is saved
                    };
                    book.Passengers.Add(passenger);
                }
            }

            await appDbContext.bookings.AddAsync(book);
            await appDbContext.SaveChangesAsync();
            return book.BookingId;
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
                .Include(b => b.Passengers) // ✅ CRITICAL LINK: Tells EF Core to fetch the passengers for each booking row
                .Include(b => b.Flight) // ✅ NEW: Include flight details
                .Select(b => new GetBookingDto
                {
                    UserId = b.UserId,
                    BookingId = b.BookingId,
                    FlightId = b.FlightId,
                    NumberOfPassengers = b.NumberOfPassengers,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus,         
                    Passengers = b.Passengers, // ✅ Maps the records cleanly into your GetBookingDto list
                    Flight = new FlightDto // ✅ Map flight details
                    {
                        FlightId = b.Flight.FlightId,
                        FlightNo = b.Flight.FlightNo,
                        Source = b.Flight.Source,
                        Destination = b.Flight.Destination,
                        DepartureTime = b.Flight.DepartureTime,
                        ArrivalTime = b.Flight.ArrivalTime,
                        BusinessPrice = b.Flight.BusinessPrice,
                        EconomyPrice = b.Flight.EconomyPrice
                    }
                }).ToListAsync();
                   
        }
        public async Task<int> UpdateBooking(int id, EditBookingDto booking)
        {
            var bookingelement = await appDbContext.bookings.FirstOrDefaultAsync(x => x.BookingId == id);
            if (bookingelement != null)
            {
                bookingelement.TotalAmount = booking.TotalAmount;
                bookingelement.BookingDate=booking.BookingDate;
                bookingelement.ReturnDate=booking.ReturnDate;
                appDbContext.bookings.Update(bookingelement);
                appDbContext.SaveChanges();
                return bookingelement.BookingId;
            }
            else
                return 404;
        }



        public async Task<GetBookingDto> GetBookingById(int id)
        {
            return await appDbContext.bookings
                .Include(b => b.Passengers)
                .Include(b => b.Flight)
                .Where(b => b.BookingId == id)
                .Select(b => new GetBookingDto
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    FlightId = b.FlightId,
                    NumberOfPassengers = b.NumberOfPassengers,
                    TotalAmount = b.TotalAmount,
                    BookingStatus = b.BookingStatus,
                    Passengers = b.Passengers,

                    Flight = new FlightDto
                    {
                        FlightId = b.Flight.FlightId,
                        FlightNo = b.Flight.FlightNo,
                        Source = b.Flight.Source,
                        Destination = b.Flight.Destination,
                        DepartureTime = b.Flight.DepartureTime,
                        ArrivalTime = b.Flight.ArrivalTime,
                        BusinessPrice = b.Flight.BusinessPrice,
                        EconomyPrice = b.Flight.EconomyPrice
                    }, // ✅ Fixed: Added missing comma here

                    BookingDate = b.BookingDate,
                    ReturnDate = b.ReturnDate
                }) // ✅ Fixed: Removed the stray '=' character
                .FirstOrDefaultAsync();
        }

    }
}
