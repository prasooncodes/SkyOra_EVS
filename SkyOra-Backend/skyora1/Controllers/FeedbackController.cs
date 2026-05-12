using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using skyora1.DTO;
using skyora1.Models;
using skyora1.Repository;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedback feedbackRepository;
        public FeedbackController(IFeedback feedbackRepository)
        {
            this.feedbackRepository = feedbackRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetFeedbacks()
        {
            var feedbacks = await feedbackRepository.GetFeedbacks();
            return Ok(feedbacks);
        }

        [HttpPost]
        public async Task<IActionResult> AddFeedback(Feedback feedback)
        {
            var data = await feedbackRepository.AddFeedback(feedback);
            return Ok(data);
        }

    }
}
