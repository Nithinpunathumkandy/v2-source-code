import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { DocumentsComponent } from './pages/profile/documents/documents.component';
import { RouterModule } from '@angular/router';
import { JdComponent } from './pages/profile/jd/jd.component';
import { RRComponent } from './pages/profile/r-r/r-r.component';
import { KpiComponent } from './pages/profile/kpi/kpi.component';
import { CompetenciesComponent } from './pages/profile/competencies/competencies.component';
import { ReportsComponent } from './pages/profile/reports/reports.component';
import { AclSettingComponent } from './pages/settings/acl-setting/acl-setting.component';
import { SettingsSecurityComponent } from './pages/settings/settings-security/settings-security.component';
import { ProfileMainComponent } from './pages/profile/profile-main/profile-main.component';
import { SettingsMainComponent } from './pages/settings/settings-main/settings-main.component';
import { AccessSettingsComponent } from './pages/settings/access-settings/access-settings.component';
import { EmailnotificationProfileSettingsComponent } from './pages/settings/emailnotification-profile-settings/emailnotification-profile-settings.component';
import { IntegrationProfileSettingsComponent } from './pages/settings/integration-profile-settings/integration-profile-settings.component';
import { ActivitiesMainComponent } from './pages/activities/activities-main/activities-main.component';
import { DashboardMainComponent } from './pages/dashboard/dashboard-main/dashboard-main.component';
import { TasksMainComponent } from './pages/tasks/tasks-main/tasks-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HumanCapitalModule } from '../human-capital/human-capital.module';
import { ProfilePreviewComponent } from './components/profile-preview/profile-preview.component';
import { ProfileLoaderComponent } from './components/loader/profile-loader/profile-loader.component';
import { ProfileDocumentLoaderComponent } from './components/loader/profile-document-loader/profile-document-loader.component';
import { ProfileCompetencyLoaderComponent } from './components/loader/profile-competency-loader/profile-competency-loader.component';
import { ProfileJdLoaderComponent } from './components/loader/profile-jd-loader/profile-jd-loader.component';
import { ProfileKpiLoaderComponent } from './components/loader/profile-kpi-loader/profile-kpi-loader.component';
import { ProfileReportLoaderComponent } from './components/loader/profile-report-loader/profile-report-loader.component';
import { ProfileRrLoaderComponent } from './components/loader/profile-rr-loader/profile-rr-loader.component';
import { MyprofileGeneralSettingsComponent } from './pages/settings/myprofile-general-settings/myprofile-general-settings.component';
import { NotificationComponent } from './pages/profile/notification/notification.component';
import { TrainingTabComponent } from './pages/profile/training-tab/training-tab.component';
import { ThirdPartyAppIntegrationComponent } from './pages/profile/third-party-app-integration/third-party-app-integration.component';





@NgModule({
  declarations: [ MyProfileComponent, ProfileComponent, DocumentsComponent, 
                   JdComponent , RRComponent, KpiComponent, CompetenciesComponent, 
                  ReportsComponent, AclSettingComponent, SettingsSecurityComponent, 
                  ProfileMainComponent, SettingsMainComponent, AccessSettingsComponent, 
                  EmailnotificationProfileSettingsComponent,IntegrationProfileSettingsComponent, 
                  ActivitiesMainComponent, DashboardMainComponent, TasksMainComponent, ProfilePreviewComponent, ProfileLoaderComponent, ProfileDocumentLoaderComponent, ProfileCompetencyLoaderComponent, ProfileJdLoaderComponent, ProfileKpiLoaderComponent, ProfileReportLoaderComponent, ProfileRrLoaderComponent, MyprofileGeneralSettingsComponent, NotificationComponent, TrainingTabComponent, ThirdPartyAppIntegrationComponent],
  imports: [
    CommonModule,
    MyProfileRoutingModule,
    RouterModule,
    SharedModule,
    HumanCapitalModule,
    NgxPaginationModule
  ]
})
export class MyProfileModule { }
