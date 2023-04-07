import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HumanCapitalRoutingModule } from './human-capital.routing.module';
import { HumanCapitalDashboardPage } from './pages/dashboard/human-capital-dashboard.page';
import { HumanCapitalUsersPage } from './pages/users/human-capital-users.page';
import { HumanCapitalAssessmentsPage } from './pages/assessments/human-capital-assessments.page';
import { HumanCapitalAssessmentCompetencyAssessment } from './pages/assessments/pages/assessment/competency-assessment/competency-assessment.page';
import { HumanCapitalAssessmentDepartment } from './pages/assessments/pages/assessment/department/department.page';
import { HumanCapitalAssessmentSubsidiary } from './pages/assessments/pages/assessment/subsidiary/subsidiary.page';
import { HumanCapitalAssessmentTeam } from './pages/assessments/pages/assessment/team/team.page';
import { HumanCapitalAssessmentUser } from './pages/assessments/pages/assessment/user/user.page';
import { AssessmentUserBoxComponent } from './components/assessment-user-box/assessment-user-box.component';
import { UsersPageComponent } from './pages/users/pages/users/users.page.component';
import { UserDetailsPageComponent } from './pages/users/pages/user-details/user-details-page.component';
import { UserDocumentsPageComponent } from './pages/users/pages/user-details/user-documents/user-documents.page/user-documents.page.component';
import { UserLeftsideBoxComponent } from './components/user-details/user-leftside-box/user-leftside-box.component';
import { UserProfilePageComponent } from './pages/users/pages/user-details/user-profile/user-profile.page.component';
import { UserJdPageComponent } from './pages/users/pages/user-details/user-jd/user-jd-page/user-jd-page.component';
import { UserRrPageComponent } from './pages/users/pages/user-details/user-rr/user-rr-page/user-rr-page.component';
import { UserKpiPageComponent } from './pages/users/pages/user-details/user-kpi-page/user-kpi-page.component';
import { UserCompetenciesPageComponent } from './pages/users/pages/user-details/user-competencies-page/user-competencies-page.component';
import { UserReportsPageComponent } from './pages/users/pages/user-details/user-reports-page/user-reports-page.component';
import { UserSettingsPageComponent } from './pages/users/pages/user-details/user-settings-page/user-settings-page.component';
import { SecurityComponent } from './pages/users/pages/user-details/user-settings-page/security/security.component';
import { AclComponent } from './pages/users/pages/user-details/user-settings-page/acl/acl.component';
import { AccessComponent } from './pages/users/pages/user-details/user-settings-page/access/access.component';
import { EmailNotificationComponent } from './pages/users/pages/user-details/user-settings-page/email-notification/email-notification.component';
import { IntegrationComponent } from './pages/users/pages/user-details/user-settings-page/integration/integration.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserLoaderComponent } from './components/loader/user-loader/user-loader.component';

