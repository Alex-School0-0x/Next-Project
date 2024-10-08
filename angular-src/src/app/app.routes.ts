import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { QuestionareComponent } from './components/questionare/questionare.component';
import { ErrorComponent } from './components/error/error.component';
import { roleGuard } from './gurads and interceptors/role-guard.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TemplateManagerComponent } from './components/dashboard/admin-dashboard/template-manager/template-manager.component';
import { ActiveQuestionnaireManagerComponent } from './components/dashboard/admin-dashboard/active-questionnaire-manager/active-questionnaire-manager.component';
import { authGuard } from './gurads and interceptors/auth.guard';
import { ShowResultsComponent } from './components/show-results/show-results.component';
import { SettingsComponent } from './components/dashboard/admin-dashboard/settings/settings.component';
import { ShowLogsComponent } from './components/dashboard/admin-dashboard/show-logs/show-logs.component';
import { TeacherGeneralOverviewComponent } from './components/dashboard/teacher-dashboard/teacher-general-overview/teacher-general-overview.component';
import { CompNavigatorComponent } from './components/dashboard/comp-navigator/comp-navigator.component';

export const routes: Routes = [
    { path: '', component: LoginPageComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
          {
            path: 'nav',
            component: CompNavigatorComponent,
            canActivate: [roleGuard],
            data: { roles: ['admin', 'teacher'] }
          },
          { 
            path: 'overview', 
            canActivate: [authGuard, roleGuard],
            data: { roles: ['teacher'] },
            component: TeacherGeneralOverviewComponent
          },
          {
            path: 'templates',
            component: TemplateManagerComponent,
            canActivate: [roleGuard],
            data: { roles: ['admin'] }
          },
          {
            path: 'active-questionnaire',
            component: ActiveQuestionnaireManagerComponent,
            canActivate: [roleGuard],
            data: { roles: ['admin'] }
          },
          {
            path: 'settings',
            component: SettingsComponent,
            canActivate: [roleGuard],
            data: { roles: ['admin'] }
          },
          {
            path: 'logs',
            component: ShowLogsComponent,
            canActivate: [roleGuard],
            data: { roles: ['admin'] }
          }
        ]
      },
      { 
        path: 'answer/:id', 
        canActivate: [authGuard, roleGuard],
        data: { roles: ['teacher', 'student'] },
        component: QuestionareComponent
      },
      {path:"results/:id", 
        canActivate: [roleGuard],
        component: ShowResultsComponent,
        data: { roles: ['teacher','student'] }
      },
      { path: 'error', component: ErrorComponent },
      { path: '**', component: PageNotFoundComponent }
]