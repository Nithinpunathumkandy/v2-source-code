import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { MrmRoutingModule } from './mrm-routing.module';
import { MeetingPlanComponent } from './pages/meeting-plan/meeting-plan.component';
import { MeetingPlanListComponent } from './pages/meeting-plan/meeting-plan-list/meeting-plan-list.component';
import { MeetingPlanLoaderComponent } from './components/loader/meeting-plan-loader/meeting-plan-loader.component';
import { AddMeetingPlanComponent } from './pages/meeting-plan/add-meeting-plan/add-meeting-plan.component';
import { MeetingPlanDetailsComponent } from './pages/meeting-plan/meeting-plan-details/meeting-plan-details.component';
import { MappingComponent } from './pages/meeting-plan/meeting-plan-details/mapping/mapping.component';
import { MeetingComponent } from './pages/meeting-plan/meeting-plan-details/meeting/meeting.component';
import { ReportComponent } from './pages/meeting-plan/meeting-plan-details/report/report.component';
import { ActionPlanComponent } from './pages/meeting-plan/meeting-plan-details/action-plan/action-plan.component';
import { InfoComponent } from './pages/meeting-plan/meeting-plan-details/info/info.component';
import { PreviewComponent } from './components/modal/preview/preview.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { EditMeetingPlanComponent } from './pages/meeting-plan/edit-meeting-plan/edit-meeting-plan.component';
import { AgendaRecursiveModalComponent } from './components/modal/agenda-recursive-modal/agenda-recursive-modal.component';
import { AgendaAddRepeatModalComponent } from './components/modal/agenda-add-repeat-modal/agenda-add-repeat-modal.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { MeetingListComponent } from './pages/meetings/meeting-list/meeting-list.component';
import { AddMeetingComponent } from './pages/meetings/add-meeting/add-meeting.component';
import { MomAddRepeatModalComponent } from './components/modal/mom-add-repeat-modal/mom-add-repeat-modal.component';
import { MomRecursiveModalComponent } from './components/modal/mom-recursive-modal/mom-recursive-modal.component';
import { MeetingsDetailsComponent } from './pages/meetings/meetings-details/meetings-details.component';
import { MeetingsInfoComponent } from './pages/meetings/meetings-details/meetings-info/meetings-info.component';
import { MeetingsReportComponent } from './pages/meetings/meetings-details/meetings-report/meetings-report.component';
import { MeetingsActionPlanComponent } from './pages/meetings/meetings-details/meetings-action-plan/meetings-action-plan.component';
import { EditMeetingComponent } from './pages/meetings/edit-meeting/edit-meeting.component';
import { MeetingReportTemplatesComponent } from './pages/meeting-report-templates/meeting-report-templates.component';
import { MeetingReportTemplatesListComponent } from './pages/meeting-report-templates/meeting-report-templates-list/meeting-report-templates-list.component';
import { MeetingReportTemplatesAddComponent } from './pages/meeting-report-templates/meeting-report-templates-add/meeting-report-templates-add.component';
import { ActionPlansComponent } from './pages/action-plans/action-plans.component';
import { ActionPlansListComponent } from './pages/action-plans/action-plans-list/action-plans-list.component';
import { ActionPlansDetailsComponent } from './pages/action-plans/action-plans-details/action-plans-details.component';
import { ActionPlansAddComponent } from './pages/action-plans/action-plans-add/action-plans-add.component';
import { ActionPlanUpdateModalComponent } from './components/action-plan/action-plan-update-modal/action-plan-update-modal.component';
import { MrmWorkflowAddModalComponent } from './pages/workflow/components/mrm-workflow-add-modal/mrm-workflow-add-modal.component';
import { MrmWorkflowComponent } from './pages/workflow/pages/mrm-workflow.component';
import { MrmWorkflowListComponent } from './pages/workflow/pages/mrm-workflow-list/mrm-workflow-list.component';
import { MrmWorkflowDetailsComponent } from './pages/workflow/pages/mrm-workflow-details/mrm-workflow-details.component';
import { MeetingReportTemplatesDetailsComponent } from './pages/meeting-report-templates/meeting-report-templates-details/meeting-report-templates-details.component';
import { MeetingReportsComponent } from './pages/meeting-reports/meeting-reports.component';
import { MeetingReportsListComponent } from './pages/meeting-reports/meeting-reports-list/meeting-reports-list.component';
import { AddUnplannedMeetingComponent } from './pages/meetings/add-unplanned-meeting/add-unplanned-meeting.component';
import { MeetingReportsDetailsComponent } from './pages/meeting-reports/meeting-reports-details/meeting-reports-details.component';
import { EditUnplannedMeetingComponent } from './pages/meetings/edit-unplanned-meeting/edit-unplanned-meeting.component';
import { PlanListLoaderComponent } from './components/loader/plan-list-loader/plan-list-loader.component';
import { PlanDetailMappingLoaderComponent } from './components/loader/plan-detail-mapping-loader/plan-detail-mapping-loader.component';
import { PlanDetailInfoLoaderComponent } from './components/loader/plan-detail-info-loader/plan-detail-info-loader.component';
import { PlanDetailMeetingLoaderComponent } from './components/loader/plan-detail-meeting-loader/plan-detail-meeting-loader.component';
import { ReportListLoaderComponent } from './components/loader/report-list-loader/report-list-loader.component';
import { MeetingListLoaderComponent } from './components/loader/meeting-list-loader/meeting-list-loader.component';
import { ActionPlanListLoaderComponent } from './components/loader/action-plan-list-loader/action-plan-list-loader.component';
import { TemplateListLoaderComponent } from './components/loader/template-list-loader/template-list-loader.component';
import { ReportMomRecursiveModalComponent } from './components/modal/report-mom-recursive-modal/report-mom-recursive-modal.component';
import { MeetingReportsAddComponent } from './pages/meeting-reports/meeting-reports-add/meeting-reports-add.component';
import { ReportDetailsLoaderComponent } from './components/loader/report-details-loader/report-details-loader.component';
import { ActionPlanDetailsLoaderComponent } from './components/loader/action-plan-details-loader/action-plan-details-loader.component';
import { MeetingsMomComponent } from './pages/meetings/meetings-details/meetings-mom/meetings-mom.component';
import { WorkflowDetailLoaderComponent } from './components/loader/workflow-detail-loader/workflow-detail-loader.component';
import { TemplateDetialsLoaderComponent } from './components/loader/template-detials-loader/template-detials-loader.component';
import { ActionPlanUpdateLoaderComponent } from './components/loader/action-plan-update-loader/action-plan-update-loader.component';
import { ActionPlanHistoryModalComponent } from './components/action-plan/action-plan-history-modal/action-plan-history-modal.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActionPlanHistoryLoaderComponent } from './components/loader/action-plan-history-loader/action-plan-history-loader.component';
import { MeetingMomDetialsLoaderComponent } from './components/loader/meeting-mom-detials-loader/meeting-mom-detials-loader.component';
import { MeetingPlanAddParticipantsModalComponent } from './components/meeting-plan/meeting-plan-add-participants-modal/meeting-plan-add-participants-modal.component';
import { DateUpdateModalComponent } from './components/meeting-plan/date-update-modal/date-update-modal.component';
import { CancelModalComponent } from './components/meeting-plan/cancel-modal/cancel-modal.component';
import { AddRiskMappingComponent } from './components/mapping/add-risk-mapping/add-risk-mapping.component';
import { NonConformityMappingComponent } from './components/mapping/non-conformity-mapping/non-conformity-mapping.component';
import { ObjectiveAddModalComponent } from './components/meeting-plan/objective-add-modal/objective-add-modal.component';
import { FindingAddModalComponent } from './components/mapping/finding-add-modal/finding-add-modal.component';
import { CriteriaAddModalComponent } from './components/meeting-plan/criteria-add-modal/criteria-add-modal.component';
import { AgendaAddModalComponent } from './components/meeting-plan/agenda-add-modal/agenda-add-modal.component';
import { DashborderLoaderComponent } from './components/loader/dashborder-loader/dashborder-loader.component';
import { MrmOverviewComponent } from './pages/mrm-overview/mrm-overview.component';
import { AgendaFormComponent } from './components/agenda-form/agenda-form.component';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { MeetingDocumentsComponent } from './pages/meetings/meetings-details/meeting-documents/meeting-documents.component';
import { MeetingPlanDocumentsComponent } from './pages/meeting-plan/meeting-plan-details/meeting-plan-documents/meeting-plan-documents.component';
import { MeetingMappingComponent } from './pages/meetings/meetings-details/meeting-mapping/meeting-mapping.component';
import { MeetingActionPlanComponent } from './components/modal/meeting-action-plan/meeting-action-plan.component';
import { DetailsAddedActionPlanComponent } from './components/modal/details-added-action-plan/details-added-action-plan.component';
import { PreviewMeetingMinutesComponent } from './components/modal/preview-meeting-minutes/preview-meeting-minutes.component';


