import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { StrategyRoutingModule } from './strategy-routing.module';
import { StrategyListComponent } from './pages/strategy/strategy-list/strategy-list.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AddStrategyComponent } from './pages/strategy/add-strategy/add-strategy.component';
import { StrategyDetailsComponent } from './pages/strategy/strategy-details/strategy-details.component';
import { StrategyInfoComponent } from './pages/strategy/strategy-details/strategy-info/strategy-info.component';
import { StrategyFocusAreaComponent } from './pages/strategy/strategy-details/strategy-focus-area/strategy-focus-area.component';
import { StrategyObjectivesComponent } from './pages/strategy/strategy-details/strategy-objectives/strategy-objectives.component';
import { StrategyComponent } from './pages/strategy/strategy.component';
import { AddNoteComponent } from './components/add-note/add-note.component';
import { AddFocusAreaComponent } from './components/add-focus-area/add-focus-area.component';
import { StrategyObjectiveModalComponent } from './components/strategy-objective-modal/strategy-objective-modal.component';
// import { ObjectiveModalComponent } from './components/objective-modal/objective-modal.component';
import { StrategyKpiDetailsComponent } from './components/strategy-kpi-details/strategy-kpi-details.component';
import { AddStrategyKpiComponent } from './components/add-strategy-kpi/add-strategy-kpi.component';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import { AddInitiativeComponent } from './pages/initiatives/add-initiative/add-initiative.component';
import { InitiativeListComponent } from './pages/initiatives/initiative-list/initiative-list.component';
import { InitiativeDetailsComponent } from './pages/initiatives/initiative-details/initiative-details.component';
import { InitiativeInfoComponent } from './pages/initiatives/initiative-details/initiative-info/initiative-info.component';
import { InitiativeMilestonesComponent } from './pages/initiatives/initiative-details/initiative-milestones/initiative-milestones.component';
import { NewMilestoneComponent } from './components/new-milestone/new-milestone.component';
import { EditStrategyComponent } from './pages/strategy/edit-strategy/edit-strategy.component';
import { HorizonLineLoaderComponent } from './loaders/horizon-line-loader/horizon-line-loader.component';
import { FocusAreaLoaderComponent } from './loaders/focus-area-loader/focus-area-loader.component';
import { ObjectivesLoaderComponent } from './loaders/objectives-loader/objectives-loader.component';
import { ProfileInfoLoaderComponent } from './loaders/profile-info-loader/profile-info-loader.component';
import { ObjectiveInfoLoaderComponent } from './loaders/objective-info-loader/objective-info-loader.component';
import { ProfileListLoaderComponent } from './loaders/profile-list-loader/profile-list-loader.component';
import { AddActionPlanComponent } from './components/add-action-plan/add-action-plan.component';
import { EditInitiativeComponent } from './pages/initiatives/edit-initiative/edit-initiative.component';
import { InitiativeInfoLoaderComponent } from './loaders/initiative-info-loader/initiative-info-loader.component';
import { InitiativeMilestoneLoaderComponent } from './loaders/initiative-milestone-loader/initiative-milestone-loader.component';
import { StrategyMappingComponent } from './pages/strategy-mapping/strategy-mapping.component';
import { MilestoneFomLoaderComponent } from './loaders/milestone-fom-loader/milestone-fom-loader.component';
import { StrategyMappingLoaderComponent } from './loaders/strategy-mapping-loader/strategy-mapping-loader.component';
import { StrategyReviewComponent } from './pages/review/strategy-review/strategy-review.component';
import { StrategyObjectiveReviewComponent } from './pages/review/strategy-review/strategy-objective-review/strategy-objective-review.component';
import { StrategyMappingListComponent } from './pages/strategy-mapping/strategy-mapping-list/strategy-mapping-list.component';
import { AddReviewModalComponent } from './components/add-review-modal/add-review-modal.component';
import { AddAllReviewModalComponent } from './components/add-all-review-modal/add-all-review-modal.component';
import { StrategyProfileModalComponent } from './components/strategy-profile-modal/strategy-profile-modal.component';
import { KpiMesureHistorySingleComponent } from './components/kpi-mesure-history-single/kpi-mesure-history-single.component';
import { PreviewModalComponent } from './components/preview-modal/preview-modal.component';
import { AddPlansMeasureComponent } from './components/add-plans-measure/add-plans-measure.component';
import { StrategyWorkflowEngineComponent } from './pages/strategy-workflow-engine/strategy-workflow-engine.component';
import { StrategyWorkflowListComponent } from './pages/strategy-workflow-engine/strategy-workflow-list/strategy-workflow-list.component';
import { StrategyWorkflowDetailsComponent } from './pages/strategy-workflow-engine/strategy-workflow-details/strategy-workflow-details.component';
import { AddStrategyWorkflowComponent } from './components/add-strategy-workflow/add-strategy-workflow.component';
import { StrategyIndividualWorkflowLoaderComponent } from './components/strategy-individual-workflow-loader/strategy-individual-workflow-loader.component';
import { PlanMeasureHistoryComponent } from './components/plan-measure-history/plan-measure-history.component';
import { StrategyReviewLoaderComponent } from './loaders/strategy-review-loader/strategy-review-loader.component';
import { StrategyReviewPlanLoaderComponent } from './loaders/strategy-review-plan-loader/strategy-review-plan-loader.component';
import { OtherResponsibleUsersModalComponent } from './components/other-responsible-users-modal/other-responsible-users-modal.component';
import { ObjectiveAccordionLoaderComponent } from './loaders/objective-accordion-loader/objective-accordion-loader.component';
import { StrategyProfileModalLoaderComponent } from './loaders/strategy-profile-modal-loader/strategy-profile-modal-loader.component';
import { ActionPlanMeasuresMainEditComponent } from './components/action-plan-measures-main-edit/action-plan-measures-main-edit.component';
import { ReviewPlanMeasureMainHistoryComponent } from './components/review-plan-measure-main-history/review-plan-measure-main-history.component';
import { ReviewKpiMeasureMainHistoryComponent } from './components/review-kpi-measure-main-history/review-kpi-measure-main-history.component';
import { KpiReviewMeasureAllHistoryComponent } from './components/kpi-review-measure-all-history/kpi-review-measure-all-history.component';
import { KpiDetailsLoaderComponent } from './loaders/kpi-details-loader/kpi-details-loader.component';
import { KpiListComponent } from './pages/kpi/kpi-list/kpi-list.component';
import { KpiDetailsComponent } from './pages/kpi/kpi-details/kpi-details.component';
import { KpiInfoComponent } from './pages/kpi/kpi-details/kpi-info/kpi-info.component';
import { ActionPlansListComponent } from './pages/action-plans/action-plans-list/action-plans-list.component';
import { ActionPlanDetailsComponent } from './pages/action-plans/action-plan-details/action-plan-details.component';
import { ActionPlanInfoComponent } from './pages/action-plans/action-plan-details/action-plan-info/action-plan-info.component';
import { OtherDocumentsModalComponent } from './components/other-documents-modal/other-documents-modal.component';
import { ActionPlanDetalsLoaderComponent } from './loaders/action-plan-detals-loader/action-plan-detals-loader.component';
import { KpiReviewDetailsLoaderComponent } from './loaders/kpi-review-details-loader/kpi-review-details-loader.component';
import { DashbordComponent } from './pages/dashboard/dashbord/dashbord.component';
import { OnGoiningProfilesComponent } from './pages/dashboard/on-goining-profiles/on-goining-profiles.component';
import { OnGoingProfileDetailsComponent } from './pages/dashboard/on-going-profile-details/on-going-profile-details.component';
import { InfoComponent } from './pages/dashboard/on-going-profile-details/info/info.component';
import { KpiScoreChartComponent } from './pages/dashboard/kpi-score-chart/kpi-score-chart.component';
import { InitiativeMoreModalComponent } from './components/initiative-more-modal/initiative-more-modal.component';
import { DashboardLoaderComponent } from './loaders/dashboard-loader/dashboard-loader.component';
import { KpiScoreChartLoaderComponent } from './loaders/kpi-score-chart-loader/kpi-score-chart-loader.component';
import { IncreaseShareOfMarketComponent } from './loaders/increase-share-of-market/increase-share-of-market.component';
import { StrategyReportComponent } from './pages/repotrs/strategy-report/strategy-report.component';
import { StrategyCountListComponent } from './pages/repotrs/strategy-report/strategy-count-list/strategy-count-list.component';
import { StrategyCountTypeComponent } from './pages/repotrs/strategy-report/strategy-count-type/strategy-count-type.component';
import { ObjectiveTargetBreakdownModalComponent } from './components/objective-target-breakdown-modal/objective-target-breakdown-modal.component';
import { StrategyProfileFocusAreaNoteComponent } from './components/strategy-profile-focus-area-note/strategy-profile-focus-area-note.component';
import { ScoreComponent } from './pages/score/score/score.component';
import { ObjectiveScoreComponent } from './pages/objective-score/objective-score/objective-score.component';
import { DetailsComponent } from './pages/objective-score/objective-score/details/details.component';
import { AddObjectiveScoreComponent } from './components/add-objective-score/add-objective-score.component';
import { ObjectiveReviewCommentModalComponent } from './components/objective-review-comment-modal/objective-review-comment-modal.component';
import { KpiWorkflowCommentComponent } from './components/kpi-workflow-comment/kpi-workflow-comment.component';
import { ObjectiveWorkflowHistoryComponent } from './components/objective-workflow-history/objective-workflow-history.component';
import { KpiWorkflowHistoryComponent } from './components/kpi-workflow-history/kpi-workflow-history.component';
import { ObjectiveTargetBreakdownLoaderComponent } from './loaders/objective-target-breakdown-loader/objective-target-breakdown-loader.component';
import { ActionPlanWorkflowCommentComponent } from './components/action-plan-workflow-comment/action-plan-workflow-comment.component';
import { ActionPlanWorkflowHistoryComponent } from './components/action-plan-workflow-history/action-plan-workflow-history.component';
import { StrategyScoringWorkflowComponent } from './components/strategy-scoring-workflow/strategy-scoring-workflow.component';
import { AutoFocus } from 'src/app/shared/directives/auto-focus.directive';
import { ReviewFrequencyPopupComponent } from './components/review-frequency-popup/review-frequency-popup.component';
import { StrategyObjectivePlanComponent } from './pages/review/strategy-review/strategy-objective-plan/strategy-objective-plan.component';
import { ObjectiveFrequenyListComponent } from './pages/objective-score/objective-score/objective-frequeny-list/objective-frequeny-list.component';
import { KpiFrequencyListComponent } from './pages/kpi/kpi-details/kpi-frequency-list/kpi-frequency-list.component';
import { StrategyActivityHistoryPopupComponent } from './components/strategy-activity-history-popup/strategy-activity-history-popup.component';
import { InitiativeActivityHistoryPopupComponent } from './components/initiative-activity-history-popup/initiative-activity-history-popup.component';
import { StrategyMappingPopupComponent } from './components/strategy-mapping-popup/strategy-mapping-popup.component';
import { StrategyReportBookComponent } from './pages/strategy-report-book/strategy-report-book.component';
import { StrategyOverviewComponent } from './pages/strategy-overview/strategy-overview.component';
import { StrategyInitiativesComponent } from './pages/strategy/strategy-details/strategy-initiatives/strategy-initiatives.component';
import { StrategyDashboardComponent } from './pages/dashboard/strategy-dashboard/strategy-dashboard.component';
import { StrategyDashbaordLoaderComponent } from './loaders/strategy-dashbaord-loader/strategy-dashbaord-loader.component';
import { StrategyMilestoneComponent } from './pages/strategy/strategy-details/strategy-milestone/strategy-milestone.component';
import { StrategyMappingInitiativeDetailPopupComponent } from './components/strategy-mapping-initiative-detail-popup/strategy-mapping-initiative-detail-popup.component';
import { StrategyMappingObjectiveDetailPopupComponent } from './components/strategy-mapping-objective-detail-popup/strategy-mapping-objective-detail-popup.component';
import { StrategyMappingOcLoaderComponent } from './loaders/strategy-mapping-oc-loader/strategy-mapping-oc-loader.component';
import { StrategyMappingOcDepartmentLoaderComponent } from './loaders/strategy-mapping-oc-department-loader/strategy-mapping-oc-department-loader.component';
import { StrategyMappingObjectiveTypePopupComponent } from './components/strategy-mapping-objective-type-popup/strategy-mapping-objective-type-popup.component';
import { StrategyRoleDetailsComponent } from './pages/strategy-role-details/strategy-role-details.component';
import { StrategyDepartmentDetailsComponent } from './pages/strategy-department-details/strategy-department-details.component';
import { StrategyGridViewLoaderComponent } from './loaders/strategy-grid-view-loader/strategy-grid-view-loader.component';
import { StrategyMappingDetailsComponent } from './pages/strategy-mapping-details/strategy-mapping-details.component';
import { MappingFocusAreaInfoComponent } from './pages/strategy-mapping-details/mapping-focus-area-info/mapping-focus-area-info.component';
import { MappingObjectiveInfoComponent } from './pages/strategy-mapping-details/mapping-objective-info/mapping-objective-info.component';
import { StrategyMappingFocusAreaInfoComponent } from './components/strategy-mapping-focus-area-info/strategy-mapping-focus-area-info.component';
import { StrategyMappingProfileLoaderComponent } from './loaders/strategy-mapping-profile-loader/strategy-mapping-profile-loader.component';
import { StrategyMappingObjectiveLoaderComponent } from './loaders/strategy-mapping-objective-loader/strategy-mapping-objective-loader.component';
import { StrategyMappingObjectiveInfoComponent } from './components/strategy-mapping-objective-info/strategy-mapping-objective-info.component';
import { StrategyMappingProfileInfoComponent } from './components/strategy-mapping-profile-info/strategy-mapping-profile-info.component';
import { StrategyMappingStandardViewLoaderComponent } from './loaders/strategy-mapping-standard-view-loader/strategy-mapping-standard-view-loader.component';
import { MappingFocusAreaInfoLoaderComponent } from './loaders/mapping-focus-area-info-loader/mapping-focus-area-info-loader.component';
import { MappingObjectiveInfoLoaderComponent } from './loaders/mapping-objective-info-loader/mapping-objective-info-loader.component';
import { RiskListComponent } from './pages/dashboard/risk-list/risk-list.component';
import { StrategyDashboardInitiativeLoaderComponent } from './loaders/strategy-dashboard-initiative-loader/strategy-dashboard-initiative-loader.component';
import { StrategyScoringMatrixComponent } from './pages/strategy-scoring-matrix/strategy-scoring-matrix.component';
// import { StrategyManagementSettingsComponent } from './components/strategy-management-setting/strategy-management-settings.component';
// import { AuditFindingMappingComplianceComponent } from '../compliance-management/component/audit-finding-mapping-compliance/audit-finding-mapping-compliance.component';


