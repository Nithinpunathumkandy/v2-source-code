import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { MsAuditManagementRoutingModule } from './ms-audit-management-routing.module';
import { MsAuditTeamComponent } from './pages/ms-audit-team/ms-audit-team.component';
import { MsAuditProgramsComponent } from './pages/ms-audit-programs/ms-audit-programs.component';
import { MsAuditProgramsListComponent } from './pages/ms-audit-programs/ms-audit-programs-list/ms-audit-programs-list.component';
import { MsAuditProgramsDetialsComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/ms-audit-programs-detials.component';
import { MsAuditProgramsAddComponent } from './pages/ms-audit-programs/ms-audit-programs-add/ms-audit-programs-add.component';
import { MsAuditProgramListLoaderComponent } from './components/loader/ms-audit-program-list-loader/ms-audit-program-list-loader.component';
import { InfoComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/info/info.component';
import { MsAuditProgramDetialsComponent } from './components/loader/ms-audit-program-detials/ms-audit-program-detials.component';
import { MsAuditPlansComponent } from './pages/ms-audit-plans/ms-audit-plans.component';
import { MsAuditPlansAddComponent } from './pages/ms-audit-plans/ms-audit-plans-add/ms-audit-plans-add.component';
import { MsAuditPlansDetialsComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/ms-audit-plans-detials.component';
import { MsAuditPlansListComponent } from './pages/ms-audit-plans/ms-audit-plans-list/ms-audit-plans-list.component';
import { MsAuditPlansInfoComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/ms-audit-plans-info/ms-audit-plans-info.component';
import { MsAuditCheckListComponent } from './pages/ms-audit-check-list/ms-audit-check-list.component';
import { AddCheckListComponent } from './components/add-check-list/add-check-list.component';
import { MsAuditComponent } from './pages/ms-audit/ms-audit.component';
import { MsAuditListComponent } from './pages/ms-audit/ms-audit-list/ms-audit-list.component';
import { MsAuditAddComponent } from './pages/ms-audit/ms-audit-add/ms-audit-add.component';
import { AddAuditorComponent } from './components/add-auditor/add-auditor.component';
import { AddAuditeesComponent } from './components/add-auditees/add-auditees.component';
import { MsAuditDetailsComponent } from './pages/ms-audit/ms-audit-details/ms-audit-details.component';
import { MsAuditInfoComponent } from './pages/ms-audit/ms-audit-details/ms-audit-info/ms-audit-info.component';
import { DocumentsComponent } from './pages/ms-audit/ms-audit-details/documents/documents.component';
import { CheckListFilePreviewComponent } from './components/check-list-file-preview/check-list-file-preview.component';
import { InnerDocumentVersionsComponent } from './components/inner-document-versions/inner-document-versions.component';
import { MsAuditSchedulesComponent } from './pages/ms-audit-schedules/ms-audit-schedules.component';
import { MsAuditSchedulesDetialsComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedules-detials.component';
import { MsAuditSchedulesAddComponent } from './pages/ms-audit-schedules/ms-audit-schedules-add/ms-audit-schedules-add.component';
import { MsAuditSchedulesListComponent } from './pages/ms-audit-schedules/ms-audit-schedules-list/ms-audit-schedules-list.component';
import { MsAuditSchedulesInfoComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedules-info/ms-audit-schedules-info.component';
import { AuditCheckListComponent } from './pages/ms-audit/ms-audit-details/audit-check-list/audit-check-list.component';
import { MsAuditChecklistLoaderComponent } from './components/loader/ms-audit-checklist-loader/ms-audit-checklist-loader.component';
import { MsAuditChecklistLoaderIndividualComponent } from './components/loader/ms-audit-checklist-loader-individual/ms-audit-checklist-loader-individual.component';
import { AddDocumentComponent } from './pages/ms-audit/ms-audit-details/documents/add-document/add-document.component';
import { MsAuditManagementPreviewComponent } from './components/ms-audit-management-preview/ms-audit-management-preview.component';
import { ChooseCheckListComponent } from './components/choose-check-list/choose-check-list.component';
import { ChecklistAddAnswerComponent } from './components/checklist-add-answer/checklist-add-answer.component';
import { MsAuditTeamDetailsComponent } from './pages/ms-audit-team/ms-audit-team-details/ms-audit-team-details.component';
import { MsAuditTeamListComponent } from './pages/ms-audit-team/ms-audit-team-list/ms-audit-team-list.component';
import { MsAuditTeamsDetailsLoaderComponent } from './components/loader/ms-audit-teams-details-loader/ms-audit-teams-details-loader.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LoaderListComponent } from './components/loader/loader-list/loader-list.component';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { CheckListViewAnswerComponent } from './components/check-list-view-answer/check-list-view-answer.component';
import { UpdateComponent } from './components/ms-audit-schedules/update/update.component';
import { AuditPlanComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/audit-plan/audit-plan.component';
import { SchedulesComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/schedules/schedules.component';
import { PlanSchedulesComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/plan-schedules/plan-schedules.component';
import { MsAuditInfoLoaderComponent } from './components/loader/ms-audit-info-loader/ms-audit-info-loader.component';
import { MsAuditDocLoaderComponent } from './components/loader/ms-audit-doc-loader/ms-audit-doc-loader.component';
import { AuditNonConfirmityComponent } from './pages/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.component';
import { NewAuditNonConfirmityComponent } from './components/new-audit-non-confirmity/new-audit-non-confirmity.component';
import { AuditNonConformityDetailsComponent } from './pages/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-conformity-details/audit-non-conformity-details.component';
import { NonConfirmityInnerDocumentsComponent } from './components/non-confirmity-inner-documents/non-confirmity-inner-documents.component';
import { AuditFollowUpComponent } from './pages/ms-audit/ms-audit-details/audit-follow-up/audit-follow-up.component';
import { MsAuditFollowUpDetailsComponent } from './pages/ms-audit/ms-audit-follow-up-details/ms-audit-follow-up-details.component';
import { FollowUpInfoComponent } from './pages/ms-audit/ms-audit-follow-up-details/follow-up-info/follow-up-info.component';
import { FollowUpComponent } from './pages/ms-audit/ms-audit-follow-up-details/follow-up/follow-up.component';
import { PreviewComponent } from './components/preview/preview.component';
import { AnnualSummaryComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/annual-summary/annual-summary.component';
import { AnnualSummaryFormComponent } from './components/annual-summary-form/annual-summary-form.component';
import { AddFollowUpComponent } from './components/add-follow-up/add-follow-up.component';
import { FollowUpActionPlanComponent } from './components/follow-up-action-plan/follow-up-action-plan.component';
import { AuditReportComponent } from './pages/ms-audit/ms-audit-details/audit-report/audit-report.component';
import { AgendaFormComponent } from './components/agenda-form/agenda-form.component';
import { AuditReportUpdateModalComponent } from './components/audit-report-update-modal/audit-report-update-modal.component';
import { NgAuditPlanDetialsLoaderComponent } from './components/loader/ms-audit-plan/ng-audit-plan-detials-loader/ng-audit-plan-detials-loader.component';
import { MsAuditScheduleDetialsLoaderComponent } from './components/loader/ms-audit-schedule/ms-audit-schedule-detials-loader/ms-audit-schedule-detials-loader.component';
import { MsAuditProgramDetialsLoaderComponent } from './components/loader/ms-audit-program/ms-audit-program-detials-loader/ms-audit-program-detials-loader.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { AuditWorkflowEngineComponent } from './pages/audit-workflow-engine/audit-workflow-engine.component';
import { AuditWorkflowListComponent } from './pages/audit-workflow-engine/audit-workflow-list/audit-workflow-list.component';
import { AuditWorkflowDetailsComponent } from './pages/audit-workflow-engine/audit-workflow-details/audit-workflow-details.component';
import { AuditWorkflowAddComponent } from './components/audit-workflow-add/audit-workflow-add.component';
import { MsAuditNonConfirmitiesComponent } from './pages/ms-audit-non-confirmities/ms-audit-non-confirmities.component';
import { AuditPlanWorkflowCommentComponent } from './components/audit-plan-workflow/audit-plan-workflow-comment/audit-plan-workflow-comment.component';
import { AuditPlanWorkflowHistoryComponent } from './components/audit-plan-workflow/audit-plan-workflow-history/audit-plan-workflow-history.component';
import { AuditPlanWorkflowPopupComponent } from './components/audit-plan-workflow/audit-plan-workflow-popup/audit-plan-workflow-popup.component';
import { NonConfirmitiesDetialsComponent } from './pages/ms-audit-non-confirmities/non-confirmities-detials/non-confirmities-detials.component';
import { NonConfirmitiesListComponent } from './pages/ms-audit-non-confirmities/non-confirmities-list/non-confirmities-list.component';
import { RejectCorrectiveActionComponent } from './components/reject-corrective-action/reject-corrective-action.component';
import { CorrectiveActionHistoryComponent } from './components/corrective-action-history/corrective-action-history.component';
import { MsAuditDashboardLoaderComponent } from './components/loader/ms-audit-dashboard-loader/ms-audit-dashboard-loader.component';
import { FollowUpLoaderComponent } from './components/loader/follow-up-loader/follow-up-loader.component';
import { MsAuditCheckListLoaderComponent } from './components/loader/ms-audit-check-list-loader/ms-audit-check-list-loader.component';
import { AuditProgramReportComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/audit-report/audit-report.component';
import { AuditProgramReportUpdateModalComponent } from './components/audit-program-report-update-modal/audit-program-report-update-modal.component';
import { SummaryReportComponent } from './pages/summary-report/summary-report.component';
import { ChooseAuditSummaryComponent } from './components/choose-audit-summary/choose-audit-summary.component';
import { SummaryReportListComponent } from './pages/summary-report/summary-report-list/summary-report-list.component';
import { SummaryReportInfoComponent } from './pages/summary-report/summary-report-info/summary-report-info.component';
import { ExportSummaryReortComponent } from './pages/summary-report/export-summary-reort/export-summary-reort.component';
import { CorrectiveActionListComponent } from './pages/corrective-actions/corrective-action-list/corrective-action-list.component';
import { MsAuditManagementOverviewComponent } from './pages/ms-audit-management-overview/ms-audit-management-overview.component';
import { MsAuditReportsComponent } from './pages/ms-audit-reports/ms-audit-reports.component';
import { MsAuditReportListComponent } from './pages/ms-audit-reports/pages/ms-audit-report-list/ms-audit-report-list.component';
import { MsAuditReportDetailsComponent } from './pages/ms-audit-reports/pages/ms-audit-report-details/ms-audit-report-details.component';
import { MsAuditDetailReportComponent } from './pages/ms-audit-reports/pages/ms-audit-detail-report/ms-audit-detail-report.component';
import { MsAuditScheduleChecklistComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedule-checklist/ms-audit-schedule-checklist.component';
import { StartMsAuditComponent } from './components/start-ms-audit/start-ms-audit.component';
import { MsAuditScheduleMsAuditComponent } from './pages/ms-audit/ms-audit-details/ms-audit-schedule-ms-audit/ms-audit-schedule-ms-audit.component';
import { MarkAuditModalComponent } from './components/audit-plan-info/mark-audit-modal/mark-audit-modal.component';
import { FindingsRcaComponent } from './pages/ms-audit/ms-audit-follow-up-details/findings-rca/findings-rca.component';
import { FindingsCaComponent } from './pages/ms-audit/ms-audit-follow-up-details/findings-ca/findings-ca.component';
import { AddRootCauseAnalysisFindingsComponent } from './components/add-root-cause-analysis-findings/add-root-cause-analysis-findings.component';
import { RcaLoaderMsAuditFindingsComponent } from './components/loader/rca-loader-ms-audit-findings/rca-loader-ms-audit-findings.component';
import { AddCorrectiveActionModalMsAuditComponent } from './components/add-corrective-action-modal-ms-audit/add-corrective-action-modal-ms-audit.component';
import { UpdateCorrectiveActionModalMsAuditComponent } from './components/update-corrective-action-modal-ms-audit/update-corrective-action-modal-ms-audit.component';
import { HistoryCorrectiveActionModalMsAuditComponent } from './components/history-corrective-action-modal-ms-audit/history-corrective-action-modal-ms-audit.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-actions/corrective-action-details/corrective-action-details.component';
import { CorrectiveActionComponent } from './pages/corrective-actions/corrective-action/corrective-action.component';
import { AuditPlanReportComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/audit-plan-report/audit-plan-report.component';
import { MsAuditScheduleFindingComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedule-finding/ms-audit-schedule-finding.component';
import { OpeningMeetingParticipantsComponent } from './components/opening-meeting-participants/opening-meeting-participants.component';
import { AuditPlanObjectiveMappingComponent } from './components/audit-plan-objective-mapping/audit-plan-objective-mapping.component';
import { AuditPlanCriteriaObjectiveComponent } from './components/audit-plan-criteria-objective/audit-plan-criteria-objective.component';
import { AuditPlanActivityLogComponent } from './components/audit-plan-activity-log/audit-plan-activity-log.component';
import { AuditPlanActivityLogLoaderComponent } from './components/loader/audit-plan-activity-log-loader/audit-plan-activity-log-loader.component';
import { AuditScheduleActivityLogComponent } from './components/audit-schedule-activity-log/audit-schedule-activity-log.component';
import { MsAuditActivityLogComponent } from './components/ms-audit-activity-log/ms-audit-activity-log.component';



@NgModule({
  declarations: [
    MsAuditTeamComponent,
    AddTeamComponent,
    MsAuditProgramsComponent,
    MsAuditProgramsListComponent,
    MsAuditProgramsDetialsComponent,
    MsAuditProgramsAddComponent,
    MsAuditProgramListLoaderComponent,
    InfoComponent,
    MsAuditProgramDetialsComponent,
    MsAuditPlansComponent,
    MsAuditPlansAddComponent,
    MsAuditPlansDetialsComponent,
    MsAuditPlansListComponent,
    MsAuditPlansInfoComponent,
    MsAuditCheckListComponent,
    AddCheckListComponent,
    MsAuditComponent,
    MsAuditListComponent,
    MsAuditAddComponent,
    AddAuditorComponent,
    AddAuditeesComponent,
    MsAuditDetailsComponent,
    MsAuditInfoComponent,
    DocumentsComponent,
    CheckListFilePreviewComponent,
    InnerDocumentVersionsComponent,
    MsAuditSchedulesComponent,
    MsAuditSchedulesDetialsComponent,
    MsAuditSchedulesAddComponent,
    MsAuditSchedulesListComponent,
    MsAuditSchedulesInfoComponent,
    AuditCheckListComponent,
    MsAuditChecklistLoaderComponent,
    MsAuditChecklistLoaderIndividualComponent,
    AddDocumentComponent,
    MsAuditManagementPreviewComponent,
    ChooseCheckListComponent,
    ChecklistAddAnswerComponent,
    LoaderListComponent,
    CheckListViewAnswerComponent,
    UpdateComponent,
    AuditPlanComponent,
    SchedulesComponent,
    PlanSchedulesComponent,
    MsAuditTeamListComponent,
    // LoaderListComponent
    LoaderListComponent,
    MsAuditTeamsDetailsLoaderComponent,
    MsAuditTeamDetailsComponent,
    MsAuditInfoLoaderComponent,
    MsAuditDocLoaderComponent,
    AuditNonConfirmityComponent,
    NewAuditNonConfirmityComponent,
    AuditNonConformityDetailsComponent,
    NonConfirmityInnerDocumentsComponent,
    AuditFollowUpComponent,
    MsAuditFollowUpDetailsComponent,
    FollowUpInfoComponent,
    FollowUpComponent,
    PreviewComponent,
    AnnualSummaryComponent,
    AnnualSummaryFormComponent,
    AddFollowUpComponent,
    FollowUpActionPlanComponent,
    AuditReportComponent,
    AgendaFormComponent,
    AuditReportUpdateModalComponent,
    NgAuditPlanDetialsLoaderComponent,
    MsAuditScheduleDetialsLoaderComponent,
    MsAuditProgramDetialsLoaderComponent,
    DashboardComponent,
    AuditWorkflowEngineComponent,
    AuditWorkflowListComponent,
    AuditWorkflowDetailsComponent,
    AuditWorkflowAddComponent,
    MsAuditNonConfirmitiesComponent,
    AuditPlanWorkflowCommentComponent,
    AuditPlanWorkflowHistoryComponent,
    AuditPlanWorkflowPopupComponent,
    NonConfirmitiesDetialsComponent,
    NonConfirmitiesListComponent,
    RejectCorrectiveActionComponent,
    CorrectiveActionHistoryComponent,
    MsAuditDashboardLoaderComponent,
    FollowUpLoaderComponent,
    MsAuditCheckListLoaderComponent,
    AuditProgramReportComponent,
    AuditProgramReportUpdateModalComponent,
    SummaryReportComponent,
    ChooseAuditSummaryComponent,
    SummaryReportListComponent,
    SummaryReportInfoComponent,
    ExportSummaryReortComponent,
    CorrectiveActionListComponent,
    MsAuditManagementOverviewComponent,
    MsAuditReportsComponent,
    MsAuditReportListComponent,
    MsAuditReportDetailsComponent,
    MsAuditDetailReportComponent,
    MsAuditScheduleChecklistComponent,
    StartMsAuditComponent,
    MsAuditScheduleMsAuditComponent,
    MarkAuditModalComponent,
    FindingsRcaComponent,
    FindingsCaComponent,
    AddRootCauseAnalysisFindingsComponent,
    RcaLoaderMsAuditFindingsComponent,
    AddCorrectiveActionModalMsAuditComponent,
    UpdateCorrectiveActionModalMsAuditComponent,
    HistoryCorrectiveActionModalMsAuditComponent,
    CorrectiveActionDetailsComponent,
    CorrectiveActionComponent,
    AuditPlanReportComponent,
    MsAuditScheduleFindingComponent,
    OpeningMeetingParticipantsComponent,
    AuditPlanObjectiveMappingComponent,
    AuditPlanCriteriaObjectiveComponent,
    AuditPlanActivityLogComponent,
    AuditPlanActivityLogLoaderComponent,
    AuditScheduleActivityLogComponent,
    MsAuditActivityLogComponent,
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    SharedModule,
    MsAuditManagementRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ]
})
export class MsAuditManagementModule { }
