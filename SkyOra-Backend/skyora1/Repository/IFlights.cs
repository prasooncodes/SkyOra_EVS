using System.Collections.Generic;
using skyora1.DTO;
using skyora1.Models;
namespace skyora1.Repository
{
    public interface IFlights
    {
        Task<IEnumerable<Flight>> GetAllFlightsAsync();
        Task<Flight> GetFlightByIdAsync(int id);
        Task<int> AddFlightAsync(FlightDto flight);
        Task<int> EditFlightAsync(int id,FlightDto flight);
        Task<int> DeleteFlightAsync(int id);
    }
}
