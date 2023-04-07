import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessAssessmentsRoutingModule } from './business-assessments-routing.module';
import { AssessmentsComponent } from './pages/assessments/assessments/assessments.component';
import { FrameworksComponent } from './pages/frameworks/frameworks/frameworks.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FrameworkDetailsComponent } from './pages/frameworks/framework-details/framework-details.component';
import { BusinessAssessmentFrameworkComponent } from './pages/frameworks/business-assessment-framework.component';
import { BusinessAssessmentAssessmentsComponent } from './pages/assessments/business-assessment-assessments.component';
import { AssessmentDocumentComponent } from './pages/assessments/assessment-document/assessment-document.component';
import { AssessmentMsTypeComponent } from './pages/assessments/assessment-ms-type/assessment-ms-type.component';
import { AssessmentDocumentTypeComponent } from './pages/assessments/assessment-document-type/assessment-document-type.component';
import { AssessmentDepartmentComponent } from './pages/assessments/assessment-department/assessment-department.component';
import { AssessmentPdcaComponent } from './pages/assessments/assessment-pdca/assessment-pdca.component';
import { AssessmentDetailsComponent } from './pages/assessment-detail-main/assessment-details/assessment-details.component';
import { AssessmentDetailMainComponent } from './pages/assessment-detail-main/assessment-detail-main.component';
import { ChecklistChildComponent } from './components/checklist-child/checklist-child.component';
import { AssessmentsListLoaderComponent } from './components/loader/assessments-list-loader/assessments-list-loader.component';
import { AssessmentDocPreviewComponent } from './components/assessment-doc-preview/assessment-doc-preview.component';
import { FrameworkLoaderComponent } from './components/loader/framework-loader/framework-loader.component';
import { AssessmentDocumentLoaderComponent } from './components/loader/assessment-document-loader/assessment-document-loader.component';
import { AssessmentDepartmentLoaderComponent } from './components/loader/assessment-department-loader/assessment-department-loader.component';
import { AssessmentPdcaLoaderComponent } from './components/loader/assessment-pdca-loader/assessment-pdca-loader.component';
import { FrameworkDetailLoaderComponent } from './components/loader/framework-detail-loader/framework-detail-loader.component';
import { AssessmentDetailLoaderComponent } from './components/loader/assessment-detail-loader/assessment-detail-loader.component';
import { GridViewLoaderComponent } from './components/loader/grid-view-loader/grid-view-loader.component';
import { AssessmentActionPlanComponent } from './pages/assessment-action-plan/assessment-action-plan.component';
import { AssessmentActionPlanAddComponent } from './pages/assessment-action-plan/assessment-action-plan-add/assessment-action-plan-add.component';
import { AssessmentActionPlanListComponent } from './pages/assessment-action-plan/assessment-action-plan-list/assessment-action-plan-list.component';
import { AssessmentActionPlanDetailsComponent } from './pages/assessment-action-plan/assessment-action-plan-details/assessment-action-plan-details.component';
import { ActionPlanLoaderComponent } from './components/loader/action-plan-loader/action-plan-loader.component';
import { ActionPlanStatusUpdateModalComponent } from './components/action-plan-status-update-modal/action-plan-status-update-modal.component';
import { ActionPlanStatusHistoryModalComponent } from './components/action-plan-status-history-modal/action-plan-status-history-modal.component';
import { ActionPlanStatusUpdateLoaderComponent } from './components/loader/action-plan-status-update-loader/action-plan-status-update-loader.component';
import { ActionPlanStatusHistoryLoaderComponent } from './components/loader/action-plan-status-history-loader/action-plan-status-history-loader.component';
import { ActionPlansComponent } from './pages/assessment-detail-main/assessment-details/action-plans/action-plans.component';
import { AssessmentInfoComponent } from './pages/assessment-detail-main/assessment-details/assessment-info/assessment-info.component';
import { BusinessAssessmentOverviewComponent } from './pages/business-assessment-overview/business-assessment-overview.component';
import { ControlAssessmentComponent } from './pages/control-assessment/control-assessment.component';
import { ControlAssessmentListComponent } from './pages/control-assessment/control-assessment-list/control-assessment-list.component';
import { ControlAssessmentDetailsComponent } from './pages/control-assessment/control-assessment-details/control-assessment-details.component';
import { AssessmentInControlComponent } from './pages/control-assessment/control-assessment-details/assessment-in-control/assessment-in-control.component';
import { MaturityModalComponent } from './pages/maturity-modal/maturity-modal.component';
import { MaturityModalListComponent } from './pages/maturity-modal/maturity-modal-list/maturity-modal-list.component';
import { AddMaturityModalComponent } from './components/add-maturity-modal/add-maturity-modal.component';
import { MaturityModalDetailsComponent } from './pages/maturity-modal/maturity-modal-details/maturity-modal-details.component';
import { AddControlAssessmentComponent } from './components/add-control-assessment/add-control-assessment.component';
import { EditControlAssessmentComponent } from './pages/control-assessment/control-assessment-details/assessment-in-control/edit-control-assessment/edit-control-assessment.component';
import { ControlAssessmentLoaderComponent } from './components/loader/control-assessment-loader/control-assessment-loader.component';
import { DetailsControlAssessmentLoaderComponent } from './components/loader/details-control-assessment-loader/details-control-assessment-loader.component';
import { AddActionPlanControlAssessmentComponent } from './components/add-action-plan-control-assessment/add-action-plan-control-assessment.component';
import { ControlAssessmentActionPlanComponent } from './pages/control-assessment/control-assessment-details/control-assessment-action-plan/control-assessment-action-plan.component';
import { ActionPlanControlAssessmentComponent } from './pages/action-plan-control-assessment/action-plan-control-assessment.component';
import { ActionPlanControlAssessmentListComponent } from './pages/action-plan-control-assessment/action-plan-control-assessment-list/action-plan-control-assessment-list.component';
import { ActionPlanControlAssessmentDetailsComponent } from './pages/action-plan-control-assessment/action-plan-control-assessment-details/action-plan-control-assessment-details.component';
import { ControlAssessmentActionPlanUpdateStatusComponent } from './components/control-assessment-action-plan-update-status/control-assessment-action-plan-update-status.component';
import { ControlAssessmentActionPlanHistoryComponent } from './components/control-assessment-action-plan-history/control-assessment-action-plan-history.component';
import { ControlAssessmentDashboardComponent } from './pages/control-assessment/control-assessment-details/control-assessment-dashboard/control-assessment-dashboard.component';
import { ControlAssessmentCountComponent } from './pages/control-assessment/control-assessment-details/control-assessment-count/control-assessment-count.component';
import { BusinessAssessmentDashboardLoaderComponent } from './components/loader/business-assessment-dashboard-loader/business-assessment-dashboard-loader.component';



@NgModule({
  declarations: [
    AssessmentsComponent,
    FrameworksComponent,
    DashboardComponent,
    FrameworkDetailsComponent,
    BusinessAssessmentFrameworkComponent,
    BusinessAssessmentAssessmentsComponent,
    AssessmentDocumentComponent,
    AssessmentMsTypeComponent,
    AssessmentDocumentTypeComponent,
    AssessmentDepartmentComponent,
    AssessmentPdcaComponent,
    AssessmentDetailsComponent,
    AssessmentDetailMainComponent,
    ChecklistChildComponent,
    AssessmentsListLoaderComponent,
    AssessmentDocPreviewComponent,
    FrameworkLoaderComponent,
    AssessmentDocumentLoaderComponent,
    AssessmentDepartmentLoaderComponent,
    AssessmentPdcaLoaderComponent,
    FrameworkDetailLoaderComponent,
    AssessmentDetailLoaderComponent,
    GridViewLoaderComponent,
    AssessmentActionPlanComponent,
    AssessmentActionPlanAddComponent,
    AssessmentActionPlanListComponent,
    AssessmentActionPlanDetailsComponent,
    ActionPlanLoaderComponent,
    ActionPlanStatusUpdateModalComponent,
    ActionPlanStatusHistoryModalComponent,
    ActionPlanStatusUpdateLoaderComponent,
    ActionPlanStatusHistoryLoaderComponent,
    ActionPlansComponent,
    AssessmentInfoComponent,
    BusinessAssessmentOverviewComponent,
    ControlAssessmentComponent,
    ControlAssessmentListComponent,
    ControlAssessmentDetailsComponent,
    AssessmentInControlComponent,
    MaturityModalComponent,
    MaturityModalListComponent,
    AddMaturityModalComponent,
    MaturityModalDetailsComponent,
    AddControlAssessmentComponent,
    EditControlAssessmentComponent,
    ControlAssessmentLoaderComponent,
    DetailsControlAssessmentLoaderComponent,
    AddActionPlanControlAssessmentComponent,
    ControlAssessmentActionPlanComponent,
    ActionPlanControlAssessmentComponent,
    ActionPlanControlAssessmentListComponent,
    ActionPlanControlAssessmentDetailsComponent,
    ControlAssessmentActionPlanUpdateStatusComponent,
    ControlAssessmentActionPlanHistoryComponent,
    ControlAssessmentDashboardComponent,
    ControlAssessmentCountComponent,
    BusinessAssessmentDashboardLoaderComponent,
   ],
  imports: [
    CommonModule,
    SharedModule,
    BusinessAssessmentsRoutingModule,
    NgxPaginationModule,
  ]
})
export class BusinessAssessmentsModule { }
