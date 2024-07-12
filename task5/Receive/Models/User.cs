using System.ComponentModel.DataAnnotations;
using FluentValidation;


namespace Receive.Models{
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
    public required Salary[] Salaries {get; set;}
    }

    class UserValidator : AbstractValidator<User>{
        public UserValidator(){
            RuleFor(User => User.UserId).NotNull().GreaterThan(0);
            RuleFor(User => User.Email).NotNull().NotEmpty().EmailAddress();
            RuleFor(User => User.Name).NotNull().NotEmpty();
            RuleFor(User => User.Country).NotNull().NotEmpty();
            RuleFor(User => User.State).NotNull().NotEmpty();
            RuleFor(User => User.City).NotNull().NotEmpty();
            RuleFor(User => User.TelephoneNumber).NotNull().NotEmpty();
            RuleFor(User => User.AddressLine1).NotNull().NotEmpty();
            RuleFor(User => User.AddressLine2).NotNull().NotEmpty();
        }
    }
}