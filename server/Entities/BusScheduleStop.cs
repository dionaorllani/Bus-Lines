namespace server.Entities
{
    public class BusScheduleStop
    {
        public int BusScheduleId { get; set; }
        public BusSchedule BusSchedule { get; set; }

        public int StopId { get; set; }
        public Stop Stop { get; set; }
    }
}