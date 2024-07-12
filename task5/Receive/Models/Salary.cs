using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using FluentValidation;

namespace Receive.Models
{
    public class Salary
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id{ get; set; }  
        public int UserId { get; set; }
        public required string year {get; set;}
        [DataType(DataType.Currency)] 
        public decimal amount { get; set; }
    }


    class SalaryValidator : AbstractValidator<Salary>{
        public SalaryValidator(){
            RuleFor(Salary => Salary.UserId).NotNull().GreaterThan(0);
            RuleFor(Salary => Salary.year).NotNull().NotEmpty();
            RuleFor(Salary => Salary.amount).GreaterThanOrEqualTo(0);
        }

    }
}