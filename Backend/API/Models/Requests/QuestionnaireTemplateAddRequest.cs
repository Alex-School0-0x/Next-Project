namespace API.Models.Requests;

public class QuestionnaireTemplateAddRequest
{
    public required string TemplateTitle { get; set; }
    public required List<QuestionnaireTemplateQuestionAddRequest> QuestionnaireTemplateQuestions { get; set; }
}
