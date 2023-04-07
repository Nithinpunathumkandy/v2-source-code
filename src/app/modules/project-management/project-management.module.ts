import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectManagementRoutingModule } from './project-management-routing.module';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectInfoComponent } from './pages/project-details/project-info/project-info.component';
import { ProjectHlPlanComponent } from './pages/project-details/project-hl-plan/project-hl-plan.component';
import { ProjectTasksComponent } from './pages/project-details/project-tasks/project-tasks.component';
import { ProjectMembersComponent } from './pages/project-details/project-members/project-members.component';
import { ProjectDocumentsComponent } from './pages/project-details/project-documents/project-documents.component';
import { ProjectMeetingsComponent } from './pages/project-details/project-meetings/project-meetings.component';
import { ProjectRisksComponent } from './pages/project-details/project-risks/project-risks.component';
import { ProjectScopeComponent } from './pages/project-details/project-scope/project-scope.component';
import { ProjectDeliverableComponent } from './pages/project-details/project-deliverable/project-deliverable.component';
import { ProjectDiscussionComponent } from './pages/project-details/project-discussion/project-discussion.component';
import { ProjectSettingsComponent } from './pages/project-details/project-settings/project-settings.component';
import { ProjectCostComponent } from './pages/project-details/project-cost/project-cost.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectSettingsModulesComponent } from './pages/project-details/project-settings/project-settings-modules/project-settings-modules.component';
import { ProjectSettingsIssueCategoryComponent } from './pages/project-details/project-settings/project-settings-issue-category/project-settings-issue-category.component';
import { ProjectSettingsCategoryComponent } from './pages/project-details/project-settings/project-settings-category/project-settings-category.component';
import { ProjectSettingsSettingsComponent } from './pages/project-details/project-settings/project-settings-settings/project-settings-settings.component';
import { ProjectModalComponent } from './pages/projects/components/project-modal/project-modal.component';
import { SimpleTableLoaderComponent } from './pages/components/loader/simple-table-loader/simple-table-loader.component';
import { ProjectSettingsIssueCategoryModalComponent } from './pages/project-details/project-settings/project-settings-issue-category/components/p-settings-issue-category-modal/p-settings-issue-category-modal.component';
import { ProjectIssueCategoryLoaderComponent } from './pages/project-details/project-settings/project-settings-issue-category/components/project-issue-category-loader/project-issue-category-loader.component';
import { PmFilePreviewModalComponent } from './pages/components/pm-file-preview-modal/pm-file-preview-modal.component';
import {ProjectDeliverableModalComponent} from './pages/project-details/project-deliverable/components/project-deliverable-modal/project-deliverable-modal//project-deliverable-modal.component';
import { PmSettingsCategoryModalComponent } from './pages/project-details/project-settings/project-settings-category/components/pm-settings-category-modal/pm-settings-category-modal.component';
import { PmSettingsCategoryLoaderComponent } from './pages/project-details/project-settings/project-settings-category/components/pm-settings-category-loader/pm-settings-category-loader.component';
import { PmTaskModalComponent } from './pages/project-details/project-tasks/components/pm-task-modal/pm-task-modal.component';
// import { CustomerEngagementModule } from '../customer-engagement/customer-engagement.module';
import { ProjectDiscussionModalComponent } from './pages/project-details/project-discussion/components/project-discussion-modal/project-discussion-modal.component';
import { ProjectManagementPreviewComponent } from './components/project-management-preview/project-management-preview.component';
import { DiscussionDetailsComponent } from './pages/project-details/project-discussion/components/discussion-details/discussion-details.component';
import { TasksListComponent } from './pages/tasks/task-list/task-list.component';
import { TaskDetailsComponent } from './pages/tasks/task-details/task-details.component';
import { DiscussionRepliesModalComponent } from './pages/project-details/project-discussion/components/discussion-replies-modal/discussion-replies-modal.component';
import { DiscussionReplyReplyModalComponent } from './pages/project-details/project-discussion/components/discussion-reply-reply-modal/discussion-reply-reply-modal.component';
import { DocumentsAddModalComponent } from './pages/project-details/project-documents/documents-add-modal/documents-add-modal/documents-add-modal.component';
import { ThePreviewComponentComponent } from './components/project-management-preview/preview component/the-preview-component/the-preview-component.component';
import { ProjectManagementOverviewComponent } from './pages/project-management-overview/project-management-overview.component';
import { TimeTrackerComponent } from './pages/time-tracker/time-tracker.component';
import { TimeTrackerListComponent } from './pages/time-tracker/time-tracker-list/time-tracker-list.component';
import { AddTimeTrackerComponent } from './components/add-time-tracker/add-time-tracker.component';
import { TimeTrackerDetailsComponent } from './pages/time-tracker/time-tracker-details/time-tracker-details.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ProjectTimeTrackerDetailsComponent } from './components/project-time-tracker-details/project-time-tracker-details.component';
import { TimeTrackerDetailsLoaderComponent } from './loaders/time-tracker-details-loader/time-tracker-details-loader.component';
import { ProjectActivityModalComponent } from './components/projects/project-activity-modal/project-activity-modal.component';
import { ReportsComponent } from './pages/reports/reports.component';



@NgModule({
  declarations: [
    ProjectsComponent,
    TasksComponent,
    ProjectDetailsComponent,
    ProjectInfoComponent,
    ProjectHlPlanComponent,
    ProjectTasksComponent,
    ProjectMembersComponent,
    ProjectDocumentsComponent,
    ProjectMeetingsComponent,
    ProjectRisksComponent,
    ProjectScopeComponent,
    ProjectDeliverableComponent,
    ProjectDiscussionComponent,
    ProjectSettingsComponent,
    ProjectCostComponent,
    ProjectSettingsModulesComponent,
    ProjectSettingsIssueCategoryComponent,
    ProjectSettingsCategoryComponent,
    ProjectSettingsSettingsComponent,
    ProjectModalComponent,
    SimpleTableLoaderComponent,
    ProjectSettingsIssueCategoryModalComponent,
    ProjectIssueCategoryLoaderComponent,
    PmFilePreviewModalComponent,
    ProjectDeliverableModalComponent,
    
    PmSettingsCategoryModalComponent,
    PmSettingsCategoryLoaderComponent,
    PmTaskModalComponent,
    ProjectDiscussionModalComponent,
    ProjectManagementPreviewComponent,
    DiscussionDetailsComponent,
    TasksListComponent,
    TaskDetailsComponent,
    DiscussionRepliesModalComponent,
    DiscussionReplyReplyModalComponent,
    DocumentsAddModalComponent,
    ThePreviewComponentComponent,
    ProjectManagementOverviewComponent,
    TimeTrackerComponent,
    TimeTrackerListComponent,
    AddTimeTrackerComponent,
    TimeTrackerDetailsComponent,
    ProjectTimeTrackerDetailsComponent,
    TimeTrackerDetailsLoaderComponent,
    ProjectActivityModalComponent,
    ReportsComponent,
    
    
 
  ],
  imports: [
    CommonModule,
    // CustomerEngagementModule,
    ProjectManagementRoutingModule,
    SharedModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ]
})
export class ProjectManagementModule { }
