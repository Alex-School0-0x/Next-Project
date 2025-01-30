using Microsoft.Extensions.Logging;

namespace Database.Models;

public class ApplicationLogsModel
{
    public int Id { get; set; }
    public required string Message { get; set; }
    public required LogLevel LogLevel { get; set; }
    public DateTime Timestamp { get; set; }
    public required int EventId { get; set; }
    public required string Category { get; set; }
    public string? Exception { get; set; }
}
