import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BcmRoutingModule } from "./bcm-routing.module";
import { BiaMatrixListComponent } from "./pages/bia-matrix/pages/bia-matrix-list/bia-matrix-list.component";
import { BiaListComponent } from "./pages/bia/pages/bia-list/bia-list.component";
import { BiaMatrixComponent } from "./pages/bia-matrix/pages/bia-matrix.component";
import { BiaComponent } from "./pages/bia/pages/bia.component";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "src/app/shared/shared.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { BiaMatrixDetailsComponent } from "./pages/bia-matrix/pages/bia-matrix-details/bia-matrix-details.component";
import { BiaMatrixConfigComponent } from "./pages/bia-matrix/pages/bia-matrix-config/bia-matrix-config.component";
import { BiaRatingComponent } from "./pages/bia-matrix/pages/bia-matrix-config/bia-rating/bia-rating.component";
import { ImpactCategoryComponent } from "./pages/bia-matrix/pages/bia-matrix-config/impact-category/impact-category.component";
import { ImpactScenarioComponent } from "./pages/bia-matrix/pages/bia-matrix-config/impact-scenario/impact-scenario.component";
import { ImpactAreaComponent } from "./pages/bia-matrix/pages/bia-matrix-config/impact-area/impact-area.component";
import { BiaScaleComponent } from "./pages/bia-matrix/pages/bia-matrix-config/bia-scale/bia-scale.component";
import { TierConfigComponent } from "./pages/bia-matrix/pages/bia-matrix-config/tier-config/tier-config.component";
import { BiaAddComponent } from "./pages/bia/pages/bia-add/bia-add.component";
import { BiaDetailComponent } from "./pages/bia/pages/bia-detail/bia-detail.component";
import { BiaEditComponent } from "./pages/bia/pages/bia-edit/bia-edit.component";
import { BcStrategyComponent } from "./pages/bc-strategy/pages/bc-strategy.component";
import { BcStrategyListComponent } from "./pages/bc-strategy/pages/bc-strategy-list/bc-strategy-list.component";
import { BcStrategyDetailsComponent } from "./pages/bc-strategy/pages/bc-strategy-details/bc-strategy-details.component";
import { AddBcStrategyComponent } from "./pages/bc-strategy/pages/add-bc-strategy/add-bc-strategy.component";
import { EditBcStrategyComponent } from "./pages/bc-strategy/pages/edit-bc-strategy/edit-bc-strategy.component";
import { BcpListComponent } from "./pages/bcp/bcp-list/bcp-list.component";
import { BcpComponent } from "./pages/bcp/bcp.component";
import { BcpDetailsComponent } from "./pages/bcp/bcp-details/bcp-details.component";
import { BcpInfoComponent } from "./pages/bcp/bcp-details/bcp-info/bcp-info.component";
import { AddBcpClauseComponent } from "./pages/bcp/components/add-bcp-clause/add-bcp-clause.component";
import { BcmTableLoaderComponent } from "./components/bcm-table-loader/bcm-table-loader.component";
import { ChildClauseComponent } from "./pages/bcp/components/child-clause/child-clause.component";
import { ChildClauseDetailsComponent } from "./pages/bcp/components/child-clause-details/child-clause-details.component";
import { BcpWorkflowListComponent } from "./pages/bcp-workflow/pages/bcp-workflow-list/bcp-workflow-list.component";
import { BcpWorkflowDetailsComponent } from "./pages/bcp-workflow/pages/bcp-workflow-details/bcp-workflow-details.component";
import { BcpWorkflowComponent } from "./pages/bcp-workflow/pages/bcp-workflow.component";
import { AddBcpWorkflowComponent } from "./pages/bcp-workflow/components/add-bcp-workflow/add-bcp-workflow.component";
import { BcpWorkflowCommentComponent } from "./components/bcp-workflow-comment/bcp-workflow-comment.component";
import { BcpWorkflowHistoryComponent } from "./components/bcp-workflow-history/bcp-workflow-history.component";
import { BcpWorkflowPopupComponent } from "./components/bcp-workflow-popup/bcp-workflow-popup.component";
import { BcpDetailsLoaderComponent } from "./components/bcp-details-loader/bcp-details-loader.component";
import { BcpWorkflowLoaderComponent } from "./pages/bcp-workflow/components/bcp-workflow-loader/bcp-workflow-loader.component";
import { BcpIndividualWorkflowLoaderComponent } from "./pages/bcp-workflow/components/bcp-individual-workflow-loader/bcp-individual-workflow-loader.component";
import { BiaFormTableLoaderComponent } from "./components/bia-form-table-loader/bia-form-table-loader.component";
import { BiaFormPreviewLoaderComponent } from "./components/bia-form-preview-loader/bia-form-preview-loader.component";
import { RiskAssessmentComponent } from "./pages/risk-assessment/pages/risk-assessment.component";
import { RiskAssessmentListComponent } from "./pages/risk-assessment/pages/risk-assessment-list/risk-assessment-list.component";
import { RiskAssessmentDetailComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/risk-assessment-detail.component";
import { RiskAssessmentAddComponent } from "./pages/risk-assessment/pages/risk-assessment-add/risk-assessment-add.component";
import { RiskAssessmentEditComponent } from "./pages/risk-assessment/pages/risk-assessment-edit/risk-assessment-edit.component";
import { BcpCalltreeComponent } from "./pages/bcp/bcp-details/bcp-calltree/bcp-calltree.component";
import { BcpCallTreeFormComponent } from "./pages/bcp/components/bcp-call-tree-form/bcp-call-tree-form.component";
import { BcmRiskContextComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-context/bcm-risk-context.component";
import { BcmRiskMappingComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-mapping/bcm-risk-mapping.component";
import { BcmRiskAssessmentComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-assessment/bcm-risk-assessment.component";
import { BcmRiskTreatmentComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-treatment/bcm-risk-treatment.component";
import { BcmResidualRiskComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/bcm-residual-risk/bcm-residual-risk.component";
import { BcmRiskJourneyComponent } from "./pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-journey/bcm-risk-journey.component";
import { BcmRiskAssessmentModalComponent } from "./pages/risk-assessment/components/bcm-risk-assessment-modal/bcm-risk-assessment-modal.component";
import { CalltreeUserComponent } from "./pages/bcp/components/calltree-user/calltree-user.component";
// import { BiaDetailsLoaderComponent } from "./components/bia-details-loader/bia-details-loader.component";
import { RiskContextDetailsLoaderComponent } from "./components/risk-context-details-loader/risk-context-details-loader.component";
import { RiskMappingLoaderComponent } from "./components/risk-mapping-loader/risk-mapping-loader.component";
import { BcpChangeRequestComponent } from "./pages/bcp/components/bcp-change-request/bcp-change-request.component";
import { RiskAssessmentLoaderComponent } from "./components/risk-assessment-loader/risk-assessment-loader.component";
import { RiskTreatmentDetailLoaderComponent } from "./components/risk-treatment-detail-loader/risk-treatment-detail-loader.component";
import { RiskPreviewModalComponent } from "./components/preview/risk-preview-modal/risk-preview-modal.component";
import { AddBcmRiskTreatmentComponent } from "./pages/risk-assessment/components/add-bcm-risk-treatment/add-bcm-risk-treatment.component";
import { BcmRiskTreatmentUpdateModalComponent } from "./pages/risk-assessment/components/bcm-risk-treatment-update-modal/bcm-risk-treatment-update-modal.component";
import { BcpChangeRequestSubcomponentComponent } from "./pages/bcp/components/bcp-change-request-subcomponent/bcp-change-request-subcomponent.component";
import { ResidualRiskLoaderComponent } from "./components/residual-risk-loader/residual-risk-loader.component";
import { TestAndExerciseComponent } from "./pages/test-exercise/pages/test-and-exercise.component";
import { TestAndExerciseListComponent } from "./pages/test-exercise/pages/test-and-exercise-list/test-and-exercise-list.component";
import { TestAndExerciseDetailsComponent } from "./pages/test-exercise/pages/test-and-exercise-details/test-and-exercise-details.component";
import { TestAndExerciseInfoComponent } from "./pages/test-exercise/pages/test-and-exercise-details/test-and-exercise-info/test-and-exercise-info.component";
import { TestAndExerciseOutcomeComponent } from "./pages/test-exercise/pages/test-and-exercise-details/test-and-exercise-outcome/test-and-exercise-outcome.component";
import { TestAndExerciseAddComponent } from "./pages/test-exercise/components/test-and-exercise-add/test-and-exercise-add.component";
import { BcmPreviewComponent } from "./components/preview/bcm-preview/bcm-preview.component";
import { TestInfoLoaderComponent } from "./components/test-info-loader/test-info-loader.component";
import { TestExerciseOutcomeAddComponent } from "./pages/test-exercise/components/test-exercise-outcome-add/test-exercise-outcome-add.component";
import { BcmStrategyWorkflowComponent } from "./components/bcm-strategy-workflow/bcm-strategy-workflow.component";
import { TestAndExercisesWorkflowPopupComponent } from "./pages/test-exercise/components/test-and-exercises-workflow-popup/test-and-exercises-workflow-popup.component";
import { TestAndExercisesWorkflowHistoryComponent } from "./pages/test-exercise/components/test-and-exercises-workflow-history/test-and-exercises-workflow-history.component";
import { TestAndExercisesWorkflowCommentComponent } from "./pages/test-exercise/components/test-and-exercises-workflow-comment/test-and-exercise-workflow-comment.component";
import { BcpChangeRequestPageComponent } from "./pages/bcp/bcp-details/app-bcp-change-request-component/app-bcp-change-request-component.component";
import { BcStrtegyDetailsLoaderComponent } from './components/bc-strtegy-details-loader/bc-strtegy-details-loader.component';
import { BcStrategyWorkflowHistoryComponent } from './components/bc-strategy-workflow-history/bc-strategy-workflow-history.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BcpVersionsComponent } from './pages/bcp/bcp-details/bcp-versions/bcp-versions.component';
import { BCMReportComponent } from "./pages/reports/bcm-report.component";
import { BCMCountTypeComponent } from "./pages/reports/bcm-count-type/bcm-count-type.component";
import { BCMCountListComponent } from "./pages/reports/bcm-count-list/bcm-count-list.component";
import { BCMReportLoaderComponent } from "./components/bcm-report-loader/bcm-report-loader.component";
import { BcpSearchComponent } from './pages/bcp/components/bcp-search/bcp-search.component';
import { BiaWorkflowPopupComponent } from "./pages/bia/components/bia-workflow-popup/bia-workflow-popup.component";
import { BiaWorkflowHistoryComponent } from "./pages/bia/components/bia-workflow-history/bia-workflow-history.component";
import { BiaWorkflowCommentComponent } from "./pages/bia/components/bia-workflow-comment/bia-workflow-comment.component";
import { BcStrategyWorkflowCommentComponent } from './components/bc-strategy-workflow-comment/bc-strategy-workflow-comment.component';
import { BcmDashboardLoaderComponent } from './components/bcm-dashboard-loader/bcm-dashboard-loader.component';
import { BcpTemplateComponent } from './pages/bcp-template/bcp-template.component';
import { BcpTemplateListComponent } from './pages/bcp-template/bcp-template-list/bcp-template-list.component';
import { BcpTemplateAddModalComponent } from './pages/bcp-template/components/bcp-template-add-modal/bcp-template-add-modal.component';
import { BiaListPopupComponent } from './pages/bia/components/bia-list-popup/bia-list-popup.component';
import { BcpTemplateDetailsComponent } from './pages/bcp-template/bcp-template-details/bcp-template-details.component';
import { TestAndExercisesActionPlanComponent } from './pages/test-exercise/components/test-and-exercises-action-plan/test-and-exercises-action-plan.component';
import { TestAndExercisesActionPlanDetailsComponent } from './pages/test-exercise/pages/test-and-exercise-details/test-and-exercises-action-plan-details/test-and-exercises-action-plan-details.component';
import { ActionPlanUpdateModalComponent } from './pages/test-exercise/components/action-plan-update-modal/action-plan-update-modal.component';
import { ActionPlanHistoryModalComponent } from './pages/test-exercise/components/action-plan-history-modal/action-plan-history-modal.component';
import { BcpRiskAssessmentComponent } from './pages/bcp/bcp-details/bcp-risk-assessment/bcp-risk-assessment.component';
import { BcpBiaDetailsComponent } from './pages/bcp/bcp-details/bcp-bia-details/bcp-bia-details.component';
import { BcmRiskAssessmentLoaderComponent } from './pages/risk-assessment/components/bcm-risk-assessment-loader/bcm-risk-assessment-loader.component';
import { BcmOverviewComponent } from './pages/bcm-overview/bcm-overview.component';

@NgModule({
  declarations: [
    BiaMatrixComponent,
    BiaMatrixListComponent,
    BiaComponent,
    BiaListComponent,
    BiaMatrixDetailsComponent,
    BiaMatrixConfigComponent,
    BiaRatingComponent,
    ImpactCategoryComponent,
    ImpactScenarioComponent,
    ImpactAreaComponent,
    BiaScaleComponent,
    TierConfigComponent,
    BiaAddComponent,
    BiaDetailComponent,
    BiaEditComponent,
    BcStrategyComponent,
    BcStrategyListComponent,
    BcStrategyDetailsComponent,
    AddBcStrategyComponent,
    EditBcStrategyComponent,
    BcpListComponent,
    BcpComponent,
    BcpDetailsComponent,
    BcpInfoComponent,
    AddBcpClauseComponent,
    BcmTableLoaderComponent,
    ChildClauseComponent,
    ChildClauseDetailsComponent,
    BcpWorkflowListComponent,
    BcpWorkflowDetailsComponent,
    BcpWorkflowComponent,
    AddBcpWorkflowComponent,
    BcpWorkflowCommentComponent,
    BcpWorkflowHistoryComponent,
    BcpWorkflowPopupComponent,
    BcpDetailsLoaderComponent,
    BcpWorkflowLoaderComponent,
    BcpIndividualWorkflowLoaderComponent,
    BiaFormTableLoaderComponent,
    BiaFormPreviewLoaderComponent,
    RiskAssessmentComponent,
    RiskAssessmentListComponent,
    RiskAssessmentDetailComponent,
    RiskAssessmentAddComponent,
    RiskAssessmentEditComponent,
    BcpCalltreeComponent,
    BcpCallTreeFormComponent,
    RiskAssessmentLoaderComponent,
    BcmRiskContextComponent,
    BcmRiskMappingComponent,
    BcmRiskAssessmentComponent,
    BcmRiskTreatmentComponent,
    BcmResidualRiskComponent,
    BcmRiskJourneyComponent,
    BcmRiskAssessmentModalComponent,
    CalltreeUserComponent,
    // BiaDetailsLoaderComponent,
    RiskContextDetailsLoaderComponent,
    RiskMappingLoaderComponent,
    BcpChangeRequestComponent,
    RiskTreatmentDetailLoaderComponent,
    RiskPreviewModalComponent,
    AddBcmRiskTreatmentComponent,
    BcmRiskTreatmentUpdateModalComponent,
    BcpChangeRequestSubcomponentComponent,
    ResidualRiskLoaderComponent,
    TestAndExerciseComponent,
    TestAndExerciseListComponent,
    TestAndExerciseDetailsComponent,
    TestAndExerciseInfoComponent,
    TestAndExerciseOutcomeComponent,
    TestAndExerciseAddComponent,
    BcmPreviewComponent,
    TestInfoLoaderComponent,
    TestExerciseOutcomeAddComponent,
    BcmStrategyWorkflowComponent,
    TestAndExercisesWorkflowPopupComponent,
    TestAndExercisesWorkflowHistoryComponent,
    TestAndExercisesWorkflowCommentComponent,
    BcpChangeRequestPageComponent,
    BcStrtegyDetailsLoaderComponent,
    BcStrategyWorkflowHistoryComponent,
    DashboardComponent,
    BcpVersionsComponent,
    BCMReportComponent,
    BCMCountTypeComponent,
    BCMCountListComponent,
    BCMReportLoaderComponent,
    BcpSearchComponent,
    BiaWorkflowPopupComponent,
    BiaWorkflowHistoryComponent,
    BiaWorkflowCommentComponent,
    BcStrategyWorkflowCommentComponent,
    BcmDashboardLoaderComponent,
    BcpTemplateComponent,
    BcpTemplateListComponent,
    BcpTemplateAddModalComponent,
    BiaListPopupComponent,
    BcpTemplateDetailsComponent,
    TestAndExercisesActionPlanComponent,
    TestAndExercisesActionPlanDetailsComponent,
    ActionPlanUpdateModalComponent,
    ActionPlanHistoryModalComponent,
    BcpRiskAssessmentComponent,
    BcpBiaDetailsComponent,
    BcmRiskAssessmentLoaderComponent,
    BcmOverviewComponent,
  ],
  imports: [
    CommonModule,
    BcmRoutingModule,
    NgxPaginationModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
})
export class BcmModule {}
