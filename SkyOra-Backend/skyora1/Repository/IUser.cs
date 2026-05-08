using skyora1.DTO;
using skyora1.Models;

namespace skyora1.Repository
{
    public interface IUser
    {
        Task<List<User>> GetAllUsers();
        Task<User> GetUserById(int empid);
        Task<int> AddUser(UserDto userDto);
        Task<int> UpdateUser(int id, UpdateUserDto updateUserDto);
        Task<int> DeleteUser(int id);
    }
}
