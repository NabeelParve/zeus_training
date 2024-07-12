using Microsoft.EntityFrameworkCore;
using MyApp.Models;

namespace MyApp.Contexts
{
    public class MyAppContext : DbContext
    {
        public MyAppContext(DbContextOptions<MyAppContext> options) : base(options)
        {

        }

        public DbSet<User> User { get; set; } = null!;
        public DbSet<Salary> Salary { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Salary>()
                .HasKey(a => new { a.UserId, a.year });
        }
    }
}