import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeRequestDashboardComponent } from './pages/project-dashboard/change-request-dashboard/change-request-dashboard.component';
import { ProjectClosureDashboardComponent } from './pages/project-dashboard/project-closure-dashboard/project-closure-dashboard.component';
import { ProjectDashboardComponent } from './pages/project-dashboard/project-dashboard.component';
import { ProjectChangeRequestListComponent } from './pages/project-information/pm-change-requests/pages/project-change-request-list/project-change-request-list.component';
import { PmCorrectiveActionDetailsComponent } from './pages/project-information/pm-corrective-action/pages/pm-corrective-action-details/pm-corrective-action-details.component';
import { PmCorrectiveActionListComponent } from './pages/project-information/pm-corrective-action/pages/pm-corrective-action-list/pm-corrective-action-list.component';
import { PmCorrectiveActionComponent } from './pages/project-information/pm-corrective-action/pm-corrective-action.component';
import { PmIssueListComponent } from './pages/project-information/pm-issues/pages/pm-issue-list/pm-issue-list.component';
import { PmIssuesComponent } from './pages/project-information/pm-issues/pm-issues.component';
import { ProjectClosureListComponent } from './pages/project-information/project-closure/project-closure-list/project-closure.component';
import { MilestoneProgressUpdateComponent } from './pages/project-information/project-details/milestone-progress-update/milestone-progress-update.component';
import { ProjectAssumptionsComponent } from './pages/project-information/project-details/project-assumptions/project-assumptions.component';
import { ProjectBudgetComponent } from './pages/project-information/project-details/project-budget/project-budget.component';
import { AddChangeRequestItemsComponent } from './pages/project-information/project-details/project-change-request/add-change-request-items/add-change-request-items.component';
import { ChangeRequestDetailsComponent } from './pages/project-information/project-details/project-change-request/change-request-details/change-request-details.component';
import { ChangeRequestListComponent } from './pages/project-information/project-details/project-change-request/change-request-list/change-request-list.component';
import { EditChangeRequestComponent } from './pages/project-information/project-details/project-change-request/edit-change-request/edit-change-request.component';
import { ProjectClosureDetailsComponent } from './pages/project-information/project-details/project-closure/project-closure-details/project-closure-details.component';
import { ProjectClosureComponent } from './pages/project-information/project-details/project-closure/project-closure-list/project-closure.component';
import { ProjectDetailsComponent } from './pages/project-information/project-details/project-details.component';
import { ProjectDocumentComponent } from './pages/project-information/project-details/project-document/project-document.component';
import { ProjectInfoComponent } from './pages/project-information/project-details/project-info/project-info.component';
import { ProjectIssueCaComponent } from './pages/project-information/project-details/project-issue/project-issue-details/project-issue-ca/project-issue-ca.component';
import { ProjectIssueDetailsComponent } from './pages/project-information/project-details/project-issue/project-issue-details/project-issue-details.component';
import { ProjectIssueInfoComponent } from './pages/project-information/project-details/project-issue/project-issue-details/project-issue-info/project-issue-info.component';
import { ProjectIssueComponent } from './pages/project-information/project-details/project-issue/project-issue-list/project-issue.component';
import { ProjectMilestoneComponent } from './pages/project-information/project-details/project-milestone/project-milestone.component';
import { ProjectOutInscopeComponent } from './pages/project-information/project-details/project-out-inscope/project-out-inscope.component';
import { ProjectRiskComponent } from './pages/project-information/project-details/project-risk/project-risk.component';
import { ProjectScopeOfWorkComponent } from './pages/project-information/project-details/project-scope-of-work/project-scope-of-work.component';
import { ProjectStakeholderComponent } from './pages/project-information/project-details/project-stakeholder/project-stakeholder.component';
import { ProjectStrategicAlignmentComponent } from './pages/project-information/project-details/project-strategic-alignment/project-strategic-alignment.component';
import { ProjectTeamComponent } from './pages/project-information/project-details/project-team/project-team.component';
import { ProjectInformationComponent } from './pages/project-information/project-information.component';
import { ProjectMonitoringListComponent } from './pages/project-information/project-monitoring-list/project-monitoring-list.component';
import { ProjectCountListComponent } from './pages/project-information/project-report/project-count-list/project-count-list.component';
import { ProjectCountTypeComponent } from './pages/project-information/project-report/project-count-type/project-count-type.component';
import { ProjectReportComponent } from './pages/project-information/project-report/project-report.component';
import { ProjectMonitoringOverviewComponent } from './pages/project-monitoring-overview/project-monitoring-overview.component';
import { ProjectMonitoringWorkflowEngineComponent } from './pages/project-monitoring-workflow-engine/project-monitoring-workflow-engine.component';
import { ProjectWorkflowDetailsComponent } from './pages/project-monitoring-workflow-engine/project-workflow-details/project-workflow-details.component';
import { ProjectWorkflowListComponent } from './pages/project-monitoring-workflow-engine/project-workflow-list/project-workflow-list.component';

