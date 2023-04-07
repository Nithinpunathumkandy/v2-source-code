import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalAuditListComponent } from './pages/external-audit/external-audit-list/external-audit-list.component';
import { ExternalAuditDashboardComponent } from './pages/external-audit-dashboard/external-audit-dashboard.component';
import { ExternalAuditComponent } from './pages/external-audit/external-audit.component';
import { ExternalAuditDetailsComponent } from './pages/external-audit/external-audit-details/external-audit-details.component';
import { ExternalAuditInfoComponent } from './pages/external-audit/external-audit-details/external-audit-info/external-audit-info.component';
import { FindingsComponent } from './pages/external-audit/external-audit-details/findings/findings.component';
import { AddExternalAuditComponent } from './pages/external-audit/add-external-audit/add-external-audit.component';
import { EditExternalAuditComponent } from './pages/external-audit/edit-external-audit/edit-external-audit.component';
import { AuditFindingsComponent } from './pages/audit-findings/audit-findings.component';
import { AuditFindingListComponent } from './pages/audit-findings/audit-finding-list/audit-finding-list.component';
import { AddFindingsComponent } from './pages/audit-findings/add-findings/add-findings.component';
import { EditFindingsComponent } from './pages/audit-findings/edit-findings/edit-findings.component';
import { AuditFindingsDetailsComponent } from './pages/audit-findings/audit-findings-details/audit-findings-details.component';
import { AuditFindingInfoComponent } from './pages/audit-findings/audit-findings-details/audit-finding-info/audit-finding-info.component';
import { RootCauseAnalysisComponent } from './pages/audit-findings/audit-findings-details/root-cause-analysis/root-cause-analysis.component';
import { ImpactAnalysisComponent } from './pages/audit-findings/audit-findings-details/impact-analysis/impact-analysis.component';
import { CorrectiveActionComponent } from './pages/audit-findings/audit-findings-details/corrective-action/corrective-action.component';
import { ImpactAnalysisDetailsComponent } from './pages/audit-findings/audit-findings-details/impact-analysis/impact-analysis-details/impact-analysis-details.component';
import { CorrectiveActionsComponent } from './pages/corrective-actions/corrective-actions.component';
import { CorrectiveActionsListComponent } from './pages/corrective-actions/corrective-actions-list/corrective-actions-list.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-actions/corrective-action-details/corrective-action-details.component';
import { EaFindingAddComponent } from './pages/external-audit/ea-finding-add/ea-finding-add.component';
import { ExternalReportComponent } from './pages/external-report/external-report.component';
import { ExternalCountTypeComponent } from './pages/external-report/external-count-type/external-count-type.component';
import { ExternalCountListComponent } from './pages/external-report/external-count-list/external-count-list.component';
import { EaFindingEditComponent } from './pages/external-audit/ea-finding-edit/ea-finding-edit.component';
import { FindingDetailsDashboardComponent } from './pages/external-audit/finding-details-dashboard/finding-details-dashboard.component';
import { DashboardExternalAuditComponent } from './pages/dashboard-external-audit/dashboard-external-audit.component';
import { EaDashboardFindingDetailsComponent } from './pages/external-audit/ea-dashboard-finding-details/ea-dashboard-finding-details.component';
import { EaDashboardPendingCaComponent } from './pages/external-audit/ea-dashboard-pending-ca/ea-dashboard-pending-ca.component';
import { ExternalAuditOverviewComponent } from './pages/external-audit-overview/external-audit-overview.component';


