import { Component, inject } from '@angular/core';
import { Question, QuestionTemplate, Option } from '../../../../models/questionare';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateEditorComponent } from './template-editor/template-editor.component';
import { QuestionEditorComponent } from './template-editor/question-editor/question-editor.component';
import { DataService } from '../../../../services/data/data.service';

@Component({
  selector: 'app-template-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TemplateEditorComponent, QuestionEditorComponent],
  templateUrl: './template-manager.component.html',
  styleUrl: './template-manager.component.css'
})
export class TemplateManagerComponent {
  dataService = inject(DataService)
  templates: QuestionTemplate[] = [];
  selectedTemplate: QuestionTemplate | null = null;
  selectedQuestion: Question | null = null;

  page: number = 1; // Pagination current page
  limit: number = 5; // Number of templates to load per page
  hasMoreTemplates: boolean = false;

  ngOnInit(): void {
    this.loadTemplates();
  }


  handleAction(actionType: string, entity: any) {
    switch(actionType) {
      case 'editTemplate':
        this.editTemplate(entity);
        break;
      case 'deleteTemplate':
        this.deleteTemplate(entity.id);
        break;
      case 'editQuestion':
        this.editQuestion(entity);
        break;
      case 'deleteQuestion':
        this.deleteQuestion(entity.id);
        break;
    }
  }
  

  loadTemplates() {
    this.dataService.getTemplates(this.page, this.limit).subscribe((templates) => {
      if (this.page === 1) {
        this.templates = templates; // Replace results on the first page
      } else {
        this.templates = [...this.templates, ...templates]; // Append for subsequent pages
      }
      this.hasMoreTemplates = templates.length >= this.limit;
    });
  }

  loadMore() {
    if (this.hasMoreTemplates) {
      this.page++;
      this.loadTemplates();
    }
  }
  
  hasCustomOption(): boolean {
    return this.selectedQuestion ? this.selectedQuestion.options.some(o => o.isCustom) : false;
  }

  createNewTemplate() {
    const tempTemplate: QuestionTemplate = {
      id: "temporary_template_id",
      title: 'New Template',
      description: '',
      questions: [
        {
          id: 1,
          title: 'New Question 1',
          options: [
            { id: 1, label: "option 1", value: 1 },
            { id: 2, label: "option 2", value: 2 }
          ]
        },
        {
          id: 2,
          title: 'New Question 2',
          options: [
            { id: 1, label: "option 1", value: 1 },
            { id: 2, label: "option 2", value: 2 }
          ]
        }
      ],
      createdAt: new Date()
    };
  
    this.selectedTemplate = tempTemplate;  // Set the current template to the new temp one
  }
  

  editTemplate(template: QuestionTemplate) {
    const confirmed = this.selectedTemplate && window.confirm('You have unsaved changes. Are you sure you want to switch templates?');
    if (!this.selectedTemplate || confirmed) {
      this.selectedTemplate = JSON.parse(JSON.stringify(template));
      this.selectedQuestion = null; // Clear any selected question when switching templates
    }
  }

  saveTemplate(newOrUpdatedTemplate: QuestionTemplate) {
    const confirmed = window.confirm('Are you sure you want to save changes to this template?');
    if (confirmed) {
      if(newOrUpdatedTemplate){
        if (newOrUpdatedTemplate.id === "temporary_template_id") {
              // Helper function to generate a unique ID
          const generateUniqueId = () => {
            return 'template_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
          };
          newOrUpdatedTemplate.id = generateUniqueId();
          this.dataService.createTemplate(newOrUpdatedTemplate).subscribe({
            complete: () => {
              this.loadTemplates();
              this.clearSelectedTemplate();
            },
            error: (err) => {
              console.error('Error creating template:', err);
            }
          });
        } else {
        // Send the updated template to the backend
         this.dataService.updateTemplate(newOrUpdatedTemplate).subscribe({
          error: (err) => console.error('Error updating template:', err),
          complete: () => {
            console.log('Template update complete.');
            this.loadTemplates();
            this.clearSelectedTemplate();
          }
        });
        }
      }
    }
  }
  

  clearSelectedTemplate() {
    this.selectedTemplate = null;
    this.selectedQuestion = null;
  }

  clearSelectedQuestion(){
    this.selectedQuestion = null;
  }

  deleteTemplate(templateId: string) {
    alert('Are you sure you want to delete this template? This action cannot be undone.')
    const confirmed = window.confirm('Remember, this is perment');
    if (confirmed) {
      this.dataService.deleteTemplate(templateId).subscribe({
        error: (err) => {
          console.error('Error deleting template:', err);
        },
        complete: () => {
          console.log('Template deletion complete.');
          this.loadTemplates();
        }
      });
    }
  }

  editQuestion(question: Question) {
    const confirmed = this.selectedQuestion && window.confirm('You have unsaved changes. Are you sure you want to switch questions?');
    if (!this.selectedQuestion || confirmed) {
      this.selectedQuestion = JSON.parse(JSON.stringify(question));
    }
  }

  saveQuestion(updatedQuestion:Question) {
    if (this.selectedTemplate) {
      const confirmed = window.confirm('Are you sure you want to save changes to this question?');
      if (confirmed) {
        const index = this.selectedTemplate.questions.findIndex(q => q.id === this.selectedQuestion!.id);
        if (index !== -1) {
          this.selectedTemplate.questions[index] = { ...updatedQuestion }; // Save changes to the template's question list
          this.selectedQuestion = null; // Clear the selection after saving
        }
      }
    }
  }

  deleteQuestion(questionId: number) {
    const confirmed = window.confirm('Are you sure you want to delete this question? This action cannot be undone.');
    if (confirmed && this.selectedTemplate) {
      this.selectedTemplate.questions = this.selectedTemplate.questions.filter(q => q.id !== questionId);
      this.selectedQuestion = null; // Clear selection if deleting the edited question
    }
  }
}
