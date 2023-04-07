import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonConformityFindingsComponent } from './pages/non-conformity-findings/non-conformity-findings.component';
import { FindingsListComponent } from './pages/non-conformity-findings/findings-list/findings-list.component';
import { FindingsDetailsComponent } from './pages/non-conformity-findings/findings-details/findings-details.component';
import { FindingsAddComponent } from './components/findings-add/findings-add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NonConformityRoutingModule } from './non-conformity-routing.module';
import { FindingsDetailsInfoComponent } from './pages/non-conformity-findings/findings-details/findings-details-info/findings-details-info.component';
import { FindingsDetailsCorrectiveActionComponent } from './pages/non-conformity-findings/findings-details/findings-details-corrective-action/findings-details-corrective-action.component';
import { PreviewComponent } from './components/preview-info/preview.component';
import { LoaderListComponent } from './components/loader/loader-list/loader-list.component';
import { NonConfirmityPreviewComponent } from './components/non-confirmity-preview/non-confirmity-preview.component';
import { AddFindingCorrectiveActionComponent } from './components/modals/add-finding-corrective-action/add-finding-corrective-action.component';
import { FindingCorrectiveActionLoaderComponent } from './components/loader/finding-corrective-action-loader/finding-corrective-action-loader.component';
import { NonConfirmityCorrectiveActionComponent } from './pages/non-confirmity-corrective-action/non-confirmity-corrective-action.component';
import { NonConfirmityCorrectiveActionListComponent } from './pages/non-confirmity-corrective-action/non-confirmity-corrective-action-list/non-confirmity-corrective-action-list.component';
import { FindingsInfoLoaderComponent } from './components/loader/findings-info-loader/findings-info-loader.component';
import { NonConformityDashboardComponent } from './pages/non-conformity-dashboard/non-conformity-dashboard.component';
import { QuickCorrectionAddComponent } from './components/quick-correction-add/quick-correction-add.component';
import { NonconfirmityCorrectiveActionInfoComponent } from './pages/non-confirmity-corrective-action/nonconfirmity-corrective-action-info/nonconfirmity-corrective-action-info.component';
import { CorrectiveActionInfoLoaderComponent } from './components/loader/corrective-action-info-loader/corrective-action-info-loader.component';
import { DashboardLoaderComponent } from './components/loader/dashboard-loader/dashboard-loader.component';
import { CorrectiveActionUpdateModalComponent } from './components/modals/corrective-action-update-modal/corrective-action-update-modal.component';
import { CorrectiveActionHistoryModalComponent } from './components/modals/corrective-action-history-modal/corrective-action-history-modal.component';
import { NonComformityReportComponent } from './pages/non-confirmity-reports/non-confirmity-report.component';
import { NonComformityCountTypeComponent } from './pages/non-confirmity-reports/non-conformity-count-type/non-conformity-count-type.component';
import { NonComformityCountListComponent } from './pages/non-confirmity-reports/non-conformity-count-list/non-conformity-count-list.component';
import { NonConformityReportLoaderComponent } from './components/non-conformity-report-loader/non-conformity-report-loader.component';
import { NonConformityOverviewComponent } from './pages/non-conformity-overview/non-conformity-overview.component';



@NgModule({
  declarations: [
    NonConformityFindingsComponent,
    FindingsListComponent,
    FindingsDetailsComponent,
    FindingsAddComponent,
    FindingsDetailsInfoComponent,
    FindingsDetailsCorrectiveActionComponent,
    PreviewComponent,
    LoaderListComponent,
    NonConfirmityPreviewComponent,
    AddFindingCorrectiveActionComponent,
    FindingCorrectiveActionLoaderComponent,
    FindingsInfoLoaderComponent,
    QuickCorrectionAddComponent,
    NonConfirmityCorrectiveActionComponent,
    NonConfirmityCorrectiveActionListComponent,
    FindingsInfoLoaderComponent,
    NonConformityDashboardComponent,
    NonconfirmityCorrectiveActionInfoComponent,
    CorrectiveActionInfoLoaderComponent,
    DashboardLoaderComponent,
    CorrectiveActionUpdateModalComponent,
    CorrectiveActionHistoryModalComponent,
    NonComformityReportComponent,
    NonComformityCountTypeComponent,
    NonComformityCountListComponent,
    NonConformityReportLoaderComponent,
    NonConformityOverviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    NonConformityRoutingModule,

  ]
})
export class NonConformityModule { }