@NgModule({
  declarations: [
    StrategyListComponent,
    AddStrategyComponent, 
    StrategyDetailsComponent,  
    StrategyInfoComponent, 
    StrategyFocusAreaComponent, 
    StrategyObjectivesComponent,  
    StrategyComponent, 
    AddNoteComponent, 
    AddFocusAreaComponent,  
    StrategyObjectiveModalComponent, 
    // ObjectiveModalComponent, 
    StrategyKpiDetailsComponent, 
    AddStrategyKpiComponent, 
    InitiativesComponent, 
    AddInitiativeComponent, 
    InitiativeListComponent, 
    InitiativeDetailsComponent, 
    InitiativeInfoComponent, 
    InitiativeMilestonesComponent, 
    NewMilestoneComponent, 
    EditStrategyComponent, 
    HorizonLineLoaderComponent, 
    FocusAreaLoaderComponent, 
    ObjectivesLoaderComponent, 
    ProfileInfoLoaderComponent, 
    ObjectiveInfoLoaderComponent, 
    ProfileListLoaderComponent, 
    AddActionPlanComponent, 
    EditInitiativeComponent, 
    InitiativeInfoLoaderComponent, 
    InitiativeMilestoneLoaderComponent,
    StrategyMappingComponent,
    MilestoneFomLoaderComponent,
    StrategyMappingLoaderComponent,
    StrategyReviewComponent,
    StrategyObjectiveReviewComponent,
    StrategyObjectivePlanComponent,
    StrategyMappingListComponent,
    AddReviewModalComponent,
    AddAllReviewModalComponent,
    StrategyProfileModalComponent, 
    KpiMesureHistorySingleComponent, 
    PreviewModalComponent, 
    AddPlansMeasureComponent, 
    StrategyWorkflowEngineComponent, 
    StrategyWorkflowListComponent, 
    StrategyWorkflowDetailsComponent, 
    AddStrategyWorkflowComponent,    
    StrategyIndividualWorkflowLoaderComponent , 
    PlanMeasureHistoryComponent,
    StrategyReviewLoaderComponent, 
    StrategyReviewPlanLoaderComponent, 
    OtherResponsibleUsersModalComponent, 
    ObjectiveAccordionLoaderComponent, 
    StrategyProfileModalLoaderComponent,
    ActionPlanMeasuresMainEditComponent,
    ReviewPlanMeasureMainHistoryComponent,
    ReviewKpiMeasureMainHistoryComponent,
    KpiReviewMeasureAllHistoryComponent,
    KpiDetailsLoaderComponent,
    KpiListComponent,
    KpiDetailsComponent,
    KpiInfoComponent,
    ActionPlansListComponent,
    ActionPlanDetailsComponent,
    ActionPlanInfoComponent,
    OtherDocumentsModalComponent,
    ActionPlanDetalsLoaderComponent,
    KpiReviewDetailsLoaderComponent,
    DashbordComponent,
    OnGoiningProfilesComponent,
    OnGoingProfileDetailsComponent,
    InfoComponent,
    KpiScoreChartComponent,
    InitiativeMoreModalComponent,
    DashboardLoaderComponent,
    KpiScoreChartLoaderComponent,
    IncreaseShareOfMarketComponent,
    StrategyReportComponent,
    StrategyCountListComponent,
    StrategyCountTypeComponent,
    ObjectiveTargetBreakdownModalComponent,
    StrategyProfileFocusAreaNoteComponent,
    ScoreComponent,
    ObjectiveScoreComponent,
    DetailsComponent,
    AddObjectiveScoreComponent,
    ObjectiveReviewCommentModalComponent,
    KpiWorkflowCommentComponent,
    ObjectiveWorkflowHistoryComponent,
    KpiWorkflowHistoryComponent,
    ObjectiveTargetBreakdownLoaderComponent,
    ActionPlanWorkflowCommentComponent,
    ActionPlanWorkflowHistoryComponent,
    StrategyScoringWorkflowComponent,
    ReviewFrequencyPopupComponent,
    ObjectiveFrequenyListComponent,
    KpiFrequencyListComponent,
    StrategyActivityHistoryPopupComponent,
    InitiativeActivityHistoryPopupComponent,
    StrategyMappingPopupComponent,
    StrategyReportBookComponent,
    StrategyOverviewComponent,
    StrategyInitiativesComponent,
    StrategyDashboardComponent,
    StrategyDashbaordLoaderComponent,
    StrategyMilestoneComponent,
    StrategyMappingInitiativeDetailPopupComponent,
    StrategyMappingObjectiveDetailPopupComponent,
    StrategyMappingOcLoaderComponent,
    StrategyMappingOcDepartmentLoaderComponent,
    StrategyMappingObjectiveTypePopupComponent,
    StrategyRoleDetailsComponent,
    StrategyDepartmentDetailsComponent,
    StrategyGridViewLoaderComponent,
    StrategyMappingDetailsComponent,
    MappingFocusAreaInfoComponent,
    MappingObjectiveInfoComponent,
    StrategyMappingFocusAreaInfoComponent,
    StrategyMappingProfileLoaderComponent,
    StrategyMappingObjectiveLoaderComponent,
    StrategyMappingObjectiveInfoComponent,
    StrategyMappingProfileInfoComponent,
    StrategyMappingStandardViewLoaderComponent,
    MappingFocusAreaInfoLoaderComponent,
    MappingObjectiveInfoLoaderComponent,
    RiskListComponent,
    StrategyDashboardInitiativeLoaderComponent,
    StrategyScoringMatrixComponent,
    // StrategyManagementSettingsComponent,
    // AuditFindingMappingComplianceComponent
    // AutoFocus
  ],
      
  imports: [
    CommonModule,
    StrategyRoutingModule,
    NgxPaginationModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CarouselModule,
    // AutoFocus
  ],
  providers: [
    DatePipe,
  ]
})
export class StrategyModule { }
