import { Injectable } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { Observable, of } from 'rxjs';
import { ActiveQuestionnaire, Question, QuestionTemplate, User } from '../../models/questionare';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  constructor(
    private dataService: MockDataService
  ) {}

  // Template Management Methods (Newly Added)
  // Get all templates
  getTemplates(): Observable<QuestionTemplate[]> {
    return this.dataService.getTemplates();
  }

  // Create a new template
  createTemplate(template: QuestionTemplate): Observable<void> {
    return this.dataService.createTemplate(template)
  }

  // Update an existing template
  updateTemplate(template: QuestionTemplate)  {
    return this.dataService.updateTemplate(template)
  }

    // Delete a template by ID
    deleteTemplate(templateId: string): Observable<void> {
      return this.dataService.deleteTemplate(templateId)
    }
  

  // Dashboard
  getActiveQuestionnairePage(filter: any, page: number, limit: number): Observable<ActiveQuestionnaire[]> {
    return this.dataService.getActiveQuestionnairePage(filter, page, limit);
  }

  // Questionnaire Methods
  getActiveQuestionnaireById(id: string): Observable<ActiveQuestionnaire | null> {
    return this.dataService.getActiveQuestionnaireById(id);
  }

  getQuestionsForUser(templateId: string): Observable<Question[]> {
    return this.dataService.getQuestionsForUser(templateId);
  }

  submitUserAnswers(userId: number | null, role: string, answers: Question[], questionnaireId: string | null): Observable<void> {
    return this.dataService.submitData(userId, role, questionnaireId!, answers);
  }

  validateUserAccess(userId: any, role: string, questionnaireId: string): Observable<boolean> {
    return this.dataService.validateUserAccess(userId, role, questionnaireId);
  }

}
