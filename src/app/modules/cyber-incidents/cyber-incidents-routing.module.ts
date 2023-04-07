import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CyberIncidentComponent } from './pages/cyber-incident/cyber-incident.component';
import { CyberIncidentDetailsComponent } from './pages/cyber-incident/cyber-incident-details/cyber-incident-details.component';
import { CyberIncidentListComponent } from './pages/cyber-incident/cyber-incident-list/cyber-incident-list.component';
import { InfoComponent } from './pages/cyber-incident/cyber-incident-details/info/info.component';
import { RcaComponent } from './pages/cyber-incident/cyber-incident-details/rca/rca.component';
import { IaComponent } from './pages/cyber-incident/cyber-incident-details/ia/ia.component';
import { CaComponent } from './pages/cyber-incident/cyber-incident-details/ca/ca.component';
import { ReportComponent } from './pages/cyber-incident/cyber-incident-details/report/report.component';
import { WorkflowEngineComponent } from './pages/workflow-engine/workflow-engine.component';
import { WorkflowListComponent } from './pages/workflow-engine/workflow-list/workflow-list.component';
import { WorkflowDetailsComponent } from './pages/workflow-engine/workflow-details/workflow-details.component';
import { CorrectiveActionComponent } from './pages/corrective-action/corrective-action.component';
import { CorrectiveActionListComponent } from './pages/corrective-action/corrective-action-list/corrective-action-list.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-action/corrective-action-details/corrective-action-details.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CyberIncidentReportListComponent } from './pages/report/pages/cyber-incident-report-list/cyber-incident-report-list.component';
import { CyberIncidentReportDetailsComponent } from './pages/report/pages/cyber-incident-report-details/cyber-incident-report-details.component';
import { CyberIncidentDetailReportComponent } from './pages/report/pages/cyber-incident-detail-report/cyber-incident-detail-report.component';
import { CyberIncidentReportComponent } from './pages/report/cyber-incident-report.component';

const routes: Routes = [
  {
    path: "cyber-incidents",
    component: CyberIncidentComponent,
    data: {
      core: { title: "Incident" },
      breadcrumb: "incident",
    },
    children: [
      {
        path: "",
        component: CyberIncidentListComponent,
        data: {
          core: { title: "Incident List" },
          breadcrumb: "incident",
        },
      },
      {
        path: ":id",
        component: CyberIncidentDetailsComponent,
        data: {
          core: { title: "Incident Details" },
          breadcrumb: 'incident'
        },
        children: [
          {
            path: "",
            component: InfoComponent,
            data: {
              core: { title: "Incident Info" },
              breadcrumb: 'incident'
            },
          },
          {
            path: "rca",
            component: RcaComponent,
            data: {
              core: { title: "Incident RCA" },
              breadcrumb: 'incident'
            },
          },
          {
            path: "ia",
            component: IaComponent,
            data: {
              core: { title: "Incident IA" },
              breadcrumb: 'incident'
            },
          },
          {
            path: "ca",
            component: CaComponent,
            data: {
              core: { title: "Incident CA" },
              breadcrumb: 'incident'
            },
          },
          {
            path: "report",
            component: ReportComponent,
            data: {
              core: { title: "Incident Report" },
              breadcrumb: 'incident'
            },
          }
        ],
      },
    ],
  },
  {
    path: 'cyber-incident-workflows',
    component: WorkflowEngineComponent,
    children: [
      {
        path: "",
        component: WorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: WorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  },
  {
    path: 'cyber-incident-corrective-actions',
    component: CorrectiveActionComponent,
    data: {
      core: { title: 'Cyber Incident Corrective actions' },
    },
    children:[
      {
        path: '',
        component : CorrectiveActionListComponent,
        data: {
          core: { title: "Cyber Incident Corrective actions" },
          breadcrumb: 'corrective_action'
        },
      },
      {
        path: ":id",
        component: CorrectiveActionDetailsComponent,
        data: {
          core: { title: 'Cyber Incident Corrective action Details' },
          breadcrumb: 'corrective_action'
        },
      },
    ]
  },
  {
		path: 'dashboard',
		component: DashboardComponent,
		data: {
			core: { title: 'Dashboard' },
		}
	},
  {
    path: 'reports',
    component: CyberIncidentReportComponent,
    data: {
      core: { title: 'reports' },
      breadcrumb: 'reports'
  },
  children:[
    {
       path: "",
       component: CyberIncidentReportListComponent,
       data: {
        core: { title: "reports" },
        breadcrumb: 'reports'
      },
    },
    {
      path: ":riskcountType",
      component: CyberIncidentReportDetailsComponent,
      data: {
       core: { title: "Reports Details" },
      }
    },
    {
      path: ':riskcountType/:id',
      component: CyberIncidentDetailReportComponent,
      data: {
        core: { title: 'Cyber Incident Count List' },
      },
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CyberIncidentsRoutingModule { }
