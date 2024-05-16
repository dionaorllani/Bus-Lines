using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class Ticket
    {
        public int Id { get; set; }

        // Foreign key for UserId
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        // Foreign key for BusScheduleId
        public int BusScheduleId { get; set; }
        [ForeignKey("BusScheduleId")]
        public BusSchedule BusSchedule { get; set; }
        public int Seat { get; set; }
        public DateTime DateOfBooking { get; set; }

    }
}
