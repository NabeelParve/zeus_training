using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace myapi.Models{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions options) : base(options){

        }

        public DbSet<User> users {get; set;}

    }

}