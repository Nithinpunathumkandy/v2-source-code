import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiskManagementRoutingModule } from './risk-management-routing.module';
import { RisksDashboardComponent } from './pages/risks-dashboard/risks-dashboard.component';
import { RisksComponent } from './pages/risk-management/risks/risks.component';
import { AddRiskComponent } from './pages/risk-management/risks/add-risk/add-risk.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RiskDetailsComponent } from './pages/risk-management/risk-details/risk-details.component';
import { RiskContextComponent } from './pages/risk-management/risk-details/risk-context/risk-context.component';
import { RiskMappingComponent } from './pages/risk-management/risk-details/risk-mapping/risk-mapping.component';
import { RiskAssessmentComponent } from './pages/risk-management/risk-details/risk-assessment/risk-assessment.component';
import { RiskTreatmentComponent } from './pages/risk-management/risk-details/risk-treatment/risk-treatment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {OrganizationModule} from 'src/app/modules/organization/organization.module'
import { ResidualRiskComponent } from './pages/risk-management/risk-details/residual-risk/residual-risk.component';
import { RiskManagementComponent } from './pages/risk-management/risk-management.component';
import { EditRiskComponent } from './pages/risk-management/risks/edit-risk/edit-risk.component';
import { RiskConfigurationComponent } from './pages/risk-configuration/risk-configuration.component';
import { ImpactComponent } from './pages/risk-configuration/impact/impact.component';
import { RiskScoreComponent } from './pages/risk-configuration/risk-score/risk-score.component';
import { RiskMatrixComponent } from './pages/risk-matrix/risk-matrix.component';
import { LikelihoodComponent } from './pages/risk-configuration/likelihood/likelihood.component';
import { AddRiskTreatmentComponent } from './pages/risk-management/risk-details/risk-treatment/add-risk-treatment/add-risk-treatment.component';
import { EditRiskTreatmentComponent } from './pages/risk-management/risk-details/risk-treatment/edit-risk-treatment/edit-risk-treatment.component';
import { HeatMapComponent } from './pages/risk-heat-map/heat-map/heat-map.component';
import { HmByCategoryComponent } from './pages/risk-heat-map/hm-by-category/hm-by-category.component';
import { HmByDepartmentComponent } from './pages/risk-heat-map/hm-by-department/hm-by-department.component';
import { RiskHeatMapComponent } from './pages/risk-heat-map/risk-heat-map.component';
import { TreatmentDetailsComponent } from './pages/risk-treatment/treatment-details/treatment-details.component';
import { RiskTreatmentPlansComponent } from './pages/risk-treatment/risk-treatment-plan/risk-treatment-plans/risk-treatment-plans.component';
import { RiskTreatmentDetailsComponent } from './pages/risk-treatment/treatment-details/risk-treatment-details/risk-treatment-details.component';
import { RiskTreatmentPlanComponent } from './pages/risk-treatment/risk-treatment-plan/risk-treatment-plan.component';
import { RiskWorkflowListComponent } from './pages/risk-workflow/pages/risk-workflow-list/risk-workflow-list.component';
import { RiskWorkflowComponent } from './pages/risk-workflow/pages/risk-workflow.component';
import { RiskWorkflowDetailsComponent } from './pages/risk-workflow/pages/risk-workflow-details/risk-workflow-details.component';
import { RiskWorkflowAddModalComponent } from './pages/risk-workflow/components/risk-workflow-add-modal/risk-workflow-add-modal.component';
import { RiskPreviewModalComponent } from './components/preview/risk-preview-modal/risk-preview-modal.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { RiskCountTypeComponent } from './pages/reports/risk-count-type/risk-count-type/risk-count-type.component';
import { RiskCountListComponent } from './pages/reports/risk-count-list/risk-count-list.component';
import { RootCauseAnalysisComponent } from './pages/risk-management/risk-details/root-cause-analysis/root-cause-analysis.component';
import { KeyRiskIndicatorComponent } from './pages/risk-management/risk-details/key-risk-indicator/key-risk-indicator.component';
import { RiskJourneyComponent } from './pages/risk-management/risk-details/risk-journey/risk-journey.component';
import { CorporateRisksComponent } from './pages/risk-management/risks/corporate-risks/corporate-risks.component';
import { ImpactAnalysisComponent } from './pages/risk-management/risk-details/impact-analysis/impact-analysis.component';
import { RiskRcaLoaderComponent } from './components/loader/risk-rca-loader/risk-rca-loader.component';
import { RiskTreatmentLoaderComponent } from './components/loader/risk-treatment-loader/risk-treatment-loader.component';
import { RiskTreatmentPlanLoaderComponent } from './components/loader/risk-treatment-plan-loader/risk-treatment-plan-loader.component';
import { HeatmapByCategoryLoaderComponent } from './components/loader/heatmap-by-category-loader/heatmap-by-category-loader.component';
import { HmByDivisionComponent } from './pages/risk-heat-map/hm-by-division/hm-by-division.component';
import { HmBySectionComponent } from './pages/risk-heat-map/hm-by-section/hm-by-section.component';
import { HmBySourceComponent } from './pages/risk-heat-map/hm-by-source/hm-by-source.component';
import { RiskDashboardComponent } from './components/loader/risk-dashboard/risk-dashboard.component';
import { RiskReportComponent } from './pages/reports/risk-report/risk-report.component';
import { PdfReportComponent } from './pages/reports/pdf-report/pdf-report.component';
import { DetailedErmReportComponent } from './pages/reports/pdf-report/detailed-erm-report/detailed-erm-report.component';
import { ExecutiveSummeryComponent } from './pages/reports/pdf-report/executive-summary/executive-summary.component';
import { QuickRiskAssesmentReportComponent } from './pages/reports/pdf-report/quick-risk-assesment-report/quick-risk-assesment-report.component';
import { DetailedErmModalComponent } from './components/detailed-erm-modal/detailed-erm-modal.component';
import { ExecutiveSummaryModalComponent } from './components/executive-summary-modal/executive-summary-modal.component';
import { QuickRiskAssesmentReportModalComponent } from './components/quick-risk-assesment-report-modal/quick-risk-assesment-report-modal.component';
import { DetailedErmReportDetailComponent } from './pages/reports/pdf-report/detailed-erm-report/detailed-erm-report-detail/detailed-erm-report-detail.component';
import { ExecutiveSummeryDetailComponent } from './pages/reports/pdf-report/executive-summary/executive-summary-detail/executive-summary-detail.component';
import { QuickRiskAssesmentReportDetailComponent } from './pages/reports/pdf-report/quick-risk-assesment-report/quick-risk-assesment-report-detail/quick-risk-assesment-report-detail.component';
import { AddExecutiveSummaryComponent } from './components/add-executive-summary/add-executive-summary.component';
import { AddQuickAssesmentReportComponent } from './components/add-quick-assesment-report/add-quick-assesment-report.component';
import { RiskCeoDashboardComponent } from './pages/risk-ceo-dashboard/risk-ceo-dashboard.component';
import { TopRisksComponent } from './pages/risk-ceo-dashboard/top-risks/top-risks.component';
import { CeoDashboardMainComponent } from './pages/risk-ceo-dashboard/ceo-dashboard-main/ceo-dashboard-main.component';
import { RiskCeoDetailsComponent } from './pages/risk-ceo-dashboard/risk-ceo-details/risk-ceo-details.component';
import { AutomativeDivisionComponent } from './pages/risk-ceo-dashboard/automative-division/automative-division.component';
import { CommercailAndIndustrialDivisionComponent } from './pages/risk-ceo-dashboard/commercial-industrial-division/commercial-industrial-division.component';
import { CorporateAndSharedServiceDivisionComponent } from './pages/risk-ceo-dashboard/corporate-shared-service-divsion/corporate-shared-service-divsion.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ListUserLoaderComponent } from './components/loader/list-user-loader/list-user-loader.component';
import { RiskReportLoaderComponent } from './components/loader/risk-report-loader/risk-report-loader.component';
import { EditErmDetailRiskComponent } from './components/edit-erm-details-risk/edit-erm-details-risk.component';
import { EditErmDetailRiskTreatmentComponent } from './components/edit-erm-detail-risk-treatment/edit-erm-detail-risk-treatment.component';
import { ErmDetailedComponent } from './components/loader/erm_detailed/erm_detailed.component';
import { PdfReportDetailedComponent } from './components/loader/pdf_report_detailed/pdf_report_detailed.component';

