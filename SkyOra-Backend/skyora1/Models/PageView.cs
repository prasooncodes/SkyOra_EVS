using System;

namespace skyora1.Models
{
    public class PageView
    {
        public int PageViewId { get; set; }
        public string PageName { get; set; } = null!;
        public int Count { get; set; }
        public DateTime FirstViewed { get; set; }
        public DateTime LastViewed { get; set; }
    }
}
