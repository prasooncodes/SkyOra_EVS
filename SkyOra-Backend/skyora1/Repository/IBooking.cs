using skyora1.DTO;
using skyora1.Models;

namespace skyora1.Repository
{
    public interface IBooking
    {
        Task<List<GetBookingDto>> GetBookingAsync();
        Task<GetBookingDto> GetBookingById(int id);
        Task<int> DeleteBooking(int  id);
        Task<int> AddBooking(BookingDto booking);
    }
}
