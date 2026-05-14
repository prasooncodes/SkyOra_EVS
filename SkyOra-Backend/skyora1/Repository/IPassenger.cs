using skyora1.DTO;
using skyora1.Models;

namespace skyora1.Repository
{
    public interface IPassenger
    {
        Task<List<Passenger>> GetAllPassengerAsync();
        Task<int> AddPassengersAsync(PassengerDTO passenger);

        Task<List<Passenger>> GetPassengersByBookingIdAsync(int bookingId);

    }
}
