import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectMonitoringRoutingModule } from './project-monitoring-routing.module';
import { AddNewProjectComponent } from './components/add-new-project/add-new-project.component';
import { ProjectMonitoringListLoaderComponent } from './loaders/project-monitoring-list-loader/project-monitoring-list-loader.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProjectInformationComponent } from './pages/project-information/project-information.component';
import { ProjectDetailsComponent } from './pages/project-information/project-details/project-details.component';
import { ProjectInfoComponent } from './pages/project-information/project-details/project-info/project-info.component';
import { ProjectMonitoringListComponent } from './pages/project-information/project-monitoring-list/project-monitoring-list.component';
import { ProjectMilestoneComponent } from './pages/project-information/project-details/project-milestone/project-milestone.component';
import { ProjectStrategicAlignmentComponent } from './pages/project-information/project-details/project-strategic-alignment/project-strategic-alignment.component';
import { ProjectScopeOfWorkComponent } from './pages/project-information/project-details/project-scope-of-work/project-scope-of-work.component';
import { ProjectMonitoringWorkflowEngineComponent } from './pages/project-monitoring-workflow-engine/project-monitoring-workflow-engine.component';
import { ProjectWorkflowListComponent } from './pages/project-monitoring-workflow-engine/project-workflow-list/project-workflow-list.component';
import { ProjectWorkflowDetailsComponent } from './pages/project-monitoring-workflow-engine/project-workflow-details/project-workflow-details.component';
import { AddProjectWorkflowComponent } from './components/add-project-workflow/add-project-workflow.component';
import { AddNewMilestoneComponent } from './components/add-new-milestone/add-new-milestone.component';
import { AddScopeOfWorkComponent } from './components/add-scope-of-work/add-scope-of-work.component';
import { AddOutcomesModalComponent } from './components/add-outcomes-modal/add-outcomes-modal.component';
import { AddDeliverablesModalComponent } from './components/add-deliverables-modal/add-deliverables-modal.component';
import { ProjectStakeholderComponent } from './pages/project-information/project-details/project-stakeholder/project-stakeholder.component';
import { AddStakeholderComponent } from './components/add-stakeholder/add-stakeholder.component';
import { AddStrategyicAlignmentComponent } from './components/add-strategyic-alignment/add-strategyic-alignment.component';
import { ProjectDocumentComponent } from './pages/project-information/project-details/project-document/project-document.component';
import { AddDocumentModalComponent } from './components/add-document-modal/add-document-modal.component';
import { PreviewcomponentComponent } from './components/shared/previewcomponent/previewcomponent.component';
import { ProjectRiskComponent } from './pages/project-information/project-details/project-risk/project-risk.component';
import { AddProjectRiskComponent } from './components/add-project-risk/add-project-risk.component';
import { ProjectInInscopeComponent } from './pages/project-information/project-details/project-in-inscope/project-in-inscope.component';
import { ProjectOutInscopeComponent } from './pages/project-information/project-details/project-out-inscope/project-out-inscope.component';
import { ProjectAssumptionsComponent } from './pages/project-information/project-details/project-assumptions/project-assumptions.component';
import { ProjectTeamComponent } from './pages/project-information/project-details/project-team/project-team.component';
import { AddProjectTeamComponent } from './components/add-project-team/add-project-team.component';
import { AddExternalUsersComponent } from './components/add-external-users/add-external-users.component';
import { ProjectBudgetComponent } from './pages/project-information/project-details/project-budget/project-budget.component';
import { AddProjectBudgetComponent } from './components/add-project-budget/add-project-budget.component';
import { ProjectWorkflowCommentComponent } from './components/project-workflow-comment/project-workflow-comment.component';
import { ProjectWorkflowPopupComponent } from './components/project-workflow-popup/project-workflow-popup.component';
import { ProjectWorkflowHistoryComponent } from './components/project-workflow-history/project-workflow-history.component';
import { ProjectPaymentAddComponent } from './components/project-payment-add/project-payment-add.component';
import { AddIssueModalComponent } from './components/add-issue-modal/add-issue-modal.component';
import { ProjectIssueDetailsComponent } from './pages/project-information/project-details/project-issue/project-issue-details/project-issue-details.component';
import { ProjectIssueComponent } from './pages/project-information/project-details/project-issue/project-issue-list/project-issue.component';
import { AddMilestoneProgressComponent } from './components/add-milestone-progress/add-milestone-progress.component';
import { ProjectIssueInfoComponent } from './pages/project-information/project-details/project-issue/project-issue-details/project-issue-info/project-issue-info.component';
import { ProjectIssueCaComponent } from './pages/project-information/project-details/project-issue/project-issue-details/project-issue-ca/project-issue-ca.component';
import { ProjectInfoLoaderComponent } from './loaders/project-info-loader/project-info-loader.component';
import { ProjectTeamLoaderComponent } from './loaders/project-team-loader/project-team-loader.component';
import { ProjectStrategicAlignmentLoaderComponent } from './loaders/project-strategic-alignment-loader/project-strategic-alignment-loader.component';
import { ProjectScopeOfWorkLoaderComponent } from './loaders/project-scope-of-work-loader/project-scope-of-work-loader.component';
import { ProjectMilestoneLoaderComponent } from './loaders/project-milestone-loader/project-milestone-loader.component';
import { ProjectBudgetLoaderComponent } from './loaders/project-budget-loader/project-budget-loader.component';
import { AddIssueCaComponent } from './components/add-issue-ca/add-issue-ca.component';
import { PmCorrectiveActionComponent } from './pages/project-information/pm-corrective-action/pm-corrective-action.component';
import { PmCorrectiveActionListComponent } from './pages/project-information/pm-corrective-action/pages/pm-corrective-action-list/pm-corrective-action-list.component';
import { PmCorrectiveActionDetailsComponent } from './pages/project-information/pm-corrective-action/pages/pm-corrective-action-details/pm-corrective-action-details.component';
// import { AddPmCorrectiveActionComponent } from './pages/project-information/pm-corrective-action/components/add-pm-corrective-action/add-pm-corrective-action.component';
import { UpdatePmCorrectiveActionComponent } from './pages/project-information/pm-corrective-action/components/update-pm-corrective-action/update-pm-corrective-action.component';
import { ProjectWorkflowHistoryCommentsComponent } from './components/project-workflow-history-comments/project-workflow-history-comments.component';
import { PmIssuesComponent } from './pages/project-information/pm-issues/pm-issues.component';
import { PmIssueListComponent } from './pages/project-information/pm-issues/pages/pm-issue-list/pm-issue-list.component';
import { UpdateHistoryModalComponent } from './pages/project-information/pm-corrective-action/components/update-history-modal/update-history-modal.component';
import { AddProjectClosureModalComponent } from './components/add-project-closure-modal/add-project-closure-modal.component';
import { ProjectClosureDetailsComponent } from './pages/project-information/project-details/project-closure/project-closure-details/project-closure-details.component';
import { ProjectClosureComponent } from './pages/project-information/project-details/project-closure/project-closure-list/project-closure.component';
import { ChangeRequestListComponent } from './pages/project-information/project-details/project-change-request/change-request-list/change-request-list.component';
import { ChangeRequestDetailsComponent } from './pages/project-information/project-details/project-change-request/change-request-details/change-request-details.component';
import { AddChangeRequestComponent } from './components/add-change-request/add-change-request.component';
import { ExternalUsersModalComponent } from './components/external-users-modal/external-users-modal.component';
import { ProjectClosureListComponent } from './pages/project-information/project-closure/project-closure-list/project-closure.component';
import { ChangeRequestItemsComponent } from './components/change-request-items/change-request-items.component';
import { AddChangeRequestItemsComponent } from './pages/project-information/project-details/project-change-request/add-change-request-items/add-change-request-items.component';
import { ChangeRequestBudgetModalComponent } from './components/change-request-budget-modal/change-request-budget-modal.component';
import { ProjectClosureWorkflowHistoryComponent } from './components/project-closure-workflow-history/project-closure-workflow-history.component';
import { ProjectClosureWorkflowCommentComponent } from './components/project-closure-workflow-comment/project-closure-workflow-comment.component';
import { EditChangeRequestComponent } from './pages/project-information/project-details/project-change-request/edit-change-request/edit-change-request.component';
import { ProjectChangeRequestWorkflowCommentComponent } from './components/project-change-request-workflow-comment/project-change-request-workflow-comment.component';
import { ProjectChangeRequestWorkflowHistoryComponent } from './components/project-change-request-workflow-history/project-change-request-workflow-history.component';
import { ProjectChangeRequestWorkflowPopupComponent } from './components/project-change-request-workflow-popup/project-change-request-workflow-popup.component';
import { ProjectChangeRequestListComponent } from './pages/project-information/pm-change-requests/pages/project-change-request-list/project-change-request-list.component';
import { ProjectDetailsCompletedStatusComponent } from './components/project-details-completed-status/project-details-completed-status.component';
import { ChangeRequestDetailsLoaerComponent } from './loaders/change-request-details-loaer/change-request-details-loaer.component';
import { MilestoneProgressUpdateComponent } from './pages/project-information/project-details/milestone-progress-update/milestone-progress-update.component';
import { ChangeRequestItemsLoaderComponent } from './loaders/change-request-items-loader/change-request-items-loader.component';
import { ProjecctMonitoringPreviewComponent } from './components/projecct-monitoring-preview/projecct-monitoring-preview.component';
import { ProjectClosureWorkflowPopupComponent } from './components/project-closure-workflow-popup/project-closure-workflow-popup.component';
import { ProjectReportComponent } from './pages/project-information/project-report/project-report.component';
import { ProjectCountListComponent } from './pages/project-information/project-report/project-count-list/project-count-list.component';
import { ProjectCountTypeComponent } from './pages/project-information/project-report/project-count-type/project-count-type.component';
import { ProjectDashboardComponent } from './pages/project-dashboard/project-dashboard.component';
import { ProjectClosureDashboardComponent } from './pages/project-dashboard/project-closure-dashboard/project-closure-dashboard.component';
import { ChangeRequestDashboardComponent } from './pages/project-dashboard/change-request-dashboard/change-request-dashboard.component';
import { ProjectMonitoringDashboardLoaderComponent } from './loaders/project-monitoring-dashboard-loader/project-monitoring-dashboard-loader.component';
import { ProjectClosureDashboardLoaderComponent } from './loaders/project-closure-dashboard-loader/project-closure-dashboard-loader.component';
import { ChangeRequestDashboardLoaderComponent } from './loaders/change-request-dashboard-loader/change-request-dashboard-loader.component';
import { ProjectMonitoringOverviewComponent } from './pages/project-monitoring-overview/project-monitoring-overview.component';


@NgModule({
  declarations: [
    ProjectMonitoringListComponent,
    AddNewProjectComponent,
    ProjectMonitoringListLoaderComponent,
    ProjectDetailsComponent,
    ProjectInfoComponent,
    ProjectInformationComponent,
    ProjectMilestoneComponent,
    ProjectStrategicAlignmentComponent,
    ProjectScopeOfWorkComponent,
    ProjectMonitoringWorkflowEngineComponent,
    ProjectWorkflowListComponent,
    ProjectWorkflowDetailsComponent,
    AddProjectWorkflowComponent,
    AddNewMilestoneComponent,
    AddScopeOfWorkComponent,
    AddOutcomesModalComponent,
    AddDeliverablesModalComponent,
    ProjectStakeholderComponent,
    AddStakeholderComponent,
    AddStrategyicAlignmentComponent,
    ProjectDocumentComponent,
    AddDocumentModalComponent,
    PreviewcomponentComponent,
    ProjectRiskComponent,
    AddProjectRiskComponent,
    ProjectInInscopeComponent,
    ProjectOutInscopeComponent,
    ProjectAssumptionsComponent,
    ProjectTeamComponent,
    AddProjectTeamComponent,
    AddExternalUsersComponent,
    ProjectBudgetComponent,
    AddProjectBudgetComponent,
    ProjectWorkflowCommentComponent,
    ProjectWorkflowPopupComponent,
    ProjectWorkflowHistoryComponent,
    ProjectPaymentAddComponent,
    ProjectIssueComponent,
    AddIssueModalComponent,
    ProjectIssueDetailsComponent,
    AddMilestoneProgressComponent,
    ProjectIssueInfoComponent,
    ProjectIssueCaComponent,
    ProjectInfoLoaderComponent,
    ProjectTeamLoaderComponent,
    ProjectStrategicAlignmentLoaderComponent,
    ProjectScopeOfWorkLoaderComponent,
    ProjectMilestoneLoaderComponent,
    ProjectBudgetLoaderComponent,
    AddIssueCaComponent,
    PmCorrectiveActionComponent,
    PmCorrectiveActionListComponent,
    PmCorrectiveActionDetailsComponent,
    UpdatePmCorrectiveActionComponent,
    ProjectWorkflowHistoryCommentsComponent,
    PmIssuesComponent,
    PmIssueListComponent,
    UpdateHistoryModalComponent,
    ProjectClosureComponent,
    AddProjectClosureModalComponent,
    ProjectClosureDetailsComponent,
    ChangeRequestListComponent,
    ChangeRequestDetailsComponent,
    AddChangeRequestComponent,
    ExternalUsersModalComponent,
    ProjectClosureListComponent,
    ChangeRequestItemsComponent,
    AddChangeRequestItemsComponent,
    ChangeRequestBudgetModalComponent,
    ProjectClosureWorkflowPopupComponent,
    ProjectClosureWorkflowHistoryComponent,
    ProjectClosureWorkflowCommentComponent,
    EditChangeRequestComponent,
    ProjectChangeRequestWorkflowCommentComponent,
    ProjectChangeRequestWorkflowHistoryComponent,
    ProjectChangeRequestWorkflowPopupComponent,
    ProjectChangeRequestListComponent,
    ProjectDetailsCompletedStatusComponent,
    ChangeRequestDetailsLoaerComponent,
    MilestoneProgressUpdateComponent,
    ChangeRequestItemsLoaderComponent,
    ProjecctMonitoringPreviewComponent,
    ProjectReportComponent,
    ProjectCountListComponent,
    ProjectCountTypeComponent,
    ProjectDashboardComponent,
    ProjectClosureDashboardComponent,
    ChangeRequestDashboardComponent,
    ProjectMonitoringDashboardLoaderComponent,
    ProjectClosureDashboardLoaderComponent,
    ChangeRequestDashboardLoaderComponent,
    ProjectMonitoringOverviewComponent
  ],
  imports: [
    CommonModule,
    ProjectMonitoringRoutingModule,
    NgxPaginationModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CarouselModule,
  ]
})
export class ProjectMonitoringModule { }
