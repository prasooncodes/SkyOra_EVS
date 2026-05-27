using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using skyora1.Models;

namespace skyora1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext appDbContext;

        public AnalyticsController(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        [HttpPost("track")]
        public async Task<IActionResult> TrackPage([FromBody] PageViewTrackDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.PageName))
            {
                return BadRequest("PageName is required.");
            }

            var pageName = dto.PageName.Trim();
            var pageView = await appDbContext.pageViews.FirstOrDefaultAsync(x => x.PageName == pageName);

            if (pageView == null)
            {
                pageView = new PageView
                {
                    PageName = pageName,
                    Count = 1,
                    FirstViewed = DateTime.UtcNow,
                    LastViewed = DateTime.UtcNow,
                };
                appDbContext.pageViews.Add(pageView);
            }
            else
            {
                pageView.Count += 1;
                pageView.LastViewed = DateTime.UtcNow;
            }

            await appDbContext.SaveChangesAsync();
            return Ok(new { pageView.PageName, pageView.Count, pageView.LastViewed });
        }

        [HttpGet]
        public async Task<IActionResult> GetPageViews()
        {
            var result = await appDbContext.pageViews
                .OrderByDescending(x => x.Count)
                .ToListAsync();
            return Ok(result);
        }
    }

    public record PageViewTrackDto(string PageName, DateTime? Timestamp);
}
