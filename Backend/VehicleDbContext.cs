using Microsoft.EntityFrameworkCore;

public class VehicleDbContext : DbContext
{
    public DbSet<Vehicle> Vehicles { get; set; }

    public VehicleDbContext(DbContextOptions<VehicleDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder) { }
}
