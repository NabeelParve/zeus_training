using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Models{
    public class User {

    [Key]
    public int UserId { get; set; }

    [EmailAddress]
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string Country { get; set; }
    public required string State { get; set; }
    public required string City { get; set; }
    public required string TelephoneNumber { get; set; }
    public required string AddressLine1 { get; set; }
    public required string AddressLine2 { get; set; }
    public  required string DateOfBirth { get; set; }
    }
}