const routes: Routes = [

  {
    path: "",
    redirectTo: "dashboard",
  },

  {
    path: "dashboard",
    component: DashboardExternalAuditComponent,
    data: {
      core: { title: "Dashboard" },
      breadcrumb: 'external_audit_dashboard',

    }
  },
  {
    path: "user-guides",
    component: ExternalAuditOverviewComponent,
    data: {
      core: { title: "External Audit Overview" },
      // breadcrumb: 'external_audit_overview',

    }
  }, 
  {
    path: 'finding-details',
    component: EaDashboardFindingDetailsComponent,
    data: {
      core: { title: 'Dashboard' },
    }
  },
  {
    path: 'pending-ca',
    component: EaDashboardPendingCaComponent,
    data: {
      core: { title: 'Dashboard' },
    }
  },{
    path: "external-audit",
    component: ExternalAuditComponent,
    data: {
      core: { title: "External Audit" },
      breadcrumb: 'external_audit'
    },

    children: [
      {
        path: "",
        component: ExternalAuditListComponent,
        data: {
          core: { title: "External Audit List" },
          breadcrumb: 'external_audit'
        },
      }, {
        path: "add-external-audit",
        component: AddExternalAuditComponent,
        data: {
          core: { title: "Add External Audit" }
        },

      }, 
      {

        path: "edit-external-audit",
        component: EditExternalAuditComponent,
        data: {
          core: { title: "Edit External Audit" }
        },

      },{
        path:"add-ea-findings",
        component:EaFindingAddComponent
      },
      {
        path:"edit-findings",
        component:EaFindingEditComponent
      },
      {
        path: ":id",
        component: ExternalAuditDetailsComponent,
        children: [
          {
            path: "",
            component: ExternalAuditInfoComponent,
            data: {
              core: { title: "Info" },
            },
          }, {
            path: "findings",
            component: FindingsComponent,
            data: {
              core: { title: "Findings" },
            },

          }
        ]
      }
    ]
  }, {
    path: "audit-findings",
    component: AuditFindingsComponent,
    data: {
      core: { title: "Audit Findings" },
      breadcrumb: 'audit_findings'
    },

    children: [
      {
        path: "",
        component: AuditFindingListComponent,
        data: {
          core: { title: "Audit Finding List" },
          breadcrumb: 'audit_findings'
        },
      }, {
        path: "add-findings",
        component: AddFindingsComponent,
        data: {
          core: { title: "Add Findings" },
        },
       
    

      }, 

      {

        path: "edit-findings",
        component: EditFindingsComponent,
        data: {
          core: { title: "Edit Findings" }
        },

      },
      {
        path: ":id",
        component: AuditFindingsDetailsComponent,
        children: [
          {
            path: "",
            component: AuditFindingInfoComponent,
            data: {
              core: { title: "Info" },
            },
          }, {
            path: "finding-root-cause-analyses",
            component: RootCauseAnalysisComponent,
            data: {
              core: { title: "RCA" },
            }
          },{
            path: "impact-analyses",
            component: ImpactAnalysisComponent,
            data: {
              core: { title: "IA" },
            }

          },
          {
            path: "impact-analysis-details",
            component: ImpactAnalysisDetailsComponent,
            data: {
              core: { title: "IA Details" },
            },
    
          }, 
  
          {
            path: "corrective-actions",
            component: CorrectiveActionComponent,
            data: {
              core: { title: "CA" },
            }
          }
        ]
      }


    ]



  }, {
    path: "corrective-action",
    component: CorrectiveActionsComponent,
    data: {
      core: { title: "Corrective Actions" },
      breadcrumb: 'corrective_actions',

    } ,
    children :[
      {
        path:"",
        component:CorrectiveActionsListComponent,
        data: {
          core: { title: "Corrective Actions List" },
          breadcrumb: 'corrective_actions',
        } ,
      },{

        path: "findings/:finding_id/corrective-actions/:id",
        component: CorrectiveActionDetailsComponent,
        data: {
          core: { title: "Corrective Action Details" }
        },

      }
    ]
  },
  {
    path: 'reports',
    component: ExternalReportComponent,
    data: {
      core: { title: 'Audit Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: ExternalCountTypeComponent,
    data: {
      core: { title: 'Audit Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: ExternalCountListComponent,
    data: {
      core: { title: 'Audit Count List' },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalAuditRoutingModule { }

