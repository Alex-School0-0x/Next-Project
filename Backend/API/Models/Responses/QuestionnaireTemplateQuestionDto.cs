namespace API.Models.Responses;

public record class QuestionnaireTemplateQuestionDto
{
    public required string Prompt { get; set; }
    public required bool AllowCustom { get; set; }
    public required List<QuestionnaireTemplateOptionDto> Options { get; set; }
}
