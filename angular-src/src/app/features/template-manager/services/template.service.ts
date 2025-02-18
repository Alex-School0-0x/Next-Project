import { inject, Injectable } from '@angular/core';

import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Template, TemplateBaseResponse } from '../models/template.model';
import { PaginationResponse } from '../../../shared/models/Pagination.model';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  private apiUrl = `${environment.apiUrl}/questionnaire-template`;
  private apiService = inject(ApiService);

  constructor() {}

  // Get templates with pagination and optional search term
  getTemplateBases(
    pageSize: number,
    nextCursorCreatedAt?: string,
    nextCursorId?: string,
    searchTerm: string = '',
    searchType: 'name' | 'id' = 'name'
  ): Observable<TemplateBaseResponse> {
    let params = new HttpParams().set('PageSize', pageSize.toString());
  
    params = params.set('Order', 'CreatedAtDesc');
  
    if (nextCursorCreatedAt && nextCursorId) {
      params = params.set('QueryCursor', `${nextCursorCreatedAt}_${nextCursorId}`);
    }
    
    if (searchTerm.trim() !== '') {
      if (searchType === 'name') {
        params = params.set('Title', searchTerm);
      } else if (searchType === 'id') {
        params = params.set('Id', searchTerm);
      }
    }
    
    return this.apiService.get<TemplateBaseResponse>(this.apiUrl, params);
  }

  getTemplateDetails(id: string): Observable<Template> {
    return this.apiService.get<Template>(`${this.apiUrl}/${id}`);
  }

  addTemplate(template: Template): Observable<Template> {
    return this.apiService.post<Template>(`${this.apiUrl}/add`, template);
  }

  updateTemplate(templateId: string, updatedTemplate: Template): Observable<Template> {
    const url = `${this.apiUrl}/${templateId}/update`;
    return this.apiService.put<Template>(url, updatedTemplate);
  }

  deleteTemplate(templateId: string): Observable<void> {
    const url = `${this.apiUrl}/${templateId}/delete`;
    return this.apiService.delete<void>(url);
  }
}
