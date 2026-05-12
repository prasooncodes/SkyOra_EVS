using System.ComponentModel.DataAnnotations;

namespace skyora1.Models
{
    public class Feedback
    {
        [Key]
        public int FeedbackId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Comments { get; set;} = string.Empty;
    }
}
