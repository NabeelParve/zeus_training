using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace MyApp.Models
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
}