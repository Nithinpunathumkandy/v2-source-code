import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
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
import { ColorPickerModule } from 'ngx-color-picker';
import { KHSettingsComponent } from './pages/organization-settings/k-h-settings/k-h-settings.component';
import { LoginSettingsComponent } from './pages/organization-settings/login-settings/login-settings.component';
import { RiskManagementSettingsComponent } from './pages/organization-settings/risk-management-settings/risk-management-settings.component';
import { BiaSettingsComponent } from './pages/organization-settings/bia-settings/bia-settings.component';
import { IsmsRiskSettingsComponent } from './pages/organization-settings/isms-risk-settings/isms-risk-settings.component';
import { AssetManagementComponent } from './pages/organization-settings/asset-management/asset-management.component';
import { InternalAuditSettingsComponent } from './pages/organization-settings/internal-audit-settings/internal-audit-settings.component';
import { AuditManagementSettingsComponent } from './pages/organization-settings/audit-management-settings/audit-management-settings.component';
import { ActiveDirectorySettingModalComponent } from './pages/organization-settings/active-directory-setting-modal/active-directory-setting-modal.component';
import { UserGuideComponent } from './pages/user-guide/user-guide.component';
import { UserGuideAddComponent } from './pages/user-guide/user-guide-add/user-guide-add.component';
import { ReferenceCodeModalComponent } from './pages/organization-settings/k-h-settings/reference-code-modal/reference-code-modal.component';
import { StrategyManagementSettingsComponent } from './pages/organization-settings/strategy-management-settings/strategy-management-settings.component';
import { IntegrationComponent } from './pages/integration/integration.component';






@NgModule({
  declarations: [SettingsComponent,ReferenceCodeModalComponent, LanguageSettingsComponent, OrganizationLevelSettingsComponent, EmailNotificationSettingsComponent, ThemeSettingsComponent, OrganizationModulesComponent, OrganizationSettingsComponent, ThemeStructureComponent, ThemeLoginComponent, ThemeFooterComponent, InternalAuditSettingsComponent, KHSettingsComponent, LoginSettingsComponent, RiskManagementSettingsComponent, BiaSettingsComponent, IsmsRiskSettingsComponent, AssetManagementComponent, AuditManagementSettingsComponent, ActiveDirectorySettingModalComponent, UserGuideComponent, UserGuideAddComponent, StrategyManagementSettingsComponent, IntegrationComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    ColorPickerModule
  ],
  exports: [ColorPickerModule]
})
export class SettingsModule { }
