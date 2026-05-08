using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.DTO;
using skyora1.Models;

namespace skyora1.Repository
{
    public class RepositoryFlight : IFlights
    {
        private readonly AppDbContext _context;

        public RepositoryFlight(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddFlightAsync(FlightDto flight)
        {
            var Flight = new skyora1.Models.Flight
            {
                // Don't map FlightId if it's auto-incrementing (Identity)
                FlightNo = flight.FlightNo,
                Source = flight.Source,
                Destination = flight.Destination,
                DepartureTime = flight.DepartureTime,
                ArrivalTime = flight.ArrivalTime,
                TotalBusinessSeats = flight.TotalBusinessSeats,
                TotalEconomySeats = flight.TotalEconomySeats,
                AvailableBusinessSeats = flight.AvailableBusinessSeats,
                AvailableEconomySeats = flight.AvailableEconomySeats,
                BusinessPrice = flight.BusinessPrice,
                EconomyPrice = flight.EconomyPrice
            };
            await _context.flights.AddAsync(Flight);
            await _context.SaveChangesAsync();
            return Flight.FlightId;
        }

        public async Task<int> DeleteFlightAsync(int id)
        {
            var data = await _context.flights.Where(x => x.FlightId == id).FirstOrDefaultAsync();

            if (data != null)
            {
                _context.flights.Remove(data);
                await _context.SaveChangesAsync();
                return data.FlightId;

            }
            else
            {
                throw new KeyNotFoundException($"Flight with ID {id} not found.");
            }
        }

        public async Task<IEnumerable<Flight>> GetAllFlightsAsync()
        {
            var allFlights = await _context.flights.ToListAsync();
            return allFlights;
        }

        public async Task<Flight> GetFlightByIdAsync(int id)
        {
            var flight = _context.flights.Where(f => f.FlightId == id).FirstOrDefaultAsync();
            if (flight == null)
            {
                throw new KeyNotFoundException($"Flight with ID {id} not found.");
            }
            return await flight;
        }

        public async Task<int> EditFlightAsync(int id, FlightDto flight)
        {
            var data = await _context.flights.Where(x => x.FlightId == id).FirstOrDefaultAsync();

            if(data != null)
            {
                data.FlightNo = flight.FlightNo;
                data.Source = flight.Source;
                data.Destination = flight.Destination;
                data.DepartureTime = flight.DepartureTime;
                data.FlightId = flight.FlightId;
                data.TotalBusinessSeats = flight.TotalBusinessSeats;
                data.TotalEconomySeats = flight.TotalEconomySeats;
                data.AvailableBusinessSeats = flight.AvailableBusinessSeats;
                data.AvailableEconomySeats = flight.AvailableEconomySeats;
                data.BusinessPrice = flight.BusinessPrice;
                data.EconomyPrice = flight.EconomyPrice;

                await _context.SaveChangesAsync();
                return data.FlightId;
            }
            else
            {
                throw new KeyNotFoundException($"Flight with ID {id} not found.");
            }
        }
    }
}
