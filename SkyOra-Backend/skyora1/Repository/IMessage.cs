using skyora1.Models;

namespace skyora1.Repository
{
    public interface IMessage
    {
        Task<List<Messages>> GetMessages();
        Task<int> AddMessage(Messages message);
    }
}
