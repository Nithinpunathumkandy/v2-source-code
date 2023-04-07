import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BpmRoutingModule } from './bpm-routing.module';
import { BpmDashboardComponent } from './pages/dashboard/bpm-dashboard.component';
import { BpmProcessesComponent } from './pages/processes/bpm-processes.component';
import { BpmRiskAnalysisComponent } from './pages/risk-analysis/bpm-risk-analysis.component';
import { BpmArciComponent } from './pages/arci/bpm-arci.component';
import { BpmControlsComponent } from './pages/controls/bpm-controls.component';
// import { AddControlComponent } from '../../shared/components/bpm/add-control/add-control.component';
import { ControlsListComponent } from './pages/controls/pages/controls/controls-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlDetailsComponent } from './pages/controls/pages/control-details/control-details.component';
import { ProcessListComponent } from './pages/processes/pages/process/process-list.component';
import { AddProcessComponent } from './pages/processes/pages/process/add-process/add-process.component';
import { ProcessDetailsComponent } from './pages/processes/pages/process-details/process-details.component';
import { NeedExpectaionComponent } from './pages/processes/pages/process-details/need-expectaion/need-expectaion.component';
import { RiskAssessmentComponent } from './pages/processes/pages/process-details/risk-assessment/risk-assessment.component';
import { InfoComponent } from './pages/processes/pages/process-details/info/info.component';
import { PreviewComponent } from './component/shared/preview.component';
import { ArciComponent } from './pages/arci/pages/arci/arci.component';
// import { ControlPopupComponent } from '../../shared/components/bpm/control-select-popup/control-popup.component';
import { EditProcessComponent } from './pages/processes/pages/process/edit-process/edit-process.component';
import { ContrlDetailsModalComponent } from './pages/processes/components/contrl-details-modal/contrl-details-modal.component';
import { ProcessReportComponent } from './pages/process-report/process-report.component';
import { ProcessCountTypeComponent } from './pages/process-report/process-count-type/process-count-type.component';
import { ProcessCountListComponent } from './pages/process-report/process-count-list/process-count-list.component';
import { ProcessInfoLoaderComponent } from './component/loaders/process/process-info-loader/process-info-loader.component';
import { ProcessNeedExpectationLoaderComponent } from './component/loaders/process/process-need-expectation-loader/process-need-expectation-loader.component';
import { ProcessRiskAssessmentLoaderComponent } from './component/loaders/process/process-risk-assessment-loader/process-risk-assessment-loader.component';
import { ControlDetailsLoaderComponent } from './component/loaders/control/control-details-loader/control-details-loader.component';
import { ProcessReportLoaderComponent } from './component/loaders/process-report-loader/process-report-loader.component';
import { AprComponent } from './pages/processes/pages/process-details/apr/apr.component';
import { AddAprComponent } from './pages/processes/pages/add-apr/add-apr.component';
import { EditAprComponent } from './pages/processes/pages/edit-apr/edit-apr.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BiaProcessesComponent } from './pages/processes/pages/process-details/bia-processes/bia-processes.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AprLoaderComponent } from './component/loaders/process/apr-loader/apr-loader.component';
import { BpmAssetModalComponent } from './pages/processes/components/bpm-asset-modal/bpm-asset-modal.component';
import { ControlArciAddComponent } from './pages/controls/component/control-arci-add/control-arci-add.component';
import { BpmDashboardLoaderComponent } from './component/loaders/bpm-dashboard-loader/bpm-dashboard-loader.component';
import { BpmProcessMappingComponent } from './pages/processes/pages/process-details/bpm-process-mapping/bpm-process-mapping.component';
import { BpmOverviewComponent } from './pages/bpm-overview/bpm-overview.component';
import { ProcessActivityDetailsModalComponent } from './pages/processes/components/process-activity-details-modal/process-activity-details-modal.component';
import { BpmQlikDashboardComponent } from './pages/bpm-qlik-dashboard/bpm-qlik-dashboard.component';
@NgModule({
  declarations: [BpmDashboardComponent, BpmProcessesComponent, BpmRiskAnalysisComponent, BpmArciComponent, BpmControlsComponent, ControlsListComponent, ControlDetailsComponent, ProcessListComponent, AddProcessComponent, ProcessDetailsComponent, NeedExpectaionComponent, RiskAssessmentComponent, InfoComponent, PreviewComponent, ArciComponent, EditProcessComponent, ContrlDetailsModalComponent, ProcessReportComponent, ProcessCountTypeComponent, ProcessCountListComponent, ProcessInfoLoaderComponent, ProcessNeedExpectationLoaderComponent, ProcessRiskAssessmentLoaderComponent, ControlDetailsLoaderComponent, ProcessReportLoaderComponent, AprComponent, AddAprComponent, EditAprComponent, BiaProcessesComponent, AprLoaderComponent, BpmAssetModalComponent,ControlArciAddComponent,BpmDashboardLoaderComponent, BpmProcessMappingComponent, BpmOverviewComponent, ProcessActivityDetailsModalComponent, BpmQlikDashboardComponent],
  imports: [
    CommonModule,
    BpmRoutingModule,
    NgxPaginationModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CarouselModule
  ],
})
export class BpmModule { }
