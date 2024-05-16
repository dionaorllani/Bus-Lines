namespace server.Models
{
    public class BusScheduleDTO
    {
        public int Id { get; set; }
        // Foreign key for BusLineId
        public string StartCityName { get; set; }
        public string DestinationCityName { get; set; }

        // Foreign key for OperatorId

        public string OperatorName { get; set; }

        public DateTime Departure { get; set; }

        public DateTime Arrival { get; set; }

        public double Price { get; set; }

        public List<string> StationNames { get; set; } // Property to store station names


    }
}
