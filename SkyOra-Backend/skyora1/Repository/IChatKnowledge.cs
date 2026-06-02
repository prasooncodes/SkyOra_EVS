namespace skyora1.Repository
{
    public interface IChatKnowledge
    {
        Task<string> GetLiveFlightSchedulesAsync();
        string GetStaticAirlinePolicies();
    }
}
