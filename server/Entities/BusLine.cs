using System.ComponentModel.DataAnnotations.Schema;

namespace server.Entities
{
    public class BusLine
    {
        public int Id { get; set; }

        // Foreign key for the start city
        public int StartCityId { get; set; }
        [ForeignKey("StartCityId")]
        public City StartCity { get; set; }

        // Foreign key for the destination city
        public int DestinationCityId { get; set; }
        [ForeignKey("DestinationCityId")]
        public City DestinationCity { get; set; }
    }
}