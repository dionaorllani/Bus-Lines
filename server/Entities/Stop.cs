using server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace server.Entities
{
    public class Stop
    {
        public int Id { get; set; }
        public string StationName { get; set; }
        // Foreign key for City
        public int CityId { get; set; }
        [ForeignKey("CityId")]
        public City City { get; set; }

        //Navigation property for many-to-many relationship with BusSchedules
        public ICollection<BusScheduleStop> BusScheduleStops { get; set; }

        // Soft delete property
        public bool IsDeleted { get; set; } = false;
    }
}
