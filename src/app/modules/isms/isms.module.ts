import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsmsRoutingModule } from './isms-routing.module';
import { IsmsRiskRegisterComponent } from './pages/isms-risk-register/isms-risk-register.component';
import { IsmsRiskListComponent } from './pages/isms-risk-register/isms-risk-list/isms-risk-list.component';
import { IsmsCorporateRiskListComponent } from './pages/isms-risk-register/isms-risk-list/isms-corporate-risk-list/isms-corporate-risk-list.component';
import { IsmsAddRiskComponent } from './pages/isms-risk-register/isms-risk-list/isms-add-risk/isms-add-risk.component';
import { IsmsEditRiskComponent } from './pages/isms-risk-register/isms-risk-list/isms-edit-risk/isms-edit-risk.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { IsmsRiskDetailsComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-details.component';
import { IsmsRiskContextComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-context/isms-risk-context.component';
import { IsmsRiskMatrixComponent } from './pages/isms-risk-matrix/isms-risk-matrix.component';
import { IsmsRiskConfigurationComponent } from './pages/isms-risk-configuration/isms-risk-configuration.component';
import { IsmsLikelihoodComponent } from './pages/isms-risk-configuration/isms-likelihood/isms-likelihood.component';
import { IsmsImpactComponent } from './pages/isms-risk-configuration/isms-impact/isms-impact.component';
import { IsmsRiskScoreComponent } from './pages/isms-risk-configuration/isms-risk-score/isms-risk-score.component';
import { IsmsAssetCriticalityComponent } from './pages/isms-risk-configuration/isms-asset-criticality/isms-asset-criticality.component';
import { IsmsRiskMappingComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-mapping/isms-risk-mapping.component';
import { IsmsRiskAssessmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-assessment/isms-risk-assessment.component';
import { IsmsRiskTreatmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-treatment/isms-risk-treatment.component';
import { AddIsmsRiskTreatmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-treatment/add-isms-risk-treatment/add-isms-risk-treatment.component';
import { EditIsmsRiskTreatmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-treatment/edit-isms-risk-treatment/edit-isms-risk-treatment.component';
import { IsmsRiskPreviewModalComponent } from './components/isms-risk-preview-modal/isms-risk-preview-modal.component';
import { IsmsRiskTreatmentsComponent } from './pages/treatments/isms-risk-treatments/isms-risk-treatments.component';
import { IsmsRiskTreatmentPlansComponent } from './pages/treatments/isms-risk-treatments/isms-risk-treatment-plans/isms-risk-treatment-plans.component';
import { IsmsTreatmentDetailsComponent } from './pages/treatments/isms-treatment-details/isms-treatment-details.component';
import { IsmsRiskTreatmentDetailsComponent } from './pages/treatments/isms-treatment-details/isms-risk-treatment-details/isms-risk-treatment-details.component';
import { IsmsResidualRiskComponent } from './pages/isms-risk-register/isms-risk-details/isms-residual-risk/isms-residual-risk.component';
import { IsmsRiskJourneyComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-journey/isms-risk-journey.component';
import { IsmsImpactAnalysisComponent } from './pages/isms-risk-register/isms-risk-details/isms-impact-analysis/isms-impact-analysis.component';
import { IsmsKeyRiskIndicatorComponent } from './pages/isms-risk-register/isms-risk-details/isms-key-risk-indicator/isms-key-risk-indicator.component';
import { IsmsRootCauseAnalysisComponent } from './pages/isms-risk-register/isms-risk-details/isms-root-cause-analysis/isms-root-cause-analysis.component';
import { IsmsRiskHeatMapComponent } from './pages/isms-risk-heat-map/isms-risk-heat-map.component';
import { IsmsHeatMapComponent } from './pages/isms-risk-heat-map/isms-heat-map/isms-heat-map.component';
import { IsmsHmByCategoryComponent } from './pages/isms-risk-heat-map/isms-hm-by-category/isms-hm-by-category.component';
import { IsmsHmByDepartmentComponent } from './pages/isms-risk-heat-map/isms-hm-by-department/isms-hm-by-department.component';
import { IsmsHmByDivisionComponent } from './pages/isms-risk-heat-map/isms-hm-by-division/isms-hm-by-division.component';
import { IsmsHmBySectionComponent } from './pages/isms-risk-heat-map/isms-hm-by-section/isms-hm-by-section.component';
import { IsmsHmBySourceComponent } from './pages/isms-risk-heat-map/isms-hm-by-source/isms-hm-by-source.component';
import { IsmsRiskWorkflowComponent } from './pages/isms-risk-workflow/isms-risk-workflow.component';
import { IsmsRiskWorkflowDetailsComponent } from './pages/isms-risk-workflow/isms-risk-workflow-details/isms-risk-workflow-details.component';
import { IsmsRiskWorkflowAddModalComponent } from './components/isms-risk-workflow-add-modal/isms-risk-workflow-add-modal.component';
import { IsmsRiskWorkflowListComponent } from './pages/isms-risk-workflow/isms-risk-workflow-list/isms-risk-workflow-list.component';
import { SoaComponent } from './pages/soa/soa.component';
import { SoaListComponent } from './pages/soa/soa-list/soa-list.component';
import { SoaDetailsComponent } from './pages/soa/soa-details/soa-details.component';
import { IsmsReportComponent } from './pages/report/isms-report/isms-report.component';
import { IsmsCountTypeComponent } from './pages/report/isms-count-type/isms-count-type.component';
import { IsmsCountListComponent } from './pages/report/isms-count-list/isms-count-list.component';
import { IsmsReportLoaderComponent } from './components/loader/isms-report-loader/isms-report-loader.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TopTenComponent } from './pages/dashboard/top-ten/top-ten.component';
import { RiskDetailsComponent } from './pages/dashboard/risk-details/risk-details.component';
import { IsmsOverviewComponent } from './pages/isms-overview/isms-overview.component';


@NgModule({
  declarations: [
    IsmsRiskRegisterComponent,
    IsmsRiskListComponent,
    IsmsCorporateRiskListComponent,
    IsmsAddRiskComponent,
    IsmsEditRiskComponent,
    IsmsRiskDetailsComponent,
    IsmsRiskContextComponent,
    IsmsRiskMatrixComponent,
    IsmsRiskConfigurationComponent,
    IsmsLikelihoodComponent,
    IsmsImpactComponent,
    IsmsRiskScoreComponent,
    IsmsAssetCriticalityComponent,
    IsmsRiskMappingComponent,
    IsmsRiskAssessmentComponent,
    IsmsRiskTreatmentComponent,
    AddIsmsRiskTreatmentComponent,
    EditIsmsRiskTreatmentComponent,
    IsmsRiskPreviewModalComponent,
    IsmsRiskTreatmentsComponent,
    IsmsRiskTreatmentPlansComponent,
    IsmsTreatmentDetailsComponent,
    IsmsRiskTreatmentDetailsComponent,
    IsmsResidualRiskComponent,
    IsmsRiskJourneyComponent,
    IsmsImpactAnalysisComponent,
    IsmsKeyRiskIndicatorComponent,
    IsmsRootCauseAnalysisComponent,
    IsmsRiskHeatMapComponent,
    IsmsHeatMapComponent,
    IsmsHmByCategoryComponent,
    IsmsHmByDepartmentComponent,
    IsmsHmByDivisionComponent,
    IsmsHmBySectionComponent,
    IsmsHmBySourceComponent,
    IsmsRiskWorkflowComponent,
    IsmsRiskWorkflowListComponent,
    IsmsRiskWorkflowDetailsComponent,
    IsmsRiskWorkflowAddModalComponent,
    SoaComponent,
    SoaListComponent,
    SoaDetailsComponent,
    IsmsReportComponent,
    IsmsCountTypeComponent,
    IsmsCountListComponent,
    IsmsReportLoaderComponent,
    DashboardComponent,
    TopTenComponent,
    RiskDetailsComponent,
    IsmsOverviewComponent,
  ],
  imports: [
    CommonModule,
    IsmsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    
  ]
})
export class IsmsModule { }
