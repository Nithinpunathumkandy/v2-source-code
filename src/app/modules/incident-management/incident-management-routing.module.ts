import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddIncidentComponent } from './pages/incident/pages/add-incident/add-incident.component';
import { EditIncidentComponent } from './pages/incident/pages/edit-incident/edit-incident.component';
import { IncidentCorrectiveActionsComponent } from './pages/incident/pages/incident-details/incident-corrective-actions/incident-corrective-actions.component';
import { IncidentDetailsComponent } from './pages/incident/pages/incident-details/incident-details.component';
import { IncidentMappingComponent } from './pages/incident/pages/incident-details/incident-mapping/incident-mapping.component';
import { InfoComponent } from './pages/incident/pages/incident-details/info/info.component';
import { InvestigationDetailsComponent } from './pages/incident/pages/incident-details/investigation-details/investigation-details.component';
import { InvestigatorComponent } from './pages/incident/pages/incident-details/investigator/investigator.component';
import { RootCauseAnalysisComponent } from './pages/incident/pages/incident-details/root-cause-analysis/root-cause-analysis.component';
import { IncidentListComponent } from './pages/incident/pages/incident-list/incident-list.component';
import { InvestigationListComponent } from './pages/investigation/pages/investigation/investigation-list/investigation-list.component';
import { InvestigationComponent } from './pages/investigation/pages/investigation/investigation.component';
import { CorrectiveActionComponent } from './pages/corrective-action/corrective-action.component';
import { AddCorrectiveActionComponent } from './pages/corrective-action/pages/add-corrective-action/add-corrective-action.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-action/pages/corrective-action-details/corrective-action-details.component';
import { CorrectiveActionListComponent } from './pages/corrective-action/pages/corrective-action-list/corrective-action-list.component';
import { IncidentTemplateDetailsComponent } from './pages/template/pages/incident-template-details/incident-template-details.component';
import { TemplateListComponent } from './pages/template/pages/template-list/template-list.component';
import { IncidentWorkflowListComponent } from './pages/incident-workflow/pages/incident-workflow-list/incident-workflow-list.component';
import { IncidentWorkflowDetailsComponent } from './pages/incident-workflow/pages/incident-workflow-details/incident-workflow-details.component';
import { InvestigationDetailComponent } from './pages/investigation/pages/investigation/investigation-detail/investigation-detail.component';
import { IncidentReportListComponent } from './pages/report/pages/incident-report-list/incident-report-list.component';
import { MainReportComponent } from './pages/report/pages/main-report/main-report.component';
import { IncidentDashboardComponent } from './pages/incident-dashboard/pages/incident-dashboard/incident-dashboard.component';
import { IncidentReportComponent } from './pages/incident-report/incident-report.component';
import { IncidentCountTypeComponent } from './pages/incident-report/incident-count-type/incident-count-type.component';
import { IncidentCountListComponent } from './pages/incident-report/incident-count-list/incident-count-list.component';
import { IncidentReportsComponent } from './pages/incident/pages/incident-details/incident-report/incident-report.component';
import { IncidentManagementOverviewComponent } from './pages/incident-management-overview/incident-management-overview.component';
import { InvestigationAddModalComponent } from './pages/incident/components/investigation-add-modal/investigation-add-modal.component';
import { InvestigationEditModalComponent } from './pages/incident/components/investigation-edit-modal/investigation-edit-modal.component';


