using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.DTO;
using skyora1.Models;


namespace skyora1.Repository
{
    public class RepositoryUser : IUser
    {
        private readonly AppDbContext appDBContext;

        public RepositoryUser(AppDbContext appDBContext)
        {
            this.appDBContext = appDBContext;
        }

        public async Task<int> AddUser(UserDto userDto)
        {
            var user = new skyora1.Models.User
            {
                Name = userDto.Name,
                Age = userDto.Age,
                Gender = userDto.Gender,
                Role = userDto.Role,
                Email = userDto.Email,
                PasswordHash = userDto.PasswordHash
            };
            await appDBContext.users.AddAsync(user);
            await appDBContext.SaveChangesAsync();
            return user.UserId;
        }

        public async Task<int> DeleteUser(int id)
        {
            var data = await appDBContext.users.Where(x => x.UserId == id).FirstOrDefaultAsync();
            if (data != null)
            {
                appDBContext.users.Remove(data);
                await appDBContext.SaveChangesAsync();
                return data.UserId;
            }
            return 0;
        }

        public async Task<List<User>> GetAllUsers()
        {
            var data = await appDBContext.users.ToListAsync();
            return data;
        }

        public async Task<User> GetUserById(int userid)
        {
            var data = await appDBContext.users.Where(x => x.UserId == userid).FirstOrDefaultAsync();
            return data;
        }

        public async Task<int> UpdateUser(int id, UpdateUserDto user)
        {
            var data = await appDBContext.users.Where(x => x.UserId == id).FirstOrDefaultAsync();
            if (data != null)
            {
                data.Name = user.Name;
                data.Age = user.Age;
                data.Gender = user.Gender;
                data.Role = user.Role;
                data.Email = user.Email;
                data.PasswordHash = user.PasswordHash;
                await appDBContext.SaveChangesAsync();
                return data.UserId;
            }
            else
            {
                return 0;
            }
        }
    }
}
