namespace server.Models
{
    public class StopDTO
    {
        public int Id { get; set; }
        public string StationName { get; set; }
        public string CityName { get; set; }

        // Navigation properties
        public ICollection<int> BusScheduleIds { get; set; } // For referencing BusScheduleIds associated with this Stop
    }
}