using System.ComponentModel.DataAnnotations;

namespace skyora1.Models
{
    public class Messages
    {
        [Key]
        public int MessageId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;

    }
}
