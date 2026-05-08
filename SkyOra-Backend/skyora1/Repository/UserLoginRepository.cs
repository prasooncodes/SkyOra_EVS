using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.DTO;
using skyora1.Models;

namespace skyora1.Repository
{
    public class UserLoginRepository:IUserLogin
    {
        AppDbContext appDbContext;
        public UserLoginRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
            
        }
        public async Task<UserLoginDto> Login(string email, string password,string confirmpassword)
        {
            if (password != confirmpassword)

                return new UserLoginDto
                {
                    message = "Password and confirm password do not match"
                };


            var data = await appDbContext.users.Where(x=>x.Email==email).FirstOrDefaultAsync();
            if(data==null)
            {

                return new UserLoginDto
                {
                    message = "User not found"
                };

            }

            if (data != null)
            {
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, data.PasswordHash);
                if (!isPasswordValid)
                {

                    return new UserLoginDto
                    {
                        message = "Invalid password"
                    };

                }


                return new UserLoginDto
                {
                    Email = data.Email,
                    message = "Login Successful"
                };
            }

            return null;
        }
    }
}
