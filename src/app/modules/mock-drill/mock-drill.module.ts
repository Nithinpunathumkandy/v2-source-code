import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { MockDrillRoutingModule } from './mock-drill-routing.module';
import { MockDrillComponent } from './pages/mock-drill/mock-drill.component';
import { MockDrillPlanComponent } from './pages/mock-drill-plan/mock-drill-plan.component';
import { MockDrillListComponent } from './pages/mock-drill/mock-drill-list/mock-drill-list.component';
import { MockDrillDetailsComponent } from './pages/mock-drill/mock-drill-details/mock-drill-details.component';
import { MockDrillAddComponent } from './pages/mock-drill/mock-drill-add/mock-drill-add.component';
import { MockDrillPlanListComponent } from './pages/mock-drill-plan/mock-drill-plan-list/mock-drill-plan-list.component';
import { MockDrillPlanDetailsComponent } from './pages/mock-drill-plan/mock-drill-plan-details/mock-drill-plan-details.component';
import { MockDrillPlanNewComponent } from './pages/mock-drill-plan/mock-drill-plan-new/mock-drill-plan-new.component';
import { AddUserMockDrillModalComponent } from './pages/mock-drill/components/add-user-mock-drill-modal/add-user-mock-drill-modal.component';
import { MockDrillReviewModalComponent } from './pages/mock-drill/components/mock-drill-review-modal/mock-drill-review-modal.component';
import { MockDrillReportsComponent } from './pages/mock-drill-report/mock-drill-reports/mock-drill-reports.component';
import { MockDrillHistoryModalComponent } from './pages/mock-drill/components/mock-drill-history-modal/mock-drill-history-modal.component';
import { MockDrillDetailsLoaderComponent } from './component/loader/mock-drill-details-loader/mock-drill-details-loader.component';
import { MockDrillPlanDetailsLoaderComponent } from './component/loader/mock-drill-plan-details-loader/mock-drill-plan-details-loader.component';
import { MockDrillEditComponent } from './pages/mock-drill/mock-drill-edit/mock-drill-edit.component';
import { MockDrillPlanEditComponent } from './pages/mock-drill-plan/mock-drill-plan-edit/mock-drill-plan-edit.component';
import { MockDrillProgramComponent } from './pages/mock-drill-program/mock-drill-program.component';
import { MockDrillProgramDetailsComponent } from './pages/mock-drill-program/mock-drill-program-details/mock-drill-program-details.component';
import { MockDrillProgramListComponent } from './pages/mock-drill-program/mock-drill-program-list/mock-drill-program-list.component';
import { MockDrillProgramAddComponent } from './pages/mock-drill-program/mock-drill-program-add/mock-drill-program-add.component';
import { MockDrillProgramEditComponent } from './pages/mock-drill-program/mock-drill-program-edit/mock-drill-program-edit.component';
import { MockDrillPreplanComponent } from './pages/mock-drill-program/components/mock-drill-preplan/mock-drill-preplan.component';
import { MockDrillProgramDetailsLoaderComponent } from './component/loader/mock-drill-program-details-loader/mock-drill-program-details-loader.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MockDrillInfoComponent } from './pages/mock-drill/mock-drill-details/mock-drill-info/mock-drill-info.component';
import { MockDrillActionPlansComponent } from './pages/mock-drill/mock-drill-details/mock-drill-action-plans/mock-drill-action-plans.component';
import { MockDrillActionPlanAddComponent } from './pages/mock-drill/mock-drill-details/mock-drill-action-plans/mock-drill-action-plan-add/mock-drill-action-plan-add.component';
import { MockDrillActionPlanUpdateModalComponent } from './pages/mock-drill/components/action-plan/mock-drill-action-plan-update-modal/mock-drill-action-plan-update-modal.component';
import { MockDrillActionPlanHistoryModalComponent } from './pages/mock-drill/components/action-plan/mock-drill-action-plan-history-modal/mock-drill-action-plan-history-modal.component';
import { PreviewComponent } from './pages/mock-drill/components/Modal/preview/preview.component';
import { ActionPlanHistoryLoaderComponent } from './component/loader/action-plan-history-loader/action-plan-history-loader.component';
import { MockDrillWorkflowAddModalComponent } from './pages/Workflow/Components/mock-drill-workflow-add-modal/mock-drill-workflow-add-modal.component';
import { MockDrillWorkflowComponent } from './pages/Workflow/Pages/mock-drill-workflow.component';
import { MockDrillWorkflowListComponent } from './pages/Workflow/Pages/mock-drill-workflow-list/mock-drill-workflow-list.component';
import { MockDrillWorkflowDetailsComponent } from './pages/Workflow/Pages/mock-drill-workflow-details/mock-drill-workflow-details.component';
import { MockDrillProgramInfoComponent } from './pages/mock-drill-program/mock-drill-program-details/mock-drill-program-info/mock-drill-program-info.component';
import { MockDrillProgramMappingComponent } from './pages/mock-drill-program/mock-drill-program-details/mock-drill-program-mapping/mock-drill-program-mapping.component';
import { ActionPlanUpdateLoaderComponent } from './component/loader/action-plan-update-loader/action-plan-update-loader.component';
import { MockdrillWorkflowModalComponent } from './pages/mock-drill/components/mockdrill-workflow-modal/mockdrill-workflow-modal.component';

@NgModule({
    declarations: [
        MockDrillComponent,
        MockDrillPlanComponent,
        MockDrillListComponent,
        MockDrillDetailsComponent,
        MockDrillAddComponent,
        MockDrillPlanListComponent,
        MockDrillPlanDetailsComponent,
        MockDrillPlanNewComponent,
        AddUserMockDrillModalComponent,
        MockDrillReviewModalComponent,
        MockDrillReportsComponent,
        MockDrillHistoryModalComponent,
        MockDrillDetailsLoaderComponent,
        MockDrillPlanDetailsLoaderComponent,
        MockDrillEditComponent,
        MockDrillPlanEditComponent,
        MockDrillProgramComponent,
        MockDrillProgramDetailsComponent,
        MockDrillProgramListComponent,
        MockDrillProgramAddComponent,
        MockDrillProgramEditComponent,
        MockDrillPreplanComponent,
        MockDrillProgramDetailsLoaderComponent,
        MockDrillActionPlansComponent,
        MockDrillInfoComponent,
        MockDrillActionPlanAddComponent,
        MockDrillActionPlanUpdateModalComponent,
        MockDrillActionPlanHistoryModalComponent,
        PreviewComponent,
        ActionPlanHistoryLoaderComponent,
        MockDrillWorkflowAddModalComponent,
        MockDrillWorkflowComponent,
        MockDrillWorkflowListComponent,
        MockDrillWorkflowDetailsComponent,
        MockDrillProgramInfoComponent,
        MockDrillProgramMappingComponent,
        ActionPlanUpdateLoaderComponent,
        MockdrillWorkflowModalComponent
    ],
    imports: [
        CommonModule,
        MockDrillRoutingModule,
        NgxPaginationModule,
        SharedModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule
    ]
})
export class MockDrillModule { }
