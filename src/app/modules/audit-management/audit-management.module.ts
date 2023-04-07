import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditManagementRoutingModule } from './audit-management-routing.module';
import { AuditManagementDashboardComponent } from './pages/audit-management-dashboard/audit-management-dashboard.component';
import { AmAuditPlanComponent } from './pages/am-audit-plan/am-audit-plan.component';
import { AmAuditUniverseComponent } from './pages/am-audit-universe/am-audit-universe.component';
import { AmAuditPlanListComponent } from './pages/am-audit-plan/am-audit-plan-list/am-audit-plan-list.component';
import { AmAuditPlanDetailsComponent } from './pages/am-audit-plan/am-audit-plan-details/am-audit-plan-details.component';
import { AmAuditPlanInfoComponent } from './pages/am-audit-plan/am-audit-plan-details/am-audit-plan-info/am-audit-plan-info.component';
import { AmAuditableItemComponent } from './pages/am-audit-plan/am-audit-plan-details/am-auditable-item/am-auditable-item.component';
import { AmAnnualAuditPlanComponent } from './pages/am-audit-plan/am-audit-plan-details/am-annual-audit-plan/am-annual-audit-plan.component';
import { AmAuditUniverseProcessListComponent } from './pages/am-audit-universe/am-audit-universe-process-list/am-audit-universe-process-list.component';
import { AmAuditUniverseRiskListComponent } from './pages/am-audit-universe/am-audit-universe-risk-list/am-audit-universe-risk-list.component';
import { AmAuditUniverseStrategicObjectiveListComponent } from './pages/am-audit-universe/am-audit-universe-strategic-objective-list/am-audit-universe-strategic-objective-list.component';
import { AmAuditComponent } from './pages/am-audit/am-audit.component';
import { AmAuditListComponent } from './pages/am-audit/am-audit-list/am-audit-list.component';
import { AmAuditDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-details.component';
import { AmAuditInfoComponent } from './pages/am-audit/am-audit-details/am-audit-info/am-audit-info.component';
import { AmAuditCommencementLetterComponent } from './pages/am-audit/am-audit-details/am-audit-commencement-letter/am-audit-commencement-letter.component';
import { AmAuditInformationRequestComponent } from './pages/am-audit/am-audit-details/am-audit-information-request/am-audit-information-request.component';
import { AmAuditMeetingsComponent } from './pages/am-audit/am-audit-details/am-audit-meetings/am-audit-meetings.component';
import { AmAuditDocumentsComponent } from './pages/am-audit/am-audit-details/am-audit-documents/am-audit-documents.component';
import { AmAuditTestPlansComponent } from './pages/am-audit/am-audit-details/am-audit-test-plans/am-audit-test-plans.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AmWorkflowComponent } from './pages/am-workflow/am-workflow.component';
import { AmWorkflowListComponent } from './pages/am-workflow/am-workflow-list/am-workflow-list.component';
import { AmWorkflowDetailsComponent } from './pages/am-workflow/am-workflow-details/am-workflow-details.component';
import { AmWorkflowAddModalComponent } from './components/am-workflow-add-modal/am-workflow-add-modal.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { AmAuditSummaryComponent } from './pages/am-audit-plan/am-audit-plan-details/am-audit-summary/am-audit-summary.component';
import { AmInformationRequestDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-information-request/am-information-request-details/am-information-request-details.component';
import { AmPreviewModalComponent } from './components/am-preview-modal/am-preview-modal.component';
import { RequestChildDataComponent } from './components/request-child-data/request-child-data.component';
import { AmAuditMeetingDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-meetings/am-audit-meeting-details/am-audit-meeting-details.component';
import { AmAuditFieldWorksComponent } from './pages/am-audit-field-works/am-audit-field-works.component';
import { AmAuditFieldWorkListComponent } from './pages/am-audit-field-works/am-audit-field-work-list/am-audit-field-work-list.component';
import { AmAuditFieldWorkDetailsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-details.component';
import { AmAuditFieldWorkInfoComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-info/am-audit-field-work-info.component';
import { AmAuditTestPlanDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-test-plans/am-audit-test-plan-details/am-audit-test-plan-details.component';
import { AmAuditFieldWorkFindingsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-audit-field-work-findings.component';
import { AmFieldWorkFindingDetailsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-field-work-finding-details.component';
import { FieldWorkTestPlanDetailsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-info/field-work-test-plan-details/field-work-test-plan-details.component';
import { AmAuditFindingsComponent } from './pages/am-audit-findings/am-audit-findings.component';
import { AmAuditFindingInfoComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-info/am-audit-finding-info.component';
import { AmAuditFindingRcaComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-rca/am-audit-finding-rca.component';
import { AmAuditCommencementLetterLoaderComponent } from './components/loader/am-audit-commencement-letter-loader/am-audit-commencement-letter-loader.component';
import { AmAuditInfoRequestLoaderComponent } from './components/loader/am-audit-info-request-loader/am-audit-info-request-loader.component';
import { AmAuditPlanInfoLoaderComponent } from './components/loader/am-audit-plan-info-loader/am-audit-plan-info-loader.component';
import { AmAuditFindingIaComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-ia/am-audit-finding-ia.component';
import { AmAuditFindingCaComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-ca/am-audit-finding-ca.component';
import { AmAuditInfoLoaderComponent } from './components/loader/am-audit-info-loader/am-audit-info-loader.component';
import { AmAuditMeetingLoaderComponent } from './components/loader/am-audit-meeting-loader/am-audit-meeting-loader.component';
import { AssessmentDetailLoaderComponent } from './components/loader/assessment-detail-loader/assessment-detail-loader.component';

import { AmAuditTestPlanLoaderComponent } from './components/loader/am-audit-test-plan-loader/am-audit-test-plan-loader.component';
import { AmFieldworkInfoLoaderComponent } from './components/loader/am-fieldwork-info-loader/am-fieldwork-info-loader.component';
import { AmFindingCaHistoryModalComponent } from './components/am-finding-ca-history-modal/am-finding-ca-history-modal.component';
import { AmAuditPreliminaryReportsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-preliminary-reports/am-audit-preliminary-reports.component';
import { AmAuditDraftReportsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-draft-reports/am-audit-draft-reports.component';
import { AmAuditFinalReportsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-final-reports/am-audit-final-reports.component';
import { AmAuditUniverseDepartmentListComponent } from './pages/am-audit-universe/am-audit-universe-department-list/am-audit-universe-department-list.component';
import { AmAuditCorrectiveActionsComponent } from './pages/am-audit-corrective-actions/am-audit-corrective-actions.component';
import { AmAuditReportsComponent } from './pages/am-audit-reports/am-audit-reports.component';
import { AmAuditsCountTypeComponent } from './pages/am-audit-reports/am-audits-count-type/am-audits-count-type.component';
import { AmAuditCountListComponent } from './pages/am-audit-reports/am-audit-count-list/am-audit-count-list.component';
import { AmAuditCaListComponent } from './pages/am-audit-corrective-actions/am-audit-ca-list/am-audit-ca-list.component';
import { AmAuditCaDetailsComponent } from './pages/am-audit-corrective-actions/am-audit-ca-details/am-audit-ca-details.component';
import { IndividualAuditPlanInfoComponent } from './pages/am-audit-plan/am-audit-plan-details/am-annual-audit-plan/individual-audit-plan-info/individual-audit-plan-info.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ControlSelfAssessmentsComponent } from './pages/control-self-assessments/control-self-assessments.component';
import { CsaListComponent } from './pages/control-self-assessments/csa-list/csa-list.component';
import { CsaDetailsComponent } from './pages/control-self-assessments/csa-details/csa-details.component';
import { CsaChildComponent } from './components/csa-child/csa-child.component';
import { AuditManagementOverviewComponent } from './pages/audit-management-overview/audit-management-overview.component';
import { AmCsaWorkflowComponent } from './components/am-csa-workflow/am-csa-workflow.component';
import { AmCsaWorkflowHistoryComponent } from './components/am-csa-workflow-history/am-csa-workflow-history.component';
import { AmCsaWorkflowCommentComponent } from './components/am-csa-workflow-comment/am-csa-workflow-comment.component';
import { AmFindingsDashboardComponent } from './pages/audit-management-dashboard/am-findings-dashboard/am-findings-dashboard.component';
import { AmTopFindingsDashboardComponent } from './pages/audit-management-dashboard/am-top-findings-dashboard/am-top-findings-dashboard.component';
import { AmIndividualAuditPlansListComponent } from './pages/am-individual-audit-plans-list/am-individual-audit-plans-list.component';
import { AmAuditDashboardLoaderComponent } from './components/loader/am-audit-dashboard-loader/am-audit-dashboard-loader.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarDetailsPopupComponent } from './components/calendar-details-popup/calendar-details-popup.component';

@NgModule({
  declarations: [
    AuditManagementDashboardComponent,
    AmAuditPlanComponent,
    AmAuditUniverseComponent,
    AmAuditPlanListComponent,
    AmAuditPlanDetailsComponent,
    AmAuditPlanInfoComponent,
    AmAuditableItemComponent,
    AmAnnualAuditPlanComponent,
    AmAuditUniverseProcessListComponent,
    AmAuditUniverseRiskListComponent,
    AmAuditUniverseStrategicObjectiveListComponent,
    AmAuditComponent,
    AmAuditListComponent,
    AmAuditDetailsComponent,
    AmAuditInfoComponent,
    AmAuditCommencementLetterComponent,
    AmAuditInformationRequestComponent,
    AmAuditMeetingsComponent,
    AmAuditDocumentsComponent,
    AmAuditTestPlansComponent,
    AmWorkflowComponent,
    AmWorkflowListComponent,
    AmWorkflowDetailsComponent,
    AmWorkflowAddModalComponent,
    AmAuditSummaryComponent,
    AmInformationRequestDetailsComponent,
    AmPreviewModalComponent,
    RequestChildDataComponent,
    AmAuditMeetingDetailsComponent,
    AmAuditFieldWorksComponent,
    AmAuditFieldWorkListComponent,
    AmAuditFieldWorkDetailsComponent,
    AmAuditFieldWorkInfoComponent,
    AmAuditTestPlanDetailsComponent,
    AmAuditFieldWorkFindingsComponent,
    AmFieldWorkFindingDetailsComponent,
    FieldWorkTestPlanDetailsComponent,
    AmAuditFindingsComponent,
    AmAuditFindingInfoComponent,
    AmAuditFindingRcaComponent,
    AmAuditCommencementLetterLoaderComponent,
    AmAuditInfoRequestLoaderComponent,
    AmAuditPlanInfoLoaderComponent,
    AmAuditFindingIaComponent,
    AmAuditFindingCaComponent,
    AmAuditInfoLoaderComponent,
    AmAuditMeetingLoaderComponent,
    AmAuditTestPlanLoaderComponent,
    AssessmentDetailLoaderComponent,
    AmFieldworkInfoLoaderComponent,
    AmFindingCaHistoryModalComponent,
    AmAuditPreliminaryReportsComponent,
    AmAuditDraftReportsComponent,
    AmAuditFinalReportsComponent,
    AmAuditUniverseDepartmentListComponent,
    AmAuditCorrectiveActionsComponent,
    AmAuditReportsComponent,
    AmAuditsCountTypeComponent,
    AmAuditCountListComponent,
    AmAuditCaListComponent,
    AmAuditCaDetailsComponent,
    IndividualAuditPlanInfoComponent,
    ControlSelfAssessmentsComponent,
    CsaListComponent,
    CsaDetailsComponent,
    CsaChildComponent,
    AuditManagementOverviewComponent,
    AmCsaWorkflowComponent,
    AmCsaWorkflowHistoryComponent,
    AmCsaWorkflowCommentComponent,
    AmFindingsDashboardComponent,
    AmTopFindingsDashboardComponent,
    AmIndividualAuditPlansListComponent,
    AmAuditDashboardLoaderComponent,
    CalendarDetailsPopupComponent,
   
  ],
  imports: [
    CommonModule,
    AuditManagementRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FullCalendarModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,      
    }),
  ]
})
export class AuditManagementModule { }