// Formate added to set the agenda time as only 24 hour format
export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',hour12: OrganizationGeneralSettingsStore?.organizationSettings?.clock_format=='12-hour clock'?true:false},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric',  hour12: OrganizationGeneralSettingsStore?.organizationSettings?.clock_format=='12-hour clock'?true:false},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

@NgModule({
  declarations: [MeetingPlanComponent, MeetingPlanListComponent, MeetingPlanLoaderComponent, AddMeetingPlanComponent, CriteriaAddModalComponent, ObjectiveAddModalComponent, MeetingPlanDetailsComponent, MappingComponent, MeetingComponent, ReportComponent, ActionPlanComponent, InfoComponent, PreviewComponent, EditMeetingPlanComponent, AgendaRecursiveModalComponent, AgendaAddRepeatModalComponent, AddRiskMappingComponent, MeetingsComponent, MeetingListComponent, AddMeetingComponent, MomAddRepeatModalComponent, MomRecursiveModalComponent, MeetingsDetailsComponent, MeetingsInfoComponent, MeetingsReportComponent, MeetingsActionPlanComponent, EditMeetingComponent, MeetingReportTemplatesComponent, MeetingReportTemplatesListComponent, MeetingReportTemplatesAddComponent, ActionPlansComponent, ActionPlansListComponent, ActionPlansDetailsComponent, ActionPlansAddComponent, ActionPlanUpdateModalComponent, MeetingPlanAddParticipantsModalComponent, MrmWorkflowAddModalComponent, MrmWorkflowComponent, MrmWorkflowListComponent, MrmWorkflowDetailsComponent, MeetingReportTemplatesDetailsComponent, MeetingReportsComponent, MeetingReportsListComponent, AddUnplannedMeetingComponent, MeetingReportsDetailsComponent, EditUnplannedMeetingComponent, PlanListLoaderComponent, PlanDetailMappingLoaderComponent, PlanDetailInfoLoaderComponent, PlanDetailMeetingLoaderComponent, ReportListLoaderComponent, MeetingListLoaderComponent, ActionPlanListLoaderComponent, TemplateListLoaderComponent, ReportMomRecursiveModalComponent, MeetingReportsAddComponent, ReportDetailsLoaderComponent, ActionPlanDetailsLoaderComponent, AgendaAddModalComponent, MeetingsMomComponent, WorkflowDetailLoaderComponent, TemplateDetialsLoaderComponent, ActionPlanUpdateLoaderComponent, DateUpdateModalComponent, ActionPlanHistoryModalComponent, DashboardComponent, ActionPlanHistoryLoaderComponent, FindingAddModalComponent, MeetingMomDetialsLoaderComponent, NonConformityMappingComponent, CancelModalComponent, DashborderLoaderComponent, MrmOverviewComponent, AgendaFormComponent, MeetingDocumentsComponent, MeetingPlanDocumentsComponent, MeetingMappingComponent, MeetingActionPlanComponent, DetailsAddedActionPlanComponent, PreviewMeetingMinutesComponent],
  imports: [
    CommonModule,
    MrmRoutingModule,
    NgxPaginationModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
],
})
export class MrmModule { }
