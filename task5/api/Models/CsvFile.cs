using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Models{
    public class CsvFile{
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id{ get; set; }  
        public required string Name{ get; set; }
        public required byte[] Content { get; set; }

    }
}