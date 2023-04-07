import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ComplianceManagementRoutingModule } from './compliance-management-routing.module';
import { ComplianceRegisterComponent } from './pages/compliance-register/compliance-register.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddComplianceRegisterComponent } from './pages/compliance-register/add-compliance-register/add-compliance-register.component';
import { ComplianceRegisterDetailsComponent } from './pages/compliance-register/compliance-register-details/compliance-register-details.component';
import { ComplianceRegisterListComponent } from './pages/compliance-register/compliance-register-list/compliance-register-list.component';
import { SlaContractComponent } from './pages/sla-contract/sla-contract.component';
import { SlaContractListComponent } from './pages/sla-contract/sla-contract-list/sla-contract-list.component';
import { SlaContractDetailsComponent } from './pages/sla-contract/sla-contract-details/sla-contract-details.component';
import { SlaContractDocumentRenewModalComponent } from './component/sla-contract-document-renew-modal/sla-contract-document-renew-modal.component';
import { SlaContractDocumentHistoryComponent } from './component/sla-contract-document-history/sla-contract-document-history.component';
import { ComplianceStatusMainModalComponent } from './component/compliance-status-main-modal/compliance-status-main-modal.component';
import { ComplianceStatusHistoryComponent } from './component/compliance-status-history/compliance-status-history.component';
import { ComplianceMangementPreviewComponent } from './component/compliance-mangement-preview/compliance-mangement-preview.component';
import { SlaContractDetailsLoaderComponent } from './component/loader/sla-contract-details-loader/sla-contract-details-loader.component';
import { ComplianceDetailsLoaderComponent } from './component/loader/compliance-details-loader/compliance-details-loader.component';
import { ComplianceDashboardComponent } from './pages/compliance-dashboard/compliance-dashboard.component';
import { ComplianceStatusHistoryLoaderComponent } from './component/loader/compliance-status-history-loader/compliance-status-history-loader.component';
import { ComplianceDashboardLoaderComponent } from './component/loader/compliance-dashboard-loader/compliance-dashboard-loader.component';
import { ComplianceReportComponent } from './pages/compliance-report/compliance-report.component';
import { ComplianceCountTypeComponent } from './pages/compliance-report/compliance-count-type/compliance-count-type.component';
import { ComplianceCountListComponent } from './pages/compliance-report/compliance-count-list/compliance-count-list.component';
import { ComplianceReportLoaderComponent } from './component/loader/compliance-report-loader/compliance-report-loader.component';
import { ComplianceWorkflowComponent } from './pages/compliance-workflow/compliance-workflow.component';
import { ComplianceWorkflowListComponent } from './pages/compliance-workflow/pages/compliance-workflow-list/compliance-workflow-list.component';
import { ComplianceWorkflowDetailsComponent } from './pages/compliance-workflow/pages/compliance-workflow-details/compliance-workflow-details.component';
import { ComplianceWorkflowLoaderComponent } from './pages/compliance-workflow/components/compliance-workflow-loader/compliance-workflow-loader.component';
import { ComplianceWorkflowAddModalComponent } from './pages/compliance-workflow/components/compliance-workflow-add-modal/compliance-workflow-add-modal.component';
import { ComplianceRegisterMappingComponent } from './pages/compliance-register/compliance-register-details/compliance-register-mapping/compliance-register-mapping.component';
import { ComplianceRegisterRouterComponent } from './pages/compliance-register/compliance-register-details/compliance-register-router/compliance-register-router.component';
//import { AddRiskMappingComplianceComponent } from './component/add-risk-mapping-compliance/add-risk-mapping-compliance.component';
// import { AuditFindingMappingComplianceComponent } from './component/audit-finding-mapping-compliance/audit-finding-mapping-compliance.component';
import { SlaContractMappingComponent } from './pages/sla-contract/sla-contract-details/sla-contract-mapping/sla-contract-mapping.component';
import { SlaContractInfoComponent } from './pages/sla-contract/sla-contract-details/sla-contract-info/sla-contract-info.component';
import { ComplianceRegisterActionPlansComponent } from './pages/compliance-register/compliance-register-details/compliance-register-action-plans/compliance-register-action-plans.component';
import { ComplianceActionPlansComponent } from './pages/compliance-action-plans/compliance-action-plans.component';
import { ComplianceActionPlansAddComponent } from './pages/compliance-action-plans/compliance-action-plans-add/compliance-action-plans-add.component';
import { ComplianceActionPlansDetailsComponent } from './pages/compliance-action-plans/compliance-action-plans-details/compliance-action-plans-details.component';
import { ComplianceActionPlansListComponent } from './pages/compliance-action-plans/compliance-action-plans-list/compliance-action-plans-list.component';
import { ActionPlanStatusUpdateModalComponent } from './component/action-plan-status-update-modal/action-plan-status-update-modal.component';
import { ActionPlanStatusHistoryModalComponent } from './component/action-plan-status-history-modal/action-plan-status-history-modal.component';
import { ActionPlanDetailsLoaderComponent } from './component/loader/action-plan-details-loader/action-plan-details-loader.component';
import { ActionPlanStatusUpdateLoaderComponent } from './component/loader/action-plan-status-update-loader/action-plan-status-update-loader.component';
import { ActionPlanStatusHistoryLoaderComponent } from './component/loader/action-plan-status-history-loader/action-plan-status-history-loader.component';
import { ComplianceOverviewComponent } from './pages/compliance-overview/compliance-overview.component';
import { ComplainceChecklistComponent } from './pages/complaince-checklist/complaince-checklist.component';
import { AddChecklistModalComponent } from './component/add-checklist-modal/add-checklist-modal.component';
import { ComplainceChecklitDetailsComponent } from './pages/complaince-checklist/complaince-checklit-details/complaince-checklit-details.component';
import { ComplainceChecklistDetailsLoaderComponent } from './component/loader/complaince-checklist-details-loader/complaince-checklist-details-loader.component';
import { ContractAssessmentsComponent } from './pages/contract-assessments/contract-assessments.component';
import { ContractAssessmentListComponent } from './pages/contract-assessments/contract-assessment-list/contract-assessment-list.component';
import { ContractAssessmentDetailsComponent } from './pages/contract-assessments/contract-assessment-details/contract-assessment-details.component';
import { AddContractAssessmentModalComponent } from './component/add-contract-assessment-modal/add-contract-assessment-modal.component';
import { ContractAssessmentDetailsLoaderComponent } from './component/loader/contract-assessment-details-loader/contract-assessment-details-loader.component';