const routes: Routes = [
	{
		path: 'incidents',
		component: IncidentListComponent,
		data: {
			core: { title: 'Incidents' },
			breadcrumb: 'incident_list'

		},
	},
	{
		path: 'user-guides',
		component: IncidentManagementOverviewComponent,
		data: {
			core: { title: 'Overview' },
			// breadcrumb: 'overview'

		},
	},
	{
		path: 'incident-workflows',
		component: IncidentWorkflowListComponent,
		data: {
			core: { title: 'Workflow Engine' },
			breadcrumb: 'workflow_engine'
		}
	},
	{
		path: 'incident-workflows/:id',
		component: IncidentWorkflowDetailsComponent,
		data: {
			core: { title: 'Workflow Engine' }
		}
	},
	{
		path: 'incident-report-templates',
		component: TemplateListComponent,
		data: {
			core: { title: 'Template' },
			breadcrumb: 'templates'
		}
	},
	{
		path: 'incident-report-templates/:id',
		component: IncidentTemplateDetailsComponent,
		data: {
			core: { title: 'Template Details' },
		}
	},
	{
		path: 'incident-reports',
		component: IncidentReportListComponent,
		data: {
			core: { title: 'Incident Report' },
			breadcrumb: 'reports'
		}
	},
	{
		path: 'incident-reports/:id',
		component: MainReportComponent,
		data: {
			core: { title: 'Reports' },
			breadcrumb: 'reports'
		}
	},

	{
		path: 'dashboard',
		component: IncidentDashboardComponent,
		data: {
			core: { title: 'Dashboard' },
		}
	},
	{
		path: 'incident-corrective-actions',
		component: CorrectiveActionComponent,
		data: {
			core: { title: 'Corrective Action' },
			breadcrumb: 'corrective_actions'
		},
		children: [
			{
				path: '',
				component: CorrectiveActionListComponent,
				data: {
					core: { title: "Corrective Actions" }
				},
			},
			{
				path: ':id',
				component: CorrectiveActionDetailsComponent,
				data: {
					core: { title: "Corrective Action Details" },

				},
			}
		]
	},
	{
		path: 'add-corrective-action',
		component: AddCorrectiveActionComponent,
		data: {
			core: { title: 'Add Corrective Action' },
		}
	},
	{
		path: 'incident-investigations',
		component: InvestigationComponent,
		data: {
			core: { title: 'Investigations' },
		},
		children: [
			{
				path: '',
				component: InvestigationListComponent,
				data: {
					core: { title: 'Investigations' },
					breadcrumb: 'investigation'
				},
				
			},
			{
				path: ':id',
				component: InvestigationDetailComponent,
				data: {
					core: { title: 'Investigations' },
				},
				
			},
		]
	},
	{
		path: 'add-incident',
		component: AddIncidentComponent,
		data: {
			core: { title: 'Add Incident' },
		}
	},
	{
		path: 'edit-incident',
		component: EditIncidentComponent,
		data: {
			core: { title: 'Edit Incident' },
		}
	},
	{
		path: 'reports',
		component: IncidentReportComponent,
		data: {
		  core: { title: 'Incident Reports' },
		  breadcrumb: 'reports'
		},
	  },
	  {
		path: 'reports/:riskcountType',
		component: IncidentCountTypeComponent,
		data: {
		  core: { title: 'Incident Count Type' },
		},
	  },
	  {
		path: 'reports/:riskcountType/:id',
		component: IncidentCountListComponent,
		data: {
		  core: { title: 'Incident Count List' },
		},
	  },
	//   {
	// 	path: "add-investigation",
	// 	component: InvestigationAddModalComponent,
	// 	data: {
	// 	  core: { title: "Add" },
	// 	},
	// },
	//   {
	// 	path: 'edit-investigation',
	// 	component: InvestigationEditModalComponent,
	// 	data: {
	// 		core: { title: 'Edit' },
	// 		breadcrumb: ''
	// 	}
	//   },
	{
		path: ':id',
		component: IncidentDetailsComponent,
		children: [
			{
				path: 'info',
				component: InfoComponent,
				data: {
					core: { title: "Incident Info" }
				}
			},

			{
				path: 'investigator',
				component: InvestigatorComponent,
				data: {
					core: { title: "Investigator" }
				}
			},
			{
				path: 'mapping',
				component: IncidentMappingComponent,
				data: {
					core: { title: "Mapping" }
				}
			},
			{
				path: 'investigation',
				component: InvestigationDetailsComponent,
				data: {
					core: { title: "Investigation" }
				}
			},
			{
				path: 'root-cause-analysis',
				component: RootCauseAnalysisComponent,
				data: {
					core: { title: "Root Cause Analysis" }
				}
			},
			{
				path: 'corrective-actions-list',
				component: IncidentCorrectiveActionsComponent,
				data: {
					core: { title: "Incident Corrective Actions" }
				}
			},
			{
				path: 'report-list',
				component: IncidentReportsComponent,
				data: {
					core: { title: "Incident Report" }
				}
			},
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class IncidentManagementRoutingModule { }
