import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { KpiManagementRoutingModule } from './kpi-management-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';

import { KpiListLoaderComponent } from './components/loader/kpi/kpi-list-loader/kpi-list-loader.component';
import { FormsModule } from '@angular/forms';
import { KpiDetailsLoaderComponent } from './components/loader/kpi/kpi-details-loader/kpi-details-loader.component';

import { WorkflowDetailLoaderComponent } from './components/loader/workflow-detail-loader/workflow-detail-loader.component';
import { RevertComponent } from './components/kpi/work-flow/revert/revert.component';
import { WorkflowModalComponent } from './components/kpi/workflow-modal/workflow-modal.component';
import { WorkflowHistoryModalComponent } from './components/kpi/workflow-history-modal/workflow-history-modal.component';
import { KpiActivityLogsLoaderComponent } from './components/loader/kpi-activity-logs-loader/kpi-activity-logs-loader.component';

import { PreviewComponent } from './components/preview/preview.component';
import { ScoreModalComponent } from './components/kpi-score/score-modal/score-modal.component';
import { ApproveComponent } from './components/kpi/work-flow/approve/approve.component';
import { ScoreRevertComponent } from './components/kpi-score/workflow/score-revert/score-revert.component';
import { ScoreReviewSubmitComponent } from './components/kpi-score/workflow/score-review-submit/score-review-submit.component';
import { ImprovementPlansDetialsLoaderComponent } from './components/loader/improvement-plans-detials-loader/improvement-plans-detials-loader.component';
import { ImprovementPlansUpdateComponent } from './components/improvement-plans/improvement-plans-update/improvement-plans-update.component';
import { ImprovementPlansUpdateLoaderComponent } from './components/loader/improvement-plans-update-loader/improvement-plans-update-loader.component';
import { KpiComponent } from './pages/kpi/kpi.component';
import { KpiListComponent } from './pages/kpi/kpi-list/kpi-list.component';
import { KpiDetailsComponent } from './pages/kpi/kpi-details/kpi-details.component';
import { KpiAddComponent } from './pages/kpi/kpi-add/kpi-add.component';
import { KpiEditComponent } from './pages/kpi/kpi-edit/kpi-edit.component';
import { InfoComponent } from './pages/kpi/kpi-details/info/info.component';
import { KpiWorkflowComponent } from './pages/workflow/kpi-workflow.component';
import { KpiWorkflowAddModalComponent } from './pages/workflow/components/kpi-workflow-add-modal/kpi-workflow-add-modal.component';
import { KpiWorkflowListComponent } from './pages/workflow/pages/kpi-workflow-list/kpi-workflow-list.component';
import { KpiWorkflowDetailsComponent } from './pages/workflow/pages/kpi-workflow-details/kpi-workflow-details.component';
import { KpiScoreComponent } from './pages/kpi-score/kpi-score.component';
import { KpiScoreListComponent } from './pages/kpi-score/kpi-score-list/kpi-score-list.component';
import { KpiScoreDetialsComponent } from './pages/kpi-score/kpi-score-detials/kpi-score-detials.component';
import { InfoScoreComponent } from './pages/kpi-score/kpi-score-detials/info-score/info-score.component';
import { ScoreComponent } from './pages/kpi/kpi-details/score/score.component';
import { ImprovementPlansComponent } from './pages/improvement-plans/improvement-plans.component';
import { ImprovementPlansListComponent } from './pages/improvement-plans/improvement-plans-list/improvement-plans-list.component';
import { ImprovementPlansAddComponent } from './pages/improvement-plans/improvement-plans-add/improvement-plans-add.component';
import { ImprovementPlansDetailsComponent } from './pages/improvement-plans/improvement-plans-details/improvement-plans-details.component';
import { ImprovementPlansHistoryComponent } from './components/improvement-plans/improvement-plans-history/improvement-plans-history.component';
import { ImprovementPlanHistoryLoaderComponent } from './components/loader/improvement-plan-history-loader/improvement-plan-history-loader.component';
import { ImprovementPlanActivityLogsComponent } from './components/improvement-plans/improvement-plan-activity-logs/improvement-plan-activity-logs.component';
import { KpiScoreActivityLogsComponent } from './components/kpi-score/kpi-score-activity-logs/kpi-score-activity-logs.component';
import { KpiActitvityLogsComponent } from './components/kpi/kpi-actitvity-logs/kpi-actitvity-logs.component';
import { ImprovementPlanComponent } from './pages/kpi/kpi-details/improvement-plan/improvement-plan.component';
import { KpiScoreDetialsLoaderComponent } from './components/loader/kpi-score-detials-loader/kpi-score-detials-loader.component';
import { KpiScoreWorkflowModalComponent } from './components/kpi-score/kpi-score-workflow-modal/kpi-score-workflow-modal.component';
import { KpiScoreWorkflowHistoryModalComponent } from './components/kpi-score/kpi-score-workflow-history-modal/kpi-score-workflow-history-modal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { KpiCountTypeComponent } from './pages/reports/kpi-count-type/kpi-count-type.component';
import { KpiCountListComponent } from './pages/reports/kpi-count-list/kpi-count-list.component';
import { KpiReportLoaderComponent } from './components/loader/kpi-report-loader/kpi-report-loader.component';
import { OrganizationModule } from '../organization/organization.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { KpiDetialsComponent } from './pages/dashboard/kpi-detials/kpi-detials.component';
import { KpiMainDashbordComponent } from './pages/dashboard/kpi-main-dashbord/kpi-main-dashbord.component';
import { DashboardMainComponent } from './components/loader/dashboard/dashboard-main/dashboard-main.component';
import { KpiDetailsDashboardComponent } from './components/loader/dashboard/kpi-details-dashboard/kpi-details-dashboard.component';
import { PendingReviewsComponent } from './pages/dashboard/pending-reviews/pending-reviews.component';
import { PendingLoaderComponent } from './components/loader/dashboard/pending-loader/pending-loader.component';
import { KpiOverviewComponent } from './pages/kpi-overview/kpi-overview.component';
import { MsClauseLoopComponent } from './components/kpi/ms-clause-loop/ms-clause-loop.component';

@NgModule({
  declarations: [
    KpiComponent,
    KpiListComponent,
    KpiDetailsComponent,
    KpiAddComponent,
    KpiEditComponent,
    InfoComponent,
    KpiListLoaderComponent,
    KpiDetailsLoaderComponent,
    KpiWorkflowComponent,
    KpiWorkflowAddModalComponent,
    KpiWorkflowListComponent,
    KpiWorkflowDetailsComponent,
    WorkflowDetailLoaderComponent,
    RevertComponent,
    WorkflowModalComponent,
    WorkflowHistoryModalComponent,
    KpiActivityLogsLoaderComponent,
    KpiScoreComponent,
    KpiScoreListComponent,
    KpiScoreDetialsComponent,
    InfoScoreComponent,
    PreviewComponent,
    ScoreComponent,
    ScoreModalComponent,
    ApproveComponent,
    ScoreRevertComponent,
    ScoreReviewSubmitComponent,
    ImprovementPlansComponent,
    ImprovementPlansListComponent,
    ImprovementPlansAddComponent,
    ImprovementPlansDetailsComponent,
    ImprovementPlansDetialsLoaderComponent,
    ImprovementPlansUpdateComponent,
    ImprovementPlansUpdateLoaderComponent,
    ImprovementPlansHistoryComponent,
    ImprovementPlanHistoryLoaderComponent,
    ImprovementPlanActivityLogsComponent,
    KpiScoreActivityLogsComponent,
    KpiActitvityLogsComponent,
    ImprovementPlanComponent,
    KpiScoreDetialsLoaderComponent,
    KpiScoreWorkflowModalComponent,
    KpiScoreWorkflowHistoryModalComponent,
    DashboardComponent,
    ReportsComponent,
    KpiCountTypeComponent,
    KpiCountListComponent,
    KpiReportLoaderComponent,
    KpiDetialsComponent,
    KpiMainDashbordComponent,
    DashboardMainComponent,
    KpiDetailsDashboardComponent,
    PendingReviewsComponent,
    PendingLoaderComponent,
    KpiOverviewComponent,
    MsClauseLoopComponent,
  ],
  imports: [
    CommonModule,
    KpiManagementRoutingModule,
    NgxPaginationModule,
    SharedModule,
    FormsModule,     
    OrganizationModule,
    CarouselModule 
  ],
})
export class KpiManagementModule { }
