namespace skyora1.DTO
{
    public class UserLoginDto
    {
        public string Email { get; set; }= string.Empty;
        public string Password { get; set; }=string.Empty;
        public string ConfirmPassword {  get; set; }=string.Empty;
        public string message {  get; set; }=string.Empty;
    }
}