const routes: Routes = [

  {
  path: 'dashboard',
  component: ProjectDashboardComponent,
  data: {
    core: { title: 'Dashboard'},
    breadcrumb: 'Dashboard'
  } 
  },
  {
    path: 'user-guides',
    component: ProjectMonitoringOverviewComponent,
    data: {
      core: { title: 'Overview'},
      // breadcrumb: null
    } 
    },
  {
    path: 'project-closure-dashboard',
    component: ProjectClosureDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
    }
  },
  {
    path: 'change-request-dashboard',
    component: ChangeRequestDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
    }
  },
  {
    path: 'projects',
    component: ProjectInformationComponent,
		data: {
			core: { title: 'Project List' },
			breadcrumb: 'Project List'
		},
    children : [
      {
        path: '',
        component: ProjectMonitoringListComponent,
        data: {
          core: { title: 'Project List' },
        },
      },
      {
        path: ':id',
        component: ProjectDetailsComponent,
        data: {
          core: { title: 'Project Details' },
        },
        children:[
          {
            path: '',
            component: ProjectInfoComponent,
            data: {
              core: { title: 'Project Info' },
            },
          },
          {
            path: 'milestone',
            component: ProjectMilestoneComponent,
            data: {
              core: { title: 'Project Milestone' },
            },
          },
          {
            path: 'scopes',
            component: ProjectScopeOfWorkComponent,
            data: {
              core: { title: 'Project Scope Of Work' },
            },
          },
          {
            path: 'in-scope',
            component: ProjectScopeOfWorkComponent,
            data: {
              core: { title: 'Project In Scope' },
            },
          },
          {
            path: 'out-scope',
            component: ProjectOutInscopeComponent,
            data: {
              core: { title: 'Project Out Scope' },
            },
          },
          {
            path: 'assumptions',
            component: ProjectAssumptionsComponent,
            data: {
              core: { title: 'Project Assumptions' },
            },
          },
          {
            path: 'strategic-alignment',
            component: ProjectStrategicAlignmentComponent,
            data: {
              core: { title: 'Project Strategic Alignment' },
            },
          },
          {
            path: 'stakeholders',
            component: ProjectStakeholderComponent,
            data: {
              core: { title: 'Project Stakeholder' },
            },
          },
          {
            path: 'documents',
            component: ProjectDocumentComponent,
            data: {
              core: { title: 'Project Documents' },
            },
          },
          {
            path: 'project-team',
            component: ProjectTeamComponent,
            data: {
              core: { title: 'Project Team' },
            }
          },
          {
            path: 'budgets',
            component: ProjectBudgetComponent,
            data: {
              core: { title: 'Project Budgets' },
            },
          },
          {
            path: 'risk-management',
            component: ProjectRiskComponent,
            data: {
              core: { title: 'Project Risk' },
            },
          },
          {
            path: 'issues-list',
            component: ProjectIssueComponent,
            data: {
              core: { title: 'Project Issue' },
            },
          },
          {
            path: 'project-closure',
            component: ProjectClosureComponent,
            data: {
              core: { title: 'Project Closure' },
            },
          },
          {
            path: 'change-request',
            component: ChangeRequestListComponent,
            data: {
              core: { title: 'Project Change Request' },
            },
          },
          {
            path: 'milestone-progress',
            component: MilestoneProgressUpdateComponent,
            data: {
              core: { title: 'Milestone progress' },
            },
          },
       
        ]
      },
    ]
   
  
  },

  {
    path: 'projects/:id/issue/:id',
    component: ProjectIssueDetailsComponent,
        data: {
          core: { title: 'Project Issue Details' },
        },
        children:[
          {
            path: "",
            component: ProjectIssueInfoComponent,
            data:{
              core:{title: 'Project Issue Details'}
            }
          },
          {
            path: "corrective-action",
            component: ProjectIssueCaComponent,
            data:{
              core:{title: 'Project Corrective Action'}
            }
          },
        ]
  },
  {
    path: 'projects/:id/project-closure/:id',
    component: ProjectClosureDetailsComponent,
        data: {
          core: { title: 'Project Closure Details' },
        }
  },
  {
    path: 'projects/:id/project-change-request/:requestId',
    component: ChangeRequestDetailsComponent,
        data: {
          core: { title: 'Project Change Request Details' },
        }
  },
  {
    path: 'projects/:id/change-request/add',
    component: AddChangeRequestItemsComponent,
    data: {
      core: { title: 'Project Change Request' },
    },
  },
  {
    path: 'projects/:id/change-request/edit',
    component: EditChangeRequestComponent,
    data: {
      core: { title: 'Edit project Change Request' },
    },
  },
  {
    path: 'Workflow',
    component: ProjectMonitoringWorkflowEngineComponent,
    children: [
      {
        path: "",
        component: ProjectWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: ProjectWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  },
  {
		path: 'projects-issue-corrective-actions',
		component: PmCorrectiveActionComponent,
		children: [
			{
				path: '',
				component: PmCorrectiveActionListComponent,
				data: {
          core: { title: 'Corrective Actions' },
          breadcrumb: 'corrective_actions'		
    		},
			},
			{
				path: ':id',
				component: PmCorrectiveActionDetailsComponent,
				data: {
					core: { title: "Corrective Action Details" },

				},
			}
		]
	},
  {
		path: 'issues',
		component: PmIssuesComponent,
		children: [
			{
				path: '',
				component: PmIssueListComponent,
				data: {
          core: { title: 'Issues' },
          breadcrumb: 'Issues'		
    		},
			},
			// {
			// 	path: ':id',
			// 	component: PmCorrectiveActionDetailsComponent,
			// 	data: {
			// 		core: { title: "Corrective Action Details" },

			// 	},
			// }
		]
	},
  {
		path: 'project-closures',
		component: PmIssuesComponent,
		children: [
			{
				path: '',
				component: ProjectClosureListComponent,
				data: {
          core: { title: 'Project Closure' },
          breadcrumb: 'Project Closure'		
    		},
			},
		]
	},
  {
		path: 'change-request',
		component: ProjectChangeRequestListComponent,
		data: {
      core: { title: 'Project Change Request' },
      breadcrumb: 'Project Change Request'		
    },
	},
  {
    path: 'reports',
    component: ProjectReportComponent,
    data: {
      core: { title: 'Project Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: ProjectCountTypeComponent,
    data: {
      core: { title: 'Project Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: ProjectCountListComponent,
    data: {
      core: { title: 'Project Count List' },
    },
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectMonitoringRoutingModule { }
