using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.Models;

namespace skyora1.Repository
{
    public class RepositoryFeedback : IFeedback
    {
        private readonly AppDbContext appDBContext;
        public RepositoryFeedback(AppDbContext appDBContext)
        {
            this.appDBContext = appDBContext;
        }
        public async Task<int> AddFeedback(Feedback feedback)
        {
            await appDBContext.AddAsync(feedback);
            await appDBContext.SaveChangesAsync();   
            return feedback.FeedbackId;
        }

        public async Task<List<Feedback>> GetFeedbacks()
        {
            var data = await appDBContext.feedbacks.ToListAsync();
            return data;
        }
    }
}
