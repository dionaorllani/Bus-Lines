using Microsoft.EntityFrameworkCore;
using server.Entities;

namespace server.DataAccess
{
    public class BusDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public BusDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public DbSet<City> Cities { get; set; }
        public DbSet<Operator> Operators { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<BusLine> BusLines { get; set; }
        public DbSet<BusSchedule> BusSchedules { get; set; }
        public DbSet<Stop> Stops { get; set; }
        public DbSet<BusScheduleStop> BusScheduleStops { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure the relationship between BusLine and City
            modelBuilder.Entity<BusLine>()
                .HasOne(bl => bl.StartCity)
                .WithMany()
                .HasForeignKey(bl => bl.StartCityId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<BusLine>()
                .HasOne(bl => bl.DestinationCity)
                .WithMany()
                .HasForeignKey(bl => bl.DestinationCityId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure the many-to-many relationship
            modelBuilder.Entity<BusScheduleStop>()
                .HasKey(bs => new { bs.BusScheduleId, bs.StopId });

            modelBuilder.Entity<BusScheduleStop>()
                .HasOne(bs => bs.BusSchedule)
                .WithMany(bs => bs.BusScheduleStops)
                .HasForeignKey(bs => bs.BusScheduleId);

            modelBuilder.Entity<BusScheduleStop>()
                .HasOne(bs => bs.Stop)
                .WithMany(bs => bs.BusScheduleStops)
                .HasForeignKey(bs => bs.StopId);

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");

                optionsBuilder.UseSqlServer(connectionString);
            }
    }
}
