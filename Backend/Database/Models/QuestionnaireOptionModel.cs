namespace Database.Models;

internal class QuestionnaireOptionModel
{
    internal int Id { get; set; }
    internal required int OptionValue { get; set; }
    internal required string DisplayText { get; set; }
    internal required int QuestionId { get; set; }

    // External navigational properties and references
    internal required QuestionnaireQuestionModel Question { get; set; }
}
