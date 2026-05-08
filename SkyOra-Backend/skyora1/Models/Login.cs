using System.ComponentModel.DataAnnotations;

namespace skyora1.Models
{
    public class Login
    {

        [Required(ErrorMessage = "email is required.")]
        [StringLength(100, ErrorMessage = "email must be less than 100 characters.")]
        public string email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters.")]
        public string password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirm Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Confirm Password must be between 6 and 100 characters.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