@NgModule({
  declarations: [ComplianceRegisterComponent, AddComplianceRegisterComponent, ComplianceRegisterDetailsComponent, ComplianceRegisterListComponent, SlaContractComponent, SlaContractListComponent, SlaContractDetailsComponent, ComplianceStatusMainModalComponent, ComplianceStatusHistoryComponent,ComplianceWorkflowLoaderComponent,
    SlaContractDocumentHistoryComponent,SlaContractDocumentRenewModalComponent, ComplianceMangementPreviewComponent, SlaContractDetailsLoaderComponent, ComplianceDetailsLoaderComponent, ComplianceDashboardComponent, ComplianceStatusHistoryLoaderComponent, ComplianceDashboardLoaderComponent, ComplianceReportComponent, ComplianceCountTypeComponent, ComplianceCountListComponent, ComplianceReportLoaderComponent, ComplianceWorkflowComponent, ComplianceWorkflowListComponent, ComplianceWorkflowDetailsComponent, ComplianceWorkflowAddModalComponent, ComplianceRegisterMappingComponent, ComplianceRegisterRouterComponent, SlaContractMappingComponent, SlaContractInfoComponent, ComplianceRegisterActionPlansComponent, ComplianceActionPlansComponent, ComplianceActionPlansAddComponent, ComplianceActionPlansDetailsComponent, ComplianceActionPlansListComponent, ActionPlanStatusUpdateModalComponent, ActionPlanStatusHistoryModalComponent, ActionPlanStatusUpdateLoaderComponent, ActionPlanDetailsLoaderComponent, ActionPlanStatusHistoryLoaderComponent, ComplianceOverviewComponent, ComplainceChecklistComponent, AddChecklistModalComponent, ComplainceChecklitDetailsComponent, ComplainceChecklistDetailsLoaderComponent, ContractAssessmentsComponent, ContractAssessmentListComponent, ContractAssessmentDetailsComponent, AddContractAssessmentModalComponent, ContractAssessmentDetailsLoaderComponent,],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    ComplianceManagementRoutingModule
  ]
})
export class ComplianceManagementModule { }