import { AddObservatioModalComponent } from './components/add-observation-modal/add-observation-modal.component';
import { AddSummaryModalComponent } from './components/add-summary-modal/add-summary-modl.component';
import { RiskMitigationModalComponent } from './components/risk-mitigation-modal/risk-mitigation-modal.component';
import { CeoDashboardMainLoaderComponent } from './components/loader/ceo-dashboard-main-loader/ceo-dashboard-main-loader.component';
import { CeoDashboardAutomativeDivisionLoaderComponent } from './components/loader/ceo-dashboard-automative-division-loader/ceo-dashboard-automative-division-loader.component';
import { CeoDashboardTopRiskLoaderComponent } from './components/loader/ceo-dashboard-top-risk-loader/ceo-dashboard-top-risk-loader.component';
import { CeoDashboardRiskDetailsLoaderComponent } from './components/loader/ceo-dashboard-risk-details-loader/ceo-dashboard-risk-details-loader.component';
import { RiskManagementOverviewComponent } from './pages/risk-management-overview/risk-management-overview.component';


@NgModule({
  declarations: [
    RiskTreatmentPlansComponent,
    RisksComponent,
    RiskHeatMapComponent,
    RiskMatrixComponent,
    RisksDashboardComponent,
    AddRiskComponent,
    RiskDetailsComponent,
    RiskContextComponent,
    RiskMappingComponent,
    RiskAssessmentComponent,
    RiskTreatmentComponent,
    ResidualRiskComponent,
    RiskManagementComponent,
    EditRiskComponent,
    RiskConfigurationComponent,
    ImpactComponent,
    RiskScoreComponent,
    LikelihoodComponent,
    AddRiskTreatmentComponent,
    EditRiskTreatmentComponent,
    HeatMapComponent,
    HmByCategoryComponent,
    HmByDepartmentComponent,
    RiskTreatmentDetailsComponent,
    RiskTreatmentPlanComponent,
    TreatmentDetailsComponent,
    RiskWorkflowListComponent,
    RiskWorkflowComponent,
    RiskWorkflowDetailsComponent,
    RiskWorkflowAddModalComponent,
    RiskPreviewModalComponent,
    ReportsComponent,
    RiskCountTypeComponent,
    RiskCountListComponent,
    RootCauseAnalysisComponent,
    KeyRiskIndicatorComponent,
    RiskJourneyComponent,
    CorporateRisksComponent,
    ImpactAnalysisComponent,
    RiskRcaLoaderComponent,
    RiskTreatmentLoaderComponent,
    RiskTreatmentPlanLoaderComponent,
    HeatmapByCategoryLoaderComponent,
    HmByDivisionComponent,
    HmBySectionComponent,
    HmBySourceComponent,
    RiskDashboardComponent,
    RiskReportComponent,
    PdfReportComponent,
    DetailedErmReportComponent,
    ExecutiveSummeryComponent,
    QuickRiskAssesmentReportComponent,
    DetailedErmModalComponent,
    ExecutiveSummaryModalComponent,
    QuickRiskAssesmentReportModalComponent,
    DetailedErmReportDetailComponent,
    ExecutiveSummeryDetailComponent,
    QuickRiskAssesmentReportDetailComponent,
    AddExecutiveSummaryComponent,
    AddQuickAssesmentReportComponent,
    RiskCeoDashboardComponent,
    TopRisksComponent,
    CeoDashboardMainComponent,
    RiskCeoDetailsComponent,
    AutomativeDivisionComponent,
    CommercailAndIndustrialDivisionComponent,
    CorporateAndSharedServiceDivisionComponent,
    ListUserLoaderComponent,
    RiskReportLoaderComponent,
    EditErmDetailRiskComponent,
    EditErmDetailRiskTreatmentComponent,
    ErmDetailedComponent,
    PdfReportDetailedComponent,
    AddSummaryModalComponent,
    AddObservatioModalComponent,
    RiskMitigationModalComponent,
    CeoDashboardMainLoaderComponent,
    CeoDashboardAutomativeDivisionLoaderComponent,
    CeoDashboardTopRiskLoaderComponent,
    CeoDashboardRiskDetailsLoaderComponent,
    RiskManagementOverviewComponent,
    

  ],
  imports: [ 
    CommonModule,
    RiskManagementRoutingModule,
    SharedModule,
    NgxPaginationModule,
    OrganizationModule,
    CarouselModule
  ]
})
export class RiskManagementModule { }
