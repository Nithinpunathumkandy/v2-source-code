import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxPaginationModule } from "ngx-pagination";
import { ExternalAuditRoutingModule } from "./external-audit-routing.module";
import { ExternalAuditListComponent } from "./pages/external-audit/external-audit-list/external-audit-list.component";
import { ExternalAuditDashboardComponent } from "./pages/external-audit-dashboard/external-audit-dashboard.component";
import { ExternalAuditComponent } from "./pages/external-audit/external-audit.component";
import { ExternalAuditLoaderComponent } from "./components/loader/external-audit-loader/external-audit-loader.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ExternalAuditDetailsComponent } from "./pages/external-audit/external-audit-details/external-audit-details.component";
import { ExternalAuditInfoComponent } from "./pages/external-audit/external-audit-details/external-audit-info/external-audit-info.component";
import { FindingsComponent } from "./pages/external-audit/external-audit-details/findings/findings.component";
import { PreviewComponent } from "./components/modals/preview/preview.component";
import { AddExternalAuditComponent } from "./pages/external-audit/add-external-audit/add-external-audit.component";
import { EditExternalAuditComponent } from "./pages/external-audit/edit-external-audit/edit-external-audit.component";
import { AuditFindingsComponent } from "./pages/audit-findings/audit-findings.component";
import { AuditFindingListComponent } from "./pages/audit-findings/audit-finding-list/audit-finding-list.component";
import { AuditFindingsDetailsComponent } from "./pages/audit-findings/audit-findings-details/audit-findings-details.component";
import { AddFindingsComponent } from "./pages/audit-findings/add-findings/add-findings.component";
import { EditFindingsComponent } from "./pages/audit-findings/edit-findings/edit-findings.component";
import { AuditFindingInfoComponent } from "./pages/audit-findings/audit-findings-details/audit-finding-info/audit-finding-info.component";

import { RootCauseAnalysisComponent } from "./pages/audit-findings/audit-findings-details/root-cause-analysis/root-cause-analysis.component";
import { AddRootCauseAnalysisModalComponent } from "./components/modals/add-root-cause-analysis-modal/add-root-cause-analysis-modal.component";
import { ImpactAnalysisComponent } from "./pages/audit-findings/audit-findings-details/impact-analysis/impact-analysis.component";
import { CorrectiveActionComponent } from "./pages/audit-findings/audit-findings-details/corrective-action/corrective-action.component";
import { ImpactAnalysisDetailsComponent } from "./pages/audit-findings/audit-findings-details/impact-analysis/impact-analysis-details/impact-analysis-details.component";
import { AddCorrectiveActionModalComponent } from "./components/modals/add-corrective-action-modal/add-corrective-action-modal.component";
import { CorrectiveActionsComponent } from "./pages/corrective-actions/corrective-actions.component";
import { CorrectiveActionsListComponent } from "./pages/corrective-actions/corrective-actions-list/corrective-actions-list.component";
import { CorrectiveActionDetailsComponent } from "./pages/corrective-actions/corrective-action-details/corrective-action-details.component";
import { CorrectiveActionAddModalComponent } from "./components/modals/corrective-action-add-modal/corrective-action-add-modal.component";
import { EaFindingAddComponent } from "./pages/external-audit/ea-finding-add/ea-finding-add.component";
import { EaFindingEditComponent } from "./pages/external-audit/ea-finding-edit/ea-finding-edit.component";
import { EaCorrectiveActionsResolveModalComponent } from "./components/modals/ea-corrective-actions-resolve-modal/ea-corrective-actions-resolve-modal.component";
import { ExternalReportComponent } from "./pages/external-report/external-report.component";
import { ExternalCountTypeComponent } from "./pages/external-report/external-count-type/external-count-type.component";
import { ExternalCountListComponent } from "./pages/external-report/external-count-list/external-count-list.component";
import { ExternalAuditReportLoaderComponent } from "./components/loader/external-audit-report-loader/external-audit-report-loader.component";
import { ExternalAuditInfoLoaderComponent } from "./components/loader/external-audit-info-loader/external-audit-info-loader.component";
import { ExternalAuditRCALoaderComponent } from "./components/loader/external-audit-rca-loader/external-audit-rca-loader.component";
import { ExternalAuditFindingInfoLoaderComponent } from "./components/loader/external-audit-finding-info-loader/external-audit-finding-info-loader.component";
import { CorrectiveActionUpdateModalComponent } from './components/modals/corrective-action-update-modal/corrective-action-update-modal.component';
import { CorrectiveActionHistoryModalComponent } from './components/modals/corrective-action-history-modal/corrective-action-history-modal.component';
import { FindingDetailsDashboardComponent } from './pages/external-audit/finding-details-dashboard/finding-details-dashboard.component';
import { OwlDateTimeModule } from "ng-pick-datetime";
import { CarouselModule } from "ngx-owl-carousel-o";
import { DashboardExternalAuditComponent } from './pages/dashboard-external-audit/dashboard-external-audit.component';
import { EaDashboardFindingDetailsComponent } from './pages/external-audit/ea-dashboard-finding-details/ea-dashboard-finding-details.component';
import { EaDashboardPendingCaComponent } from './pages/external-audit/ea-dashboard-pending-ca/ea-dashboard-pending-ca.component';
import { EaDashboardLoaderComponent } from './components/loader/ea-dashboard-loader/ea-dashboard-loader.component';
import { ExternalAuditOverviewComponent } from './pages/external-audit-overview/external-audit-overview.component';

@NgModule({
  declarations: [
    ExternalAuditListComponent,
    ExternalAuditDashboardComponent,
    ExternalAuditComponent,
    ExternalAuditLoaderComponent,
    ExternalAuditDetailsComponent,
    ExternalAuditInfoComponent,
    FindingsComponent,
    PreviewComponent,
    AddExternalAuditComponent,
    EditExternalAuditComponent,
    AuditFindingsComponent,
    AuditFindingListComponent,
    AuditFindingsDetailsComponent,
    AddFindingsComponent,
    EditFindingsComponent,
    AuditFindingInfoComponent,
    RootCauseAnalysisComponent,
    AddRootCauseAnalysisModalComponent,
    ImpactAnalysisComponent,
    CorrectiveActionComponent,
    ImpactAnalysisDetailsComponent,
    AddCorrectiveActionModalComponent,
    CorrectiveActionsComponent,
    CorrectiveActionsListComponent,
    CorrectiveActionDetailsComponent,
    CorrectiveActionAddModalComponent,
    EaFindingAddComponent,
    EaFindingEditComponent,
    EaCorrectiveActionsResolveModalComponent,
    ExternalReportComponent,
    ExternalCountTypeComponent,
    ExternalCountListComponent,
    ExternalAuditReportLoaderComponent,
    ExternalAuditInfoLoaderComponent,
    ExternalAuditRCALoaderComponent,
    ExternalAuditFindingInfoLoaderComponent,
    CorrectiveActionUpdateModalComponent,
    CorrectiveActionHistoryModalComponent,
    FindingDetailsDashboardComponent,
    DashboardExternalAuditComponent,
    EaDashboardFindingDetailsComponent,
    EaDashboardPendingCaComponent,
    EaDashboardLoaderComponent,
    ExternalAuditOverviewComponent
  ],
  imports: [
    CommonModule,
    ExternalAuditRoutingModule,
    SharedModule,
    NgxPaginationModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    CarouselModule
  ],
})
export class ExternalAuditModule {}
