import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { LanguageSettingsComponent } from './pages/language/language-settings.component';
import { OrganizationLevelSettingsComponent } from './pages/organization-level/organization-level-settings.component';
import { EmailNotificationSettingsComponent } from './pages/email-notification/email-notification-settings.component';
import { ThemeSettingsComponent } from './pages/theme/theme-settings.component';
import { OrganizationModulesComponent } from './pages/organization-modules/organization-modules.component';
import { OrganizationSettingsComponent } from './pages/organization-settings/organization-settings/organization-settings.component';
import { ThemeStructureComponent } from './pages/theme/theme-structure/theme-structure.component';
import { ThemeLoginComponent } from './pages/theme/theme-login/theme-login.component';
import { ThemeFooterComponent } from './pages/theme/theme-footer/theme-footer.component';
import { KHSettingsComponent } from './pages/organization-settings/k-h-settings/k-h-settings.component';
import { LoginSettingsComponent } from './pages/organization-settings/login-settings/login-settings.component';
import { RiskManagementSettingsComponent } from './pages/organization-settings/risk-management-settings/risk-management-settings.component';
import { BiaSettingsComponent } from './pages/organization-settings/bia-settings/bia-settings.component';
import { IsmsRiskSettingsComponent } from './pages/organization-settings/isms-risk-settings/isms-risk-settings.component';
import { AssetManagementComponent } from './pages/organization-settings/asset-management/asset-management.component';
import { InternalAuditSettingsComponent } from './pages/organization-settings/internal-audit-settings/internal-audit-settings.component';
import { AuditManagementSettingsComponent } from './pages/organization-settings/audit-management-settings/audit-management-settings.component';
import { UserGuideComponent } from './pages/user-guide/user-guide.component';
import { ReferenceCodeModalComponent } from './pages/organization-settings/k-h-settings/reference-code-modal/reference-code-modal.component';
import { StrategyManagementSettingsComponent } from './pages/organization-settings/strategy-management-settings/strategy-management-settings.component';
import { IntegrationComponent } from './pages/integration/integration.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/settings/language',
    pathMatch: 'full',
  },
  {
    path: '',
    component: SettingsComponent,
    data: {
      core: { title: 'Settings' }
    },
    children: [
      {
        path: 'language',
        component: LanguageSettingsComponent,
        data: {
          core: { title: 'Language' }
        }
      },
      {
        path: 'modules',
        component: OrganizationModulesComponent,
        data: {
          core: { title: 'Modules' }
        }
      },
      {
        path: 'user-guides',
        component: UserGuideComponent,
        data: {
          core: { title: 'Overview' }
        }
      },
      {
        path: 'organization-level',
        component: OrganizationLevelSettingsComponent,
        data: {
          core: { title: 'Organization Level' }
        }
      },
      {
        path: 'integration',
        component: IntegrationComponent,
        data: {
          core: { title: 'Integration' }
        }
      },
      {
        path: 'email-notification',
        component: EmailNotificationSettingsComponent,
        data: {
          core: { title: 'Email Notification' }
        }
      },
      {
        path: 'theme-customization',
        component: ThemeSettingsComponent,
        data: {
          core: { title: 'Theme Customization' }
        }
      },
      {
        path: 'theme-structure',
        component: ThemeStructureComponent,
        data: {
          core: { title: 'Theme Structure' }
        }
      },
      {
        path: 'theme-login',
        component: ThemeLoginComponent,
        data: {
          core: { title: 'Theme Login' }
        }
      },
      {
        path: 'theme-footer',
        component: ThemeFooterComponent,
        data: {
          core: { title: 'Theme Footer' }
        }
      },
      {
        path: 'organization',
        component: OrganizationSettingsComponent,
        data: {
          core: { title: 'Organization Settings' }
        }
      },
      {
        path: 'internal-audit',
        component: InternalAuditSettingsComponent,
        data: {
          core: { title: 'Internal Audit' }
        }
      },
      {
        path:'audit-management',
        component:AuditManagementSettingsComponent
      },
      {
        path: 'knowledge-hub',
        component: KHSettingsComponent,
        data: {
          core: { title: 'Knowledge Hub' }
        }
      },
      {
        path: 'knowledge-hub/reference-code-settings',
        component: ReferenceCodeModalComponent,
        data: {
          core: { title: 'Reference Code Settings' }
        }
      },
      {
        path: 'risk-management',
        component: RiskManagementSettingsComponent,
        data: {
          core: { title: 'Risk Management' }
        }
      },
      {
        path: 'asset-management',
        component: AssetManagementComponent,
        data: {
          core: { title: 'Asset Management' }
        }
      },
      {
        path: 'login',
        component: LoginSettingsComponent,
        data: {
          core: { title: 'Login Settings' }
        }
      },{
        path: 'bcm-settings',
        component: BiaSettingsComponent,
        data: {
          core: { title: 'BCM Settings' }
        }
      },
      {
        path: 'isms-risk-settings',
        component: IsmsRiskSettingsComponent,
        data: {
          core: { title: 'ISMS Risk Settings' }
        }
      },
      {
        path: 'strategy-management-settings',
        component: StrategyManagementSettingsComponent,
        data: {
          core: { title: 'Strategy Management Settings' }
        }
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