import { AddUserComponent } from './pages/users/pages/users/add-user/add-user.component';
import { NewAssessmentComponent } from './pages/assessments/pages/new-assessment/new-assessment.component';
import { PreviewcomponentComponent } from 'src/app/modules/human-capital/components/shared/previewcomponent/previewcomponent.component';
import { PerformanceEvaluationComponent } from './pages/users/pages/user-details/performance-evaluation/performance-evaluation.component';
// import { EditUserComponent } from './pages/users/pages/users/edit-user-main/edit-user/edit-user.component';
import { UserReportComponent } from './pages/user-report/user-report.component';
import { CompetencyMatrixComponent } from './pages/competency-matrix/competency-matrix.component';
import { AssessmentComponent } from './pages/assessments/pages/assessment/assessment.component';
import { UserSettingComponent } from './pages/users/pages/user-details/user-settings-page/user-setting/user-setting.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EditAssessmentComponent } from './pages/assessments/pages/edit-assessment/edit-assessment.component';
import { AssessmentListComponent } from './components/loader/assessment-list/assessment-list.component';
import { AclListComponent } from './components/loader/acl-list/acl-list/acl-list.component';
import { EditUserMainComponent } from './pages/users/pages/edit-user-main/edit-user-main.component';
import { EditUserComponent } from './pages/users/pages/edit-user-main/edit-user/edit-user.component';
import { UserProfileLoaderComponent } from './components/loader/user-profile-loader/user-profile-loader.component';
import { UserDocumentLoaderComponent } from './components/loader/user-document-loader/user-document-loader.component';
import { UserJdLoaderComponent } from './components/loader/user-jd-loader/user-jd-loader.component';
import { UserKpiLoaderComponent } from './components/loader/user-kpi-loader/user-kpi-loader.component';
import { UserRrLoaderComponent } from './components/loader/user-rr-loader/user-rr-loader.component';
import { UserReportLoaderComponent } from './components/loader/user-report-loader/user-report-loader.component';
import { UserCompetencyLoaderComponent } from './components/loader/user-competency-loader/user-competency-loader.component';
import { ProfileLeftLoaderComponent } from './components/loader/profile-left-loader/profile-left-loader.component';
import { UserActualReportLoaderComponent } from './components/loader/user-actual-report-loader/user-actual-report-loader.component';
import { AssessmentSubsidiaryLoaderComponent } from './components/loader/assessment-subsidiary-loader/assessment-subsidiary-loader.component';
import { AssessmentUserIndividualLoaderComponent } from './components/loader/assessment-user-individual-loader/assessment-user-individual-loader.component';
import { TrainingMatrixDetailsComponent } from './pages/training-matrix-details/training-matrix-details.component';
import { UserTrainingsComponent } from './pages/users/pages/user-details/user-trainings/user-trainings.component';
import { TrainingDetailsCompetencyLoaderComponent } from './components/loader/training-details-competency-loader/training-details-competency-loader.component';
import { DepartmentDetailsComponent } from './pages/department/department-details/department-details.component';
import { HumanCapitalDashboardLoaderComponent } from './components/loader/human-capital-dashboard-loader/human-capital-dashboard-loader.component';
import { HumanCapitalOverviewComponent } from './pages/human-capital-overview/human-capital-overview.component';
import { HcQlikDashboardComponent } from './pages/hc-qlik-dashboard/hc-qlik-dashboard.component';
@NgModule({
    declarations: [
        HumanCapitalDashboardPage,
        HumanCapitalUsersPage,
        HumanCapitalAssessmentsPage,
        HumanCapitalAssessmentCompetencyAssessment,
        HumanCapitalAssessmentDepartment,
        HumanCapitalAssessmentSubsidiary,
        HumanCapitalAssessmentTeam,
        HumanCapitalAssessmentUser,
        AssessmentUserBoxComponent,
        UsersPageComponent,
        UserDetailsPageComponent,
        UserDocumentsPageComponent,
        UserLeftsideBoxComponent,
        UserProfilePageComponent,
        UserJdPageComponent,
        UserRrPageComponent,
        UserKpiPageComponent,
        UserCompetenciesPageComponent,
        UserReportsPageComponent,
        UserSettingsPageComponent,
        SecurityComponent,
        AclComponent,
        AccessComponent,
        EmailNotificationComponent,
        IntegrationComponent,
        UserLoaderComponent,
        AddUserComponent,
        NewAssessmentComponent,
        PreviewcomponentComponent,
        PerformanceEvaluationComponent,
        EditUserComponent,
        UserReportComponent,
        CompetencyMatrixComponent,
        AssessmentComponent,
        UserSettingComponent,
        DepartmentComponent,
        EditAssessmentComponent,
        AssessmentListComponent,
        AclListComponent,
        EditUserMainComponent,
        UserProfileLoaderComponent,
        UserDocumentLoaderComponent,
        UserJdLoaderComponent,
        UserKpiLoaderComponent,
        UserRrLoaderComponent,
        UserReportLoaderComponent,
        UserCompetencyLoaderComponent,
        ProfileLeftLoaderComponent,
        UserActualReportLoaderComponent,
        AssessmentSubsidiaryLoaderComponent,
        AssessmentUserIndividualLoaderComponent,
        TrainingMatrixDetailsComponent,
        UserTrainingsComponent,
        TrainingDetailsCompetencyLoaderComponent,
        DepartmentDetailsComponent,
        HumanCapitalDashboardLoaderComponent,
        HumanCapitalOverviewComponent,
        HcQlikDashboardComponent
       
    ],
    imports: [
        CommonModule,
        SharedModule,
        HumanCapitalRoutingModule,
        NgxPaginationModule,
    ],
    exports: [
        AclListComponent
    ],
    providers: [],
})
export class HumanCapitalModule { }
