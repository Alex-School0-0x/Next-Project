import { Injectable } from '@angular/core';
import { MockDataService } from './mock-data.service';
import { Observable } from 'rxjs';
import { ActiveQuestionnaire, Question, User } from '../../models/questionare';
import { DashboardFilter, DashboardSection } from '../../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  constructor(
    private dataService: MockDataService
  ) {}

  // Dashboard
  getPaginatedDashboardData(
    section: DashboardSection,
    filter: DashboardFilter | null = null, // Filter applies only to generalResults
    offset: number = 0,
    limit: number = 5,
    searchQuery?: string){
      return this.dataService.getPaginatedDashboardData(section,filter,offset,limit,searchQuery)
    }
  
  getDashboardData(role:string): Observable<{ students: User[], activeQuestionnaires: ActiveQuestionnaire[] }> {
    return this.dataService.getDashboardData(role);
  }

  addStudentToQuestionnaire(studentId: number): Observable<void> {
    return this.dataService.addStudentToQuestionnaire(studentId);
  }

  createActiveQuestionnaire(studentId: number, teacherId: number): Observable<ActiveQuestionnaire> {
    return this.dataService.createActiveQuestionnaire(studentId, teacherId);
  }

  deleteActiveQuestionnaire(questionnaireId: string): Observable<void> {
    return this.dataService.deleteActiveQuestionnaire(questionnaireId);
  }

  // Questionnaire Methods
  getActiveQuestionnaireById(id: string): Observable<ActiveQuestionnaire | null> {
    return this.dataService.getActiveQuestionnaireById(id);
  }

  getQuestionsForUser(): Observable<Question[]> {
    return this.dataService.getQuestionsForUser();
  }

  submitUserAnswers(userId: string | null, role: string, answers: Question[], questionnaireId: string | null): Observable<void> {
    return this.dataService.submitData(userId, role, questionnaireId!, answers);
  }

  validateUserAccess(userId: any, role: string, questionnaireId: string): Observable<boolean> {
    return this.dataService.validateUserAccess(userId, role, questionnaireId);
  }

}
