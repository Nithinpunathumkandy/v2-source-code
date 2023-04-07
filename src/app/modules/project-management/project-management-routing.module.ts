import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectManagementPermissionGuard } from './guard/project-management-permission.guard';
import { ProjectCostComponent } from './pages/project-details/project-cost/project-cost.component';
import { ProjectDeliverableComponent } from './pages/project-details/project-deliverable/project-deliverable.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectDiscussionComponent } from './pages/project-details/project-discussion/project-discussion.component';
import { ProjectDocumentsComponent } from './pages/project-details/project-documents/project-documents.component';
import { ProjectHlPlanComponent } from './pages/project-details/project-hl-plan/project-hl-plan.component';
import { ProjectInfoComponent } from './pages/project-details/project-info/project-info.component';
import { ProjectMeetingsComponent } from './pages/project-details/project-meetings/project-meetings.component';
import { ProjectMembersComponent } from './pages/project-details/project-members/project-members.component';
import { ProjectRisksComponent } from './pages/project-details/project-risks/project-risks.component';
import { ProjectScopeComponent } from './pages/project-details/project-scope/project-scope.component';
import { ProjectSettingsCategoryComponent } from './pages/project-details/project-settings/project-settings-category/project-settings-category.component';
import { ProjectSettingsIssueCategoryComponent } from './pages/project-details/project-settings/project-settings-issue-category/project-settings-issue-category.component';
import { ProjectSettingsModulesComponent } from './pages/project-details/project-settings/project-settings-modules/project-settings-modules.component';
import { ProjectSettingsSettingsComponent } from './pages/project-details/project-settings/project-settings-settings/project-settings-settings.component';
import { ProjectSettingsComponent } from './pages/project-details/project-settings/project-settings.component';
import { ProjectTasksComponent } from './pages/project-details/project-tasks/project-tasks.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TaskDetailsComponent } from './pages/tasks/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks/task-list/task-list.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import {DiscussionDetailsComponent} from './pages/project-details/project-discussion/components/discussion-details/discussion-details.component';
import { ProjectManagementOverviewComponent } from './pages/project-management-overview/project-management-overview.component';
import { TimeTrackerComponent } from './pages/time-tracker/time-tracker.component';
import { TimeTrackerListComponent } from './pages/time-tracker/time-tracker-list/time-tracker-list.component';
import { TimeTrackerDetailsComponent } from './pages/time-tracker/time-tracker-details/time-tracker-details.component';
import { ReportsComponent } from './pages/reports/reports.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: {
      core: { title: 'Projects' },
      breadcrumb: 'projects'
    },
  },
  {
    path: 'user-guides',
    component: ProjectManagementOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb: 'overview'
    },
  },
  {
    path: 'projects/:id',
    component: ProjectDetailsComponent,
    children: [
      {
        path: '',
        component: ProjectInfoComponent,
        data: {
          core: { title: 'info' },
          type: 'info'
        },
      },
  
      {
        path: 'hl-plan',
        component: ProjectHlPlanComponent,
        data: {
          core: { title: 'HL Plan' },
          type: 'high-level-plan',
        },
        canActivate: [ProjectManagementPermissionGuard],
      },
      {
        path: 'tasks',
        component: ProjectTasksComponent,
        data: {
          core: { title: 'Tasks' },
          type: 'task',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'members',
        component: ProjectMembersComponent,
        data: {
          core: { title: 'Members' },
          type: 'member',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'documents',
        component: ProjectDocumentsComponent,
        data: {
          core: { title: 'Documents' },
          type: 'document',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'meetings',
        component: ProjectMeetingsComponent,
        data: {
          core: { title: 'Meetings' },
          type: 'meeting',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'risks',
        component: ProjectRisksComponent,
        data: {
          core: { title: 'Risks' },
          type: 'risk',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'scope',
        component: ProjectScopeComponent,
        data: {
          core: { title: 'Scope' },
          type: 'scope',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'deliverable',
        component: ProjectDeliverableComponent,
        data: {
          core: { title: 'Project Deliverable' },
          type: 'deliverable',
        },
        canActivate: [ProjectManagementPermissionGuard],
      }, {
        path: 'discussion',
        component: ProjectDiscussionComponent,
        data: {
          core: { title: 'Discussion' },
          type: 'discussion',
        },
        canActivate: [ProjectManagementPermissionGuard],
      },
      {
        path: 'discussion/:id',
        component: DiscussionDetailsComponent,
        data: {
          core: { title: 'Details' },
          type: 'discussion',
        },
        canActivate: [ProjectManagementPermissionGuard],
      },

      {
        path: 'cost',
        component: ProjectCostComponent,
        data: {
          core: { title: 'Cost' },
          type: 'cost',
        },
        canActivate: [ProjectManagementPermissionGuard],
      },
      {
        path: 'settings',
        component: ProjectSettingsComponent,
        data: {
          core: { title: 'Settings' },
          type: 'setting',
        },
        canActivate: [ProjectManagementPermissionGuard],
        children: [
          {
            path:'',
            pathMatch:'full',
            redirectTo:'modules'
          },
          {
            path: 'modules',
            component: ProjectSettingsModulesComponent,
            data: {
              core: { title: 'Settings - Modules' }
            }
          },
          {
            path: 'issue-category',
            component: ProjectSettingsIssueCategoryComponent,
            data: {
              core: { title: 'Settings - Issue Category' }
            }
          },
          {
            path: 'category',
            component: ProjectSettingsCategoryComponent,
            data: {
              core: { title: 'Settings - Category' }
            }
          },
          {
            path: 'settings',
            component: ProjectSettingsSettingsComponent,
            data: {
              core: { title: 'Settings' }
            }
          }
        ]
      },
    ]
  },

  // task start here
  {
    path: 'tasks',
    component: TasksComponent,
    children: [
      {
        path: "",
        component: TasksListComponent,
        data: {
          core: { title: 'Task List' },
          breadcrumb: 'tasks'
        }
      },
      {
        path: ':id',
        component: TaskDetailsComponent,
        data: {
          core: { title: 'Task Details' },
          breadcrumb: null
        }
      },
    ]
  },
  // task end here

   // task start here
   {
    path: 'project-time-trackers',
    component: TimeTrackerComponent,
    children: [
      {
        path: "",
        component: TimeTrackerListComponent,
        data: {
          core: { title: 'Time Tracker List' },
          breadcrumb: 'time-tracker'
        }
      },
      {
        path:':id',
        component: TimeTrackerDetailsComponent,
        data: {
          core: { title: 'Time Tracker Details' },
          breadcrumb: 'time-tracker-details'
        }
      },
    ]
  },
  // task end here

  //reports start
  {
    path: 'project-time-tracker-reports',
    component: ReportsComponent,
    // data: {
    //   core: { title: 'Reports' },
    // },
  }
  //reports end


]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagementRoutingModule { }
