import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppLayout } from './core/layouts/app/app.layout';
import { LoggedOutGuard } from './core/auth/guards/logged-out.guard';
import { LoggedInGuard } from './core/auth/guards/logged-in.guard';
import { ForgotPasswordComponent } from './modules/login/forgot-password/forgot-password.component';
import { TwoFactorAuthenticationComponent } from './modules/login/two-factor-authentication/two-factor-authentication.component';
import { VerifyComponent } from './modules/sso/verify/verify.component';
import { ResetPasswordComponent } from './modules/login/reset-password/reset-password.component';
import { ChangePasswordComponent } from './modules/login/change-password/change-password.component';
import { PermissionGuard } from './core/auth/guards/permission.guard';
import { LabelsGuard } from './core/auth/guards/labels.guards';
import { OrganizationLevelGuard } from './core/auth/guards/organization-levels.guard';
import { ModulesGuard } from './core/auth/guards/modules.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
    canActivate: [LoggedOutGuard],
    data: { core: { title: 'Login' } }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoggedOutGuard],
    data: { core: { title: 'Forgot Password' } }
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [LoggedOutGuard],
    data: { core: { title: 'Reset Password' } },
  },
  {
    path: 'two-factor-authentication',
    component: TwoFactorAuthenticationComponent,
    canActivate: [LoggedOutGuard],
    data: { core: { title: 'Two Factor Authentication' } }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    // canActivate: [LoggedOutGuard],
    data: { core: { title: 'Change Password' } }
  },
  {
    path: '',
    component: AppLayout,
    canActivateChild: [LoggedInGuard],
    resolve: [PermissionGuard, LabelsGuard, OrganizationLevelGuard, ModulesGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { core: { title: 'Dashboard' } }
      },
      {
         path: 'organization',
         loadChildren: () => import('./modules/organization/organization.module').then(m => m.OrganizationModule),
         data: { core: { title: 'Organization' } },
      },
      {
        path: 'human-capital',
        loadChildren: () => import('./modules/human-capital/human-capital.module').then(m => m.HumanCapitalModule),
        data: { core: { title: 'Human Capital' } },
      },
      {
        path: 'external-audit',
        loadChildren: () => import('./modules/external-audit/external-audit.module').then(m => m.ExternalAuditModule),
        data: { core: { title: 'External Audit' } }
      },
      {
        path: 'internal-audit',
        loadChildren: () => import('./modules/internal-audit/internal-audit.module').then(m => m.InternalAuditModule),
        data: { core: { title: 'Internal Audit' } },
      },
      {
        path: 'non-conformity',
        loadChildren: () => import('./modules/non-conformity/non-conformity.module').then(m => m.NonConformityModule),
        data: { core: { title: 'Non Conformity' } }
      },
      {
        path: 'bpm',
        loadChildren: () => import('./modules/bpm/bpm.module').then(m => m.BpmModule),
        data: { core: { title: 'BPM' } },
      },
      {
        path: 'knowledge-hub',
        loadChildren: () => import('./modules/KH/kh.module').then(m => m.KhModule),
        data: { core: { title: 'Knowledge Hub' } },
      },
      {
        path: 'strategy',
        loadChildren: () => import('./modules/strategy/strategy.module').then(m => m.StrategyModule),
        data: { core: { title: 'Strategy' } },
      },
      {
        path: 'business-assessments',
        loadChildren: () => import('./modules/business-assessments/business-assessments.module').then(m => m.BusinessAssessmentsModule),
        data: { core: { title: 'Business Assessments' } },
      },
      {
        path: 'risk-management',
        loadChildren: () => import('./modules/risk-management/risk-management.module').then(m => m.RiskManagementModule),
        data: { core: { title: 'Risk Management' } },
      },
      {
        path: 'mrm',
        loadChildren: () => import('./modules/mrm/mrm.module').then(m => m.MrmModule),
        data: { core: { title: 'MRM' } },
      },
      {
        path: 'supplier',
        loadChildren: () => import('./modules/supplier/supplier.module').then(m => m.SupplierModule),
        data: { core: { title: 'Supplier' } },
      },
      {
        path: 'customer-satisfaction',
        loadChildren: () => import('./modules/customer-satisfaction/customer-satisfaction.module').then(m => m.CustomerSatisfactionModule),
        data: { core: { title: 'Customer Satisfaction' } },
      },
      {
        path: 'project-management',
        loadChildren: () => import('./modules/project-management/project-management.module').then(m => m.ProjectManagementModule),
        data: { core: { title: 'Project Management' } },
      },
      {
        path: 'security',
        loadChildren: () => import('./modules/acl/acl.module').then(m => m.AclModule),
        data: { core: { title: 'ACL' } }
      },
      {
        path: 'user-guide',
        loadChildren: () => import('./modules/user-guide/user-guide.module').then(m => m.UserGuideModule),
        data: { core: { title: 'User Guide' } }
      },
      {
        path: 'incident-management',
        loadChildren: () => import('./modules/incident-management/incident-management.module').then(m => m.IncidentManagementModule),
        data: { core: { title: 'Incident Management' } }
      },
      {
        path: 'my-account',
        loadChildren: () => import('./modules/my-profile/my-profile.module').then(m => m.MyProfileModule),
        data: { core: { title: 'My Account' } }
      },
      {
        path: 'trainings',
        loadChildren: () => import('./modules/training/training.module').then(m => m.TrainingModule),
        data: { core: { title: 'Trainings' } }
      },
      {
        path: 'jso',
        loadChildren: () => import('./modules/jso/jso.module').then(m => m.JsoModule),
        data: { core: { title: 'JSO' } }
      },
      {
        path: 'compliance-management',
        loadChildren: () => import('./modules/compliance-management/compliance-management.module').then(m => m.ComplianceManagementModule),
        data: { core: { title: 'Compliance Management' } }
      },
      {
        path: 'customer-engagement',
        loadChildren: () => import('./modules/customer-engagement/customer-engagement.module').then(m => m.CustomerEngagementModule),
        data: { core: { title: 'Customer Engagement' } }
      },
      {
        path: 'strategy-management',
        loadChildren: () => import('./modules/strategy/strategy.module').then(m => m.StrategyModule),
        data: { core: { title: 'Strategy Management' } }
      },
      {
        path: 'bcm',
        loadChildren: () => import('./modules/bcm/bcm.module').then(m => m.BcmModule),
        data: { core: { title: 'BCM' } },
      },
      {
        path: 'asset-management',
        loadChildren: () => import('./modules/asset-management/asset-management.module').then(m => m.AssetManagementModule),
        data: { core: { title: 'Asset Management' } },
      },
      {
        path: 'isms',
        loadChildren: () => import('./modules/isms/isms.module').then(m => m.IsmsModule),
        data: { core: { title: 'ISMS' } }
      },
      {
        path: 'audit-management',
        loadChildren: () => import('./modules/audit-management/audit-management.module').then(m => m.AuditManagementModule),
        data: { core: { title: 'Audit Management' } }
      },
      {
        path: 'project-monitoring',
        loadChildren: () => import('./modules/project-monitoring/project-monitoring.module').then(m => m.ProjectMonitoringModule),
        data: { core: { title: 'Project Monitoring' } }
      },
      {
        path: 'event-monitoring',
        loadChildren: () => import('./modules/event-monitoring/event-monitoring.module').then(m => m.EventMonitoringModule),
        data: { core: { title: 'Event Monitoring' } }
      },
      {
        path: 'kpi-management',
        loadChildren: () => import('./modules/kpi-management/kpi-management.module').then(m => m.KpiManagementModule),
        data: { core: { title: 'KPI Management' } }
      },
      {
        path: 'ms-audit-management',
        loadChildren: () => import('./modules/ms-audit-management/ms-audit-management.module').then(m => m.MsAuditManagementModule),
        data: { core: { title: 'MS Audit Management' } }
      },
      {
        path: 'hira',
        loadChildren: () => import('./modules/hira/hira.module').then(m => m.HiraModule),
        data: { core: { title: 'HIRA' } }
      },
      {
        path: 'masters',
        loadChildren: () => import('./modules/masters/masters.module').then(m => m.MastersModule),
        data: { core: { title: 'Masters' } }
      },
      {
        path: 'mock-drill',
        loadChildren: () => import('./modules/mock-drill/mock-drill.module').then(m => m.MockDrillModule),
        data: { core: { title: 'Mock Drill' } }
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
        data: { core: { title: 'Settings' } }
      },
      {
        path: 'error',
        loadChildren: () => import('./modules/error-handler/error-handler.module').then(m => m.ErrorHandlerModule),
        data: { core: { title: 'Error' } }
      },
       { 
        path: 'cyber-incident', 
        loadChildren: () => import('./modules/cyber-incidents/cyber-incidents.module').then(m => m.CyberIncidentsModule),
        data: { core: { title: 'Cyber Incidents' } }
      },
      { 
        path: 'qlik-dashboards', 
        loadChildren: () => import('./modules/qlik-dashboards/qlik-dashboards.module').then(m => m.QlikDashboardsModule),
        data: { core: { title: 'qlik-dashboards' } }
      }
     
    ]
  },
  {
    path: 'sso/verify',
    component: VerifyComponent
  },
  
  
  
];
@NgModule({
  // imports: [RouterModule.forRoot(routes,{
  //   preloadingStrategy: PreloadAllModules
  // })],
 imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }