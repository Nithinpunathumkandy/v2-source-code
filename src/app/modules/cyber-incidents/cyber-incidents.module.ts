import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CyberIncidentsRoutingModule } from './cyber-incidents-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddIncidentComponent } from './components/add-incident/add-incident.component';
import { CyberIncidentComponent } from './pages/cyber-incident/cyber-incident.component';
import { CyberIncidentDetailsComponent } from './pages/cyber-incident/cyber-incident-details/cyber-incident-details.component';
import { CyberIncidentListComponent } from './pages/cyber-incident/cyber-incident-list/cyber-incident-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoComponent } from './pages/cyber-incident/cyber-incident-details/info/info.component';
import { RcaComponent } from './pages/cyber-incident/cyber-incident-details/rca/rca.component';
import { IaComponent } from './pages/cyber-incident/cyber-incident-details/ia/ia.component';
import { CaComponent } from './pages/cyber-incident/cyber-incident-details/ca/ca.component';
import { ReportComponent } from './pages/cyber-incident/cyber-incident-details/report/report.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CyberIncidentLoaderComponent } from './loaders/cyber-incident-loader/cyber-incident-loader.component';
import { WorkflowEngineComponent } from './pages/workflow-engine/workflow-engine.component';
import { WorkflowListComponent } from './pages/workflow-engine/workflow-list/workflow-list.component';
import { WorkflowDetailsComponent } from './pages/workflow-engine/workflow-details/workflow-details.component';
import { AddCyberIncidentWorkflowComponent } from './components/add-cyber-incident-workflow/add-cyber-incident-workflow.component';
import { CyberIncidentWorkflowComponent } from './components/cyber-incident-workflow/cyber-incident-workflow.component';
import { CyberIncidentWorkflowHistoryComponent } from './components/cyber-incident-workflow-history/cyber-incident-workflow-history.component';
import { CyberIncidentFilePreviewComponent } from './components/cyber-incident-file-preview/cyber-incident-file-preview.component';
import { CyberIncidentCorrectiveActionAddComponent } from './components/cyber-incident-corrective-action-add/cyber-incident-corrective-action-add.component';
import { CyberIncidentCommentModalComponent } from './components/cyber-incident-comment-modal/cyber-incident-comment-modal.component';
import { CyberIncidentCorrectiveActionUpdateModalComponent } from './components/cyber-incident-corrective-action-update-modal/cyber-incident-corrective-action-update-modal.component';
import { CyberIncidentCorrectiveActionHistoryModalComponent } from './components/cyber-incident-corrective-action-history-modal/cyber-incident-corrective-action-history-modal.component';
import { AddCyberIncidentRcaComponent } from './components/add-cyber-incident-rca/add-cyber-incident-rca.component';
import { CyberIncidentRcaLoaderComponent } from './loaders/cyber-incident-rca-loader/cyber-incident-rca-loader.component';
import { AddCyberIncidentIaModalComponent } from './components/add-cyber-incident-ia-modal/add-cyber-incident-ia-modal.component';
import { CorrectiveActionComponent } from './pages/corrective-action/corrective-action.component';
import { CorrectiveActionListComponent } from './pages/corrective-action/corrective-action-list/corrective-action-list.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-action/corrective-action-details/corrective-action-details.component';
import { AddReportConclusionComponent } from './components/add-report-conclusion/add-report-conclusion.component';
import { CyberIncidentReportListComponent } from './pages/report/pages/cyber-incident-report-list/cyber-incident-report-list.component';
import { CyberIncidentReportDetailsComponent } from './pages/report/pages/cyber-incident-report-details/cyber-incident-report-details.component';
import { CyberIncidentDetailReportComponent } from './pages/report/pages/cyber-incident-detail-report/cyber-incident-detail-report.component';
import { CyberIncidentReportComponent } from './pages/report/cyber-incident-report.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CyberIncidentListComponent,
    AddIncidentComponent,
    CyberIncidentComponent,
    CyberIncidentDetailsComponent,
    InfoComponent,
    RcaComponent,
    IaComponent,
    CaComponent,
    ReportComponent,
    CyberIncidentLoaderComponent,
    WorkflowEngineComponent,
    WorkflowListComponent,
    WorkflowDetailsComponent,
    AddCyberIncidentWorkflowComponent,
    CyberIncidentWorkflowComponent,
    CyberIncidentWorkflowHistoryComponent,
    CyberIncidentFilePreviewComponent,
    CyberIncidentCorrectiveActionAddComponent,
    CyberIncidentCommentModalComponent,
    CyberIncidentCorrectiveActionUpdateModalComponent,
    CyberIncidentCorrectiveActionHistoryModalComponent,
    AddCyberIncidentRcaComponent,
    CyberIncidentRcaLoaderComponent,
    AddCyberIncidentIaModalComponent,
    CorrectiveActionComponent,
    CorrectiveActionListComponent,
    CorrectiveActionDetailsComponent,
    AddReportConclusionComponent,
    CyberIncidentReportListComponent,
    CyberIncidentReportDetailsComponent,
    CyberIncidentDetailReportComponent,
    CyberIncidentReportComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    CyberIncidentsRoutingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class CyberIncidentsModule { }
