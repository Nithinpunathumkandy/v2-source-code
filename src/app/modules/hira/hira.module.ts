import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { HiraRoutingModule } from "./hira-routing.module";
import { SharedModule } from 'src/app/shared/shared.module';
import { HiraDashboardComponent } from './pages/hira-dashboard/hira-dashboard.component';
import { HiraRegisterComponent } from './pages/hira-register/hira-register.component';
import { HiraTreatmentComponent } from './pages/hira-treatment/hira-treatment.component';
import { HiraHeatmapComponent } from './pages/hira-heatmap/hira-heatmap.component';
import { HiraMatrixComponent } from './pages/hira-matrix/hira-matrix.component';
import { HiraWorkflowComponent } from './pages/hira-workflow/pages/hira-workflow.component';
import { HiraReportsComponent } from './pages/hira-reports/hira-reports.component';
import { ReportTypesComponent } from './pages/hira-reports/report-types/report-types.component';
import { ReportByTypesComponent } from './pages/hira-reports/report-by-types/report-by-types.component';
import { ReportDetailsComponent } from "./pages/hira-reports/report-details/report-details.component";
import { ReportLoaderComponent } from './components/report-loader/report-loader.component';
import { HiraWorkflowAddModalComponent } from './pages/hira-workflow/components/hira-workflow-add-modal/hira-workflow-add-modal.component';
import { HiraWorkflowListComponent } from './pages/hira-workflow/pages/hira-workflow-list/hira-workflow-list.component';
import { HiraWorkflowDetailsComponent } from './pages/hira-workflow/pages/hira-workflow-details/hira-workflow-details.component';
import { HeatMapComponent } from './pages/hira-heatmap/heat-map/heat-map.component';
import { HeatMapCategoryComponent } from './pages/hira-heatmap/heat-map-category/heat-map-category.component';
import { HeatMapDeptComponent } from './pages/hira-heatmap/heat-map-dept/heat-map-dept.component';
import { HeatMapDivisionComponent } from './pages/hira-heatmap/heat-map-division/heat-map-division.component';
import { HeatMapSectionComponent } from './pages/hira-heatmap/heat-map-section/heat-map-section.component';
import { HeatMapSourceComponent } from './pages/hira-heatmap/heat-map-source/heat-map-source.component';
import { HiraComponent } from './pages/hira-register/hira/hira.component';
import { AddHiraComponent } from './pages/hira-register/add-hira/add-hira.component';
import { EditHiraComponent } from './pages/hira-register/edit-hira/edit-hira.component';
import { HiraDetailsComponent } from './pages/hira-register/hira-details/hira-details.component';
import { ImpactAnalysisComponent } from './pages/hira-register/hira-details/impact-analysis/impact-analysis.component';
import { HiraKriComponent } from './pages/hira-register/hira-details/hira-kri/hira-kri.component';
import { ResidualHiraComponent } from './pages/hira-register/hira-details/residual-hira/residual-hira.component';
import { HiraAssessmentComponent } from './pages/hira-register/hira-details/hira-assessment/hira-assessment.component';
import { HiraContextComponent } from './pages/hira-register/hira-details/hira-context/hira-context.component';
import { HiraJourneyComponent } from './pages/hira-register/hira-details/hira-journey/hira-journey.component';
import { HiraMappingComponent } from './pages/hira-register/hira-details/hira-mapping/hira-mapping.component';
import { HiraRcaComponent } from './pages/hira-register/hira-details/hira-rca/hira-rca.component';
import { AddTreatmentComponent } from './pages/hira-register/hira-details/hira-treatment/add-treatment/add-treatment.component';
import { EditTreatmentComponent } from './pages/hira-register/hira-details/hira-treatment/edit-treatment/edit-treatment.component';

@NgModule({
  declarations: [
    HiraDashboardComponent,
    HiraRegisterComponent,
    HiraTreatmentComponent,
    HiraHeatmapComponent,
    HiraMatrixComponent,
    HiraWorkflowComponent,
    HiraReportsComponent,
    ReportTypesComponent,
    ReportByTypesComponent,
    ReportDetailsComponent,
    ReportLoaderComponent,
    HiraWorkflowAddModalComponent,
    HiraWorkflowListComponent,
    HiraWorkflowDetailsComponent,
    HeatMapComponent,
    HeatMapCategoryComponent,
    HeatMapDeptComponent,
    HeatMapDivisionComponent,
    HeatMapSectionComponent,
    HeatMapSourceComponent,
    HiraComponent,
    AddHiraComponent,
    EditHiraComponent,
    HiraDetailsComponent,
    ImpactAnalysisComponent,
    HiraKriComponent,
    ResidualHiraComponent,
    HiraAssessmentComponent,
    HiraContextComponent,
    HiraJourneyComponent,
    HiraMappingComponent,
    HiraRcaComponent,
    AddTreatmentComponent,
    EditTreatmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HiraRoutingModule,
    NgxPaginationModule
  ]
})
export class HiraModule { }
