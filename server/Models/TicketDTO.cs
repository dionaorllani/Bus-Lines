namespace server.Models
{
    public class TicketDTO
    {
        public int UserId { get; set; } // User ID
        public int BusScheduleId { get; set; } // BusSchedule ID
        public int Seat { get; set; }
        public DateTime DateOfBooking { get; set; }
    }
}