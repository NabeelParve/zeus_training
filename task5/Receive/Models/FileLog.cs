namespace Receive.Models;

public class FileLog
{
    public string filename { get; set; } = null!;

    public DateTime? Timestamp  { get; set; }

    public string? status {get; set;}
}