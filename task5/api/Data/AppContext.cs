using Microsoft.EntityFrameworkCore;


    public class AppContext : DbContext
    {
        public AppContext (DbContextOptions<AppContext> options)
            : base(options)
        {
        }

        public DbSet<MyApp.Models.User> User { get; set; } = default!;
    }
