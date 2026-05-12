using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.Migrations;
using skyora1.Models;

namespace skyora1.Repository
{
    public class RepositoryMessage : IMessage
    {
        private readonly AppDbContext appDBContext;
        public RepositoryMessage(AppDbContext appDBContext)
        {
            this.appDBContext = appDBContext;
        }
        public async Task<int> AddMessage(Messages message)
        {
            await appDBContext.AddAsync(message);
            await appDBContext.SaveChangesAsync();
            return message.MessageId;
        }

        public async Task<List<Messages>> GetMessages()
        {
            var data = await appDBContext.messages.ToListAsync();
            return data;
        }
    }
}
