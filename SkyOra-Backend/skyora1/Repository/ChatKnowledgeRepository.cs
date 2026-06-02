using Microsoft.EntityFrameworkCore;
using skyora1.DAL;
using System.Text;

namespace skyora1.Repository
{
    public class ChatKnowledgeRepository : IChatKnowledge
    {
        private readonly AppDbContext _context;

        public ChatKnowledgeRepository(AppDbContext context)
        {
            _context = context;
        }

        // 🧠 Live Knowledge: Reads directly from your active SQL tables
        public async Task<string> GetLiveFlightSchedulesAsync()
        {
            var flights = await _context.flights.AsNoTracking().ToListAsync();
            var sb = new StringBuilder();
            sb.AppendLine("Current Operational Flight Schedules:");

            foreach (var f in flights)
            {
                sb.AppendLine($"- Flight {f.FlightNo}: From {f.Source} to {f.Destination}. Economy: ₹{f.EconomyPrice}, Business: ₹{f.BusinessPrice}. Available Economy Seats: {f.AvailableEconomySeats}.");
            }
            return sb.ToString();
        }

        // 🧠 Static Knowledge: Hardcoded business guidelines that rarely change
        public string GetStaticAirlinePolicies()
        {
            return "SkyOra Baggage Policies:\n" +
                   "- Cabin Baggage: 1 piece up to 7kg free of charge.\n" +
                   "- Check-in Baggage: 15kg included on Economy tickets, 30kg included on Business tickets.\n" +
                   "SkyOra Hub Locations: Our major hubs are Mumbai, Delhi, and Bengaluru.\n" +
                   "Cancellation Penalty: Cancellations incur a 50% penalty fee, with a 50% refund processed automatically.";
        }
    }
}
