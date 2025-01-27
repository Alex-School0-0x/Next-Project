namespace API.Models.Responses;

public record class AuthenticationToken
{
    public required string Token { get; set; }
    public required string TokenType { get; set; }
}
