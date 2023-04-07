import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventMonitoringRoutingModule } from './event-monitoring-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventComponent } from './pages/event/event.component';
import { EventListComponent } from './pages/event/event-list/event-list.component';
import { AddEventComponent } from './pages/event/add-event/add-event.component';
import { EditEventComponent } from './pages/event/edit-event/edit-event.component';
import { EventDetailsComponent } from './pages/event/event-details/event-details.component';
import { ProfileDetailsComponent } from './pages/event/event-details/profile-details/profile-details.component';
import { EventSpecificationComponent } from './pages/event/event-details/event-specification/event-specification.component';
import { EventDocumentsComponent } from './pages/event/event-details/event-documents/event-documents.component';
import { EventDocumentModalComponent } from './pages/event/event-details/event-documents/event-document-modal/event-document-modal.component';
import { EventDocumentPreviewComponent } from './pages/event/event-details/event-documents/event-document-preview/event-document-preview.component';
import { EventSpecificationModalComponent } from './pages/event/event-details/event-specification/event-specification-modal/event-specification-modal.component';
import { EventBudgetComponent } from './pages/event/event-details/event-budget/event-budget.component';
import { AddEventBudgetComponent } from './components/add-event-budget/add-event-budget.component';
import { EventDeliverablesComponent } from './pages/event/event-details/event-deliverables/event-deliverables.component';
import { EventDeliverableModalComponent } from './pages/event/event-details/event-deliverables/event-deliverable-modal/event-deliverable-modal.component';
import { EventScopeComponent } from './pages/event/event-details/event-scope/event-scope.component';
import { EventScopeLoaderComponent } from './pages/event/event-details/event-scope/event-scope-loader/event-scope-loader.component';
import { AddEventScopeComponent } from './pages/event/event-details/event-scope/add-event-scope/add-event-scope.component';
import { EventTeamComponent } from './pages/event/event-details/event-team/event-team.component';
import { AddTeamComponent } from './components/add-team/add-team.component';
import { AddEventOutcomeComponent } from './components/add-event-outcome/add-event-outcome.component';
import { EventTaskComponent } from './pages/event/event-details/event-task/event-task.component';
import { AddEventTaskComponent } from './components/add-event-task/add-event-task.component';
import { EventTaskDetailsComponent } from './pages/event/event-details/event-task/event-task-details/event-task-details.component';
import { EventMilestoneComponent } from './pages/event/event-details/event-milestone/event-milestone/event-milestone.component';
import { AddEventMilestoneComponent } from './components/add-event-milestone/add-event-milestone.component';
import { EventClosureChecklistComponent } from './pages/event/event-details/event-closure-checklist/event-closure-checklist.component';
import { EventLessonLearntComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt.component';
import { EventLessonLearntDetailsComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt-details/event-lesson-learnt-details.component';
import { AddLessonLearnedComponent } from './components/add-lesson-learned/add-lesson-learned.component';
import { AddEventClosureComponent } from './components/add-event-closure/add-event-closure.component';
import { EventClosureDetailsComponent } from './pages/event/event-details/event-closure-checklist/event-closure-details/event-closure-details.component';
import { EventStakeholderComponent } from './pages/event/event-details/event-stakeholder/event-stakeholder.component';
import { EventStakeholderDetailsComponent } from './pages/event/event-details/event-stakeholder/event-stakeholder-details/event-stakeholder-details.component';
import { AddEventStakeholderComponent } from './components/add-event-stakeholder/add-event-stakeholder.component';
import { AddProgressUpdateComponent } from './components/add-progress-update/add-progress-update.component';
import { EventTeamLoaderComponent } from './loaders/event-team-loader/event-team-loader.component';
import { EventViewMoreComponent } from './components/event-view-more/event-view-more.component';
import { EventWorkflowEngineComponent } from './pages/event-workflow-engine/event-workflow-engine.component';
import { EventWorkflowListComponent } from './pages/event-workflow-engine/pages/event-workflow-list/event-workflow-list.component';
import { EventWorkflowAddComponent } from './pages/event-workflow-engine/component/event-workflow-add/event-workflow-add.component';
import { EventWorkflowDetailsComponent } from './pages/event-workflow-engine/pages/event-workflow-details/event-workflow-details.component';
import { WorkflowDetailsLoaderComponent } from './pages/event-workflow-engine/component/workflow-details-loader/workflow-details-loader.component';
import { EventStrategicThemesComponent } from './pages/event/event-details/event-strategic-themes/event-strategic-themes.component';
import { AddEventObjectiveComponent } from './components/add-event-objective/add-event-objective.component';
import { AddEventWorkflowCommentComponent } from './components/add-event-workflow-comment/add-event-workflow-comment.component';
import { EventWorkflowPopupComponent } from './components/event-workflow-popup/event-workflow-popup.component';
import { EventWorflowHistoryComponent } from './components/event-worflow-history/event-worflow-history.component';
import { AddLessonLearntCaComponent } from './components/add-lesson-learnt-ca/add-lesson-learnt-ca.component';
import { EventChangeRequestComponent } from './pages/event/event-details/event-change-request/event-change-request.component';
import { NewEventChangeRequestComponent } from './pages/event/event-details/event-change-request/new-event-change-request/new-event-change-request.component';
import { CreateEventChangeRequestComponent } from './components/create-event-change-request/create-event-change-request.component';
import { AddStrategicThemeComponent } from './components/add-strategic-theme/add-strategic-theme.component';
import { UpdateCaHistoryModalComponent } from './components/update-ca-history-modal/update-ca-history-modal.component';
import { UpdateCaStatusModalComponent } from './components/update-ca-status-modal/update-ca-status-modal.component';
import { EventObjectiveLoaderComponent } from './loaders/event-objective-loader/event-objective-loader.component';
import { EditEventChangeRequestComponent } from './pages/event/event-details/event-change-request/edit-event-change-request/edit-event-change-request.component';
import { EventCrBudgetComponent } from './components/event-cr-budget/event-cr-budget.component';
import { EventClosureReportComponent } from './pages/event/event-details/event-closure-report/event-closure-report.component';
import { MaturityMatrixComponent } from './pages/maturity-matrix/maturity-matrix.component';
// import { MaturityMatrixListComponent } from './pages/maturity-matrix/pages/maturity-matrix-list/maturity-matrix-list.component';
// import { MaturityMatrixPlanListComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-list/maturity-matrix-plan-list.component';
import { AddMatrixPlanComponent } from './components/add-matrix-plan/add-matrix-plan.component';
// import { EventMatrixPlanDetailsComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-list/pages/event-matrix-plan-details/event-matrix-plan-details.component';
import { MaturityMatrixCommonListComponent } from './pages/maturity-matrix/pages/maturity-matrix-common-list/maturity-matrix-common-list.component';
import { MaturityMatrixPlanDetailsComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-details/maturity-matrix-plan-details.component';
import { MaturityMatrixListComponent } from './pages/maturity-matrix/pages/maturity-matrix-common-list/maturity-matrix-list/maturity-matrix-list.component';
import { MaturityMatrixPlanListComponent } from './pages/maturity-matrix/pages/maturity-matrix-common-list/maturity-matrix-plan-list/maturity-matrix-plan-list.component';
import { EventMatrixPlanDetailsComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-details/event-matrix-plan-details/event-matrix-plan-details.component';
import { EventCalendarComponent } from './pages/event-calendar/event-calendar.component';
import { EventCrScopeComponent } from './components/event-cr-scope/event-cr-scope.component';
import { EventChangeRequestListComponent } from './pages/event-change-request/event-change-request-list/event-change-request-list.component';
import { EventChangeRequestDetailsComponent } from './pages/event-change-request/event-change-request-details/event-change-request-details.component';
import { EventsChangeRequestComponent } from './pages/event-change-request/event-change-request.component';
import { RiskRegisterComponent } from './pages/risk-register/risk-register.component';
import { RiskRegisterAddComponent } from './pages/risk-register/risk-register-add/risk-register-add.component';
import { RiskRegisterListComponent } from './pages/risk-register/risk-register-list/risk-register-list.component';
import { CaImagePreviewComponent } from './components/ca-image-preview/ca-image-preview.component';
import { EventMatrixPlanAsessmentComponent } from './pages/maturity-matrix/pages/maturity-matrix-plan-details/event-matrix-plan-asessment/event-matrix-plan-asessment.component';
import { EventClosureWorkflowComponent } from './components/event-closure-workflow/event-closure-workflow.component';
import { EventClosureCommentsComponent } from './components/event-closure-comments/event-closure-comments.component';
import { MaturityMatrixPlanDetailsLoaderComponent } from './loaders/maturity-matrix-plan-details-loader/maturity-matrix-plan-details-loader.component';
import { MaturityMatrixListLoaderComponent } from './loaders/maturity-matrix-list-loader/maturity-matrix-list-loader.component';
import { EventClosureWorkflowHistoryComponent } from './components/event-closure-workflow-history/event-closure-workflow-history.component';
import { EventDetailsValidationCheckComponent } from './components/event-details-validation-check/event-details-validation-check.component';
import { AsessmentConfirmationModalComponent } from './pages/maturity-matrix/components/asessment-confirmation-modal/asessment-confirmation-modal.component';
import { UpdatePercentageComponent } from './components/update-percentage/update-percentage.component';
import { EventClosureComponent } from './pages/event-closure/event-closure.component';
import { EventClosureListComponent } from './pages/event-closure/event-closure-list/event-closure-list.component';
import { EventTaskListComponent } from './pages/event-task/event-task-list/event-task-list.component';
import { EventTaskSubmenuComponent } from './pages/event-task/event-task-submenu.component';
import { AddEventSecondaryOwnersComponent } from './components/add-event-secondary-owners/add-event-secondary-owners.component';
import { EventCalendarLoaderComponent } from './loaders/event-calendar-loader/event-calendar-loader.component';
import { EventProfileDetailsLoaderComponent } from './loaders/event-profile-details-loader/event-profile-details-loader.component';
import { EventProfileTeamLoaderComponent } from './loaders/event-profile-team-loader/event-profile-team-loader.component';
import { EventProfileObjectiveLoaderComponent } from './loaders/event-profile-objective-loader/event-profile-objective-loader.component';
import { EventProfileStakeholderAnalysisLoaderComponent } from './loaders/event-profile-stakeholder-analysis-loader/event-profile-stakeholder-analysis-loader.component';
import { EventProfileStakeholderAnalysisMatrixLoaderComponent } from './loaders/event-profile-stakeholder-analysis-matrix-loader/event-profile-stakeholder-analysis-matrix-loader.component';
import { EventProfileDeliverablesLoaderComponent } from './loaders/event-profile-deliverables-loader/event-profile-deliverables-loader.component';
import { EventProfileMilestoneLoaderComponent } from './loaders/event-profile-milestone-loader/event-profile-milestone-loader.component';
import { EventClosureChecklistLoaderComponent } from './loaders/event-closure-checklist-loader/event-closure-checklist-loader.component';
import { EventStakeholderDetailsLoaderComponent } from './loaders/event-stakeholder-details-loader/event-stakeholder-details-loader.component';
import { EventTaskDetailsLoaderComponent } from './loaders/event-task-details-loader/event-task-details-loader.component';
import { EventLessonLearntDetailsLoaderComponent } from './loaders/event-lesson-learnt-details-loader/event-lesson-learnt-details-loader.component';
import { EventChangeManagementDetailsLoaderComponent } from './loaders/event-change-management-details-loader/event-change-management-details-loader.component';
import { EventChangeManagementDetailsEventBudgetLoaderComponent } from './loaders/event-change-management-details-event-budget-loader/event-change-management-details-event-budget-loader.component';
import { EventChangeManagementDetailsEventScopeLoaderComponent } from './loaders/event-change-management-details-event-scope-loader/event-change-management-details-event-scope-loader.component';
import { EventChangeManagementDetailsEventStatusLoaderComponent } from './loaders/event-change-management-details-event-status-loader/event-change-management-details-event-status-loader.component';
import { MaturityMatrixLoaderComponent } from './loaders/maturity-matrix-loader/maturity-matrix-loader.component';
import { EventRiskRegisterDetailsRiskLoaderComponent } from './loaders/event-risk-register-details-risk-loader/event-risk-register-details-risk-loader.component';
import { TableLeftTabLoaderComponent } from './loaders/table-left-tab-loader/table-left-tab-loader.component';
import { PlanDetailsLoaderComponent } from './loaders/plan-details-loader/plan-details-loader.component';
import { EventChecklistComponent } from './pages/event/event-details/event-checklist/event-checklist.component';
import { AddEventChecklistComponent } from './components/add-event-checklist/add-event-checklist.component';
import { EventChecklistDetailsComponent } from './pages/event/event-details/event-checklist/event-checklist-details/event-checklist-details.component';
import { FullOfSecondaryOwnersComponent } from './components/full-of-secondary-owners/full-of-secondary-owners.component';
import { MappingEventComponent } from './pages/event/event-details/mapping-event/mapping-event.component';
import { EventChecklistPopupLoaderComponent } from './loaders/event-checklist-popup-loader/event-checklist-popup-loader.component';
import { EventTaskHistoryComponent } from './components/event-task-history/event-task-history.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PdfReportComponent } from './pages/reports/pdf-report/pdf-report.component';
import { EventCountListComponent } from './pages/reports/event-report/event-count-list/event-count-list.component';
import { EventCountTypeComponent } from './pages/reports/event-report/event-count-type/event-count-type.component';
import { EventDashboardComponent } from './pages/event-dashboard/event-dashboard.component';
import { StakeholderMatrixComponent } from './pages/stakeholder-matrix/stakeholder-matrix.component';
import { EventClosureDashboardComponent } from './pages/event-closure-dashboard/event-closure-dashboard.component';
import { EventChangeRequestDashboardComponent } from './pages/event-change-request-dashboard/event-change-request-dashboard.component';
import { EventClosureInsideEventComponent } from './pages/event/event-details/event-closure-inside-event/event-closure-inside-event.component';
import { EventClosureDetailsInsideEventComponent } from './pages/event/event-details/event-closure-inside-event/event-closure-details-inside-event/event-closure-details-inside-event.component';
import { AddEventClosureMainComponent } from './components/add-event-closure-main/add-event-closure-main.component';
import { StakeholderDashboardComponent } from './pages/event-dashboard/stakeholder-dashboard/stakeholder-dashboard.component';
import { EventReportComponent } from './pages/event-report/event-report.component';
import { ReportComponent } from './pages/event-report/report/report.component';
import { EventReportDetailsComponent } from './pages/event-report/event-report-details/event-report-details.component';
import { EditEventBudgetChangeRequestComponent } from './components/edit-event-budget-change-request/edit-event-budget-change-request.component';
import { EditEventScopeChangeRequestComponent } from './components/edit-event-scope-change-request/edit-event-scope-change-request.component';
import { EditEventDateChangeRequestComponent } from './components/edit-event-date-change-request/edit-event-date-change-request.component';
import { EditEventDeliverablesChangeRequestComponent } from './components/edit-event-deliverables-change-request/edit-event-deliverables-change-request.component';
import { AddEventClosureScopeComponent } from './components/add-event-closure-scope/add-event-closure-scope.component';
import { EventClosureDetailsListPageComponent } from './pages/event-closure/event-closure-details-list-page/event-closure-details-list-page.component';
import { LessonLearntInfoComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt-details/lesson-learnt-info/lesson-learnt-info.component';
import { LessonLearntCaComponent } from './pages/event/event-details/event-lesson-learnt/event-lesson-learnt-details/lesson-learnt-ca/lesson-learnt-ca.component';
import { AddExternalUserComponent } from './components/add-external-user/add-external-user.component';
import { EventMonitoringOverviewComponent } from './pages/event-monitoring-overview/event-monitoring-overview.component';
import { RiskDetailsComponent } from './pages/risk-register/risk-details/risk-details.component';
import { RiskMappingComponent } from './pages/risk-register/risk-details/risk-mapping/risk-mapping.component';
import { RiskRegisterDetailsComponent } from './pages/risk-register/risk-context/risk-register-details.component';

import { EditEventMemberComponent } from './components/edit-event-member/edit-event-member.component';
import { EventRiskAssessmentComponent } from './pages/risk-register/risk-details/event-risk-assessment/event-risk-assessment.component';
import { EventRiskAssessmentModelComponent } from './components/event-risk-assessment-model/event-risk-assessment-model.component';
import { EventRiskAssessmentLoaderComponent } from './loaders/event-risk-assessment-loader/event-risk-assessment-loader.component';
import { RiskTreatmentComponent } from './pages/risk-register/risk-details/risk-treatment/risk-treatment.component';
import { AddRiskTreatmentComponent } from './pages/risk-register/risk-details/risk-treatment/add-risk-treatment/add-risk-treatment.component';
import { RiskTreatmentUpdateComponent } from './pages/risk-register/risk-details/risk-treatment/risk-treatment-update/risk-treatment-update.component';
import { EventRiskContextLoaderComponent } from './loaders/event-risk-context-loader/event-risk-context-loader.component';
import { EventRiskMappingLoaderComponent } from './loaders/event-risk-mapping-loader/event-risk-mapping-loader.component';
import { ResidualRiskComponent } from './pages/risk-register/risk-details/residual-risk/residual-risk.component';
import { EventRiskJourneyComponent } from './pages/risk-register/risk-details/event-risk-journey/event-risk-journey.component';
import { AddRiskRegisterComponent } from './components/add-risk-register/add-risk-register.component';
import { RiskContextEditComponent } from './pages/risk-register/risk-context/risk-context-edit/risk-context-edit.component';
// import { LessonLearntListComponent } from './pages/event/event-details/event-lesson-learnt/lesson-learnt-list/lesson-learnt-list.component';


@NgModule({
  declarations: [
    EventComponent,
    EventListComponent,
    AddEventComponent,
    EditEventComponent,
    EventDetailsComponent,
    ProfileDetailsComponent,
    EventSpecificationComponent,
    EventDocumentsComponent,
    EventDocumentModalComponent,
    EventDocumentPreviewComponent,
    EventSpecificationModalComponent,
    EventBudgetComponent,
    AddEventBudgetComponent,
    EventDeliverablesComponent,
    EventDeliverableModalComponent,
    EventScopeComponent,
    EventScopeLoaderComponent,
    AddEventScopeComponent,
    EventTeamComponent,
    AddTeamComponent,
    AddEventOutcomeComponent,
    EventTaskComponent,
    AddEventTaskComponent,
    EventTaskDetailsComponent,
    EventMilestoneComponent,
    AddEventMilestoneComponent,
    EventClosureChecklistComponent,
    EventLessonLearntComponent,
    EventLessonLearntDetailsComponent,
    AddLessonLearnedComponent,
    AddEventClosureComponent,
    EventClosureDetailsComponent,
    EventStakeholderComponent,
    EventStakeholderDetailsComponent,
    AddEventStakeholderComponent,
    EventTeamLoaderComponent,
    EventStrategicThemesComponent,
    AddEventObjectiveComponent,
    AddProgressUpdateComponent,
    EventTeamLoaderComponent,
    EventViewMoreComponent,
    EventWorkflowEngineComponent,
    EventWorkflowListComponent,
    EventWorkflowAddComponent,
    EventWorkflowDetailsComponent,
    WorkflowDetailsLoaderComponent,
    AddEventWorkflowCommentComponent,
    EventWorkflowPopupComponent,
    EventWorflowHistoryComponent,
    LessonLearntInfoComponent,
    LessonLearntCaComponent,
    AddLessonLearntCaComponent,
    EventChangeRequestComponent,
    NewEventChangeRequestComponent,
    CreateEventChangeRequestComponent,
    AddStrategicThemeComponent,
    UpdateCaHistoryModalComponent,
    UpdateCaStatusModalComponent,
    EventObjectiveLoaderComponent,
    EditEventChangeRequestComponent,
    EventCrBudgetComponent,
    EventClosureReportComponent,
    MaturityMatrixComponent,
    MaturityMatrixListComponent,
    MaturityMatrixPlanListComponent,
    AddMatrixPlanComponent,
    EventMatrixPlanDetailsComponent,
    MaturityMatrixCommonListComponent,
    MaturityMatrixPlanDetailsComponent,
    EventCalendarComponent,
    EventCrScopeComponent,
    EventChangeRequestListComponent,
    EventChangeRequestDetailsComponent,
    EventsChangeRequestComponent,
    RiskRegisterComponent,
    RiskRegisterAddComponent,
    RiskRegisterListComponent,
    CaImagePreviewComponent,
    EventMatrixPlanAsessmentComponent,
    EventClosureWorkflowComponent,
    EventClosureCommentsComponent,
    MaturityMatrixPlanDetailsLoaderComponent,
    MaturityMatrixListLoaderComponent,
    EventClosureWorkflowHistoryComponent,
    EventDetailsValidationCheckComponent,
    AsessmentConfirmationModalComponent,
    UpdatePercentageComponent,
    EventClosureComponent,
    EventClosureListComponent,
    EventTaskListComponent,
    EventTaskSubmenuComponent,
    AddEventSecondaryOwnersComponent,
    EventCalendarLoaderComponent,
    EventProfileDetailsLoaderComponent,
    EventProfileTeamLoaderComponent,
    EventProfileObjectiveLoaderComponent,
    EventProfileStakeholderAnalysisLoaderComponent,
    EventProfileStakeholderAnalysisMatrixLoaderComponent,
    EventProfileDeliverablesLoaderComponent,
    EventProfileMilestoneLoaderComponent,
    EventClosureChecklistLoaderComponent,
    EventStakeholderDetailsLoaderComponent,
    EventTaskDetailsLoaderComponent,
    EventLessonLearntDetailsLoaderComponent,
    EventChangeManagementDetailsLoaderComponent,
    EventChangeManagementDetailsEventBudgetLoaderComponent,
    EventChangeManagementDetailsEventScopeLoaderComponent,
    EventChangeManagementDetailsEventStatusLoaderComponent,
    MaturityMatrixLoaderComponent,
    EventRiskRegisterDetailsRiskLoaderComponent,
    TableLeftTabLoaderComponent,
    PlanDetailsLoaderComponent,
    EventChecklistComponent,
    AddEventChecklistComponent,
    EventChecklistDetailsComponent,
    FullOfSecondaryOwnersComponent,
    MappingEventComponent,
    EventChecklistPopupLoaderComponent,
    EventTaskHistoryComponent,
    ReportsComponent,
    PdfReportComponent,
    EventCountListComponent,
    EventCountTypeComponent,
    EventDashboardComponent,
    StakeholderMatrixComponent,
    EventClosureDashboardComponent,
    EventChangeRequestDashboardComponent,
    EventClosureInsideEventComponent,
    EventClosureDetailsInsideEventComponent,
    AddEventClosureMainComponent,
    StakeholderDashboardComponent,    
    EventReportComponent,
    ReportComponent,
    EventReportDetailsComponent,
    EditEventBudgetChangeRequestComponent,
    EditEventScopeChangeRequestComponent,
    EditEventDateChangeRequestComponent,
    EditEventDeliverablesChangeRequestComponent,
    AddEventClosureScopeComponent,
    EventClosureDetailsListPageComponent,
    RiskRegisterDetailsComponent,
    AddExternalUserComponent,
    EventMonitoringOverviewComponent,
    RiskDetailsComponent,
    RiskMappingComponent,
    EditEventMemberComponent,
    EventRiskAssessmentComponent,
    EventRiskAssessmentModelComponent,
    EventRiskAssessmentLoaderComponent,
    RiskTreatmentComponent,
    AddRiskTreatmentComponent,
    RiskTreatmentUpdateComponent,
    EventRiskContextLoaderComponent,
    EventRiskMappingLoaderComponent,
    ResidualRiskComponent,
    EventRiskJourneyComponent,
    AddRiskRegisterComponent,
    RiskContextEditComponent,
    // LessonLearntListComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    EventMonitoringRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [
    AddTeamComponent,
  ]
})
export class EventMonitoringModule { }
