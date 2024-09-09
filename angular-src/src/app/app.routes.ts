import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionareComponent } from './components/questionare/questionare.component';
import { ErrorComponent } from './components/error/error.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './components/dashboard/teacher-dashboard/teacher-dashboard.component';
import { roleGuard } from './guards/role-guard.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TemplateManagerComponent } from './components/dashboard/admin-dashboard/template-manager/template-manager.component';
import { ActiveQuestionnaireManagerComponent } from './components/dashboard/admin-dashboard/active-questionnaire-manager/active-questionnaire-manager.component';

export const routes: Routes = [
    { path: '', component: LoginPageComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          {
            path: 'admin',
            component: AdminDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'admin' }
          },
          {
            path: 'teacher',
            component: TeacherDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'teacher' }
          },
          {
            path: 'testing-templates',
            component: TemplateManagerComponent,
            canActivate: [roleGuard],
            data: { role: 'admin' }
          },
          {
            path: 'testing-active-questionnaire',
            component: ActiveQuestionnaireManagerComponent,
            canActivate: [roleGuard],
            data: { role: 'admin' }
          },
        ]
      },
    { path: 'answer/:id', component: QuestionareComponent},
    { path: 'error', component: ErrorComponent },
    { path: '**', component: PageNotFoundComponent }
];
