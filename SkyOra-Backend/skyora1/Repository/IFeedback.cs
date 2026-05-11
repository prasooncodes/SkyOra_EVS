using skyora1.Models;

namespace skyora1.Repository
{
    public interface IFeedback
    {
        Task<List<Feedback>> GetFeedbacks();
        Task<int> AddFeedback(Feedback feedback);
    }
}
