using skyora1.DTO;

namespace skyora1.Repository
{
    public interface IUserLogin
    {
        Task<UserLoginDto> Login(string email, string password, string confirmpassword);
    }
}
