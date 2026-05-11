using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using skyora1.Models;
using skyora1.Repository;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessage msgRepository;
        public MessageController(IMessage msgRepository)
        {
            this.msgRepository = msgRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await msgRepository.GetMessages();
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> AddMessage(Messages message)
        {
            var data = await msgRepository.AddMessage(message);
            return Ok(data);
        }
    }
}
