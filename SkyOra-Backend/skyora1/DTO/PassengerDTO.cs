namespace skyora1.DTO
{
    public class PassengerDTO
    {
        public int PassengerId { get; set; }
        public int BookingId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public string Gender {  get; set; }
    }
}
