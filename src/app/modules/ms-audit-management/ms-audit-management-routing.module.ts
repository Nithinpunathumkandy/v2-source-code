import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsAuditCheckListComponent } from './pages/ms-audit-check-list/ms-audit-check-list.component';
import { AuditCheckListComponent } from './pages/ms-audit/ms-audit-details/audit-check-list/audit-check-list.component';
import { MsAuditPlansDetialsComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/ms-audit-plans-detials.component';
import { MsAuditPlansInfoComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/ms-audit-plans-info/ms-audit-plans-info.component';
import { MsAuditPlansListComponent } from './pages/ms-audit-plans/ms-audit-plans-list/ms-audit-plans-list.component';
import { MsAuditPlansComponent } from './pages/ms-audit-plans/ms-audit-plans.component';
import { InfoComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/info/info.component';
import { MsAuditProgramsDetialsComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/ms-audit-programs-detials.component';
import { MsAuditProgramsListComponent } from './pages/ms-audit-programs/ms-audit-programs-list/ms-audit-programs-list.component';
import { MsAuditProgramsComponent } from './pages/ms-audit-programs/ms-audit-programs.component';
import { MsAuditSchedulesDetialsComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedules-detials.component';
import { MsAuditSchedulesInfoComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedules-info/ms-audit-schedules-info.component';
import { MsAuditSchedulesListComponent } from './pages/ms-audit-schedules/ms-audit-schedules-list/ms-audit-schedules-list.component';
import { MsAuditSchedulesComponent } from './pages/ms-audit-schedules/ms-audit-schedules.component';
import { MsAuditTeamComponent } from './pages/ms-audit-team/ms-audit-team.component';
import { DocumentsComponent } from './pages/ms-audit/ms-audit-details/documents/documents.component';
import { MsAuditDetailsComponent } from './pages/ms-audit/ms-audit-details/ms-audit-details.component';
import { MsAuditInfoComponent } from './pages/ms-audit/ms-audit-details/ms-audit-info/ms-audit-info.component';
import { MsAuditListComponent } from './pages/ms-audit/ms-audit-list/ms-audit-list.component';
import { MsAuditComponent } from './pages/ms-audit/ms-audit.component';
import { AuditPlanComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/audit-plan/audit-plan.component';
import { SchedulesComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/schedules/schedules.component';
import { PlanSchedulesComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/plan-schedules/plan-schedules.component';
import { MsAuditTeamListComponent } from './pages/ms-audit-team/ms-audit-team-list/ms-audit-team-list.component';
import { MsAuditTeamDetailsComponent } from './pages/ms-audit-team/ms-audit-team-details/ms-audit-team-details.component';
import { AuditNonConfirmityComponent } from './pages/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-confirmity.component';
import { AuditNonConformityDetailsComponent } from './pages/ms-audit/ms-audit-details/audit-non-confirmity/audit-non-conformity-details/audit-non-conformity-details.component';
import { AuditFollowUpComponent } from './pages/ms-audit/ms-audit-details/audit-follow-up/audit-follow-up.component';
import { MsAuditFollowUpDetailsComponent } from './pages/ms-audit/ms-audit-follow-up-details/ms-audit-follow-up-details.component';
import { FollowUpInfoComponent } from './pages/ms-audit/ms-audit-follow-up-details/follow-up-info/follow-up-info.component';
import { AnnualSummaryComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/annual-summary/annual-summary.component';
import { FollowUpComponent } from './pages/ms-audit/ms-audit-follow-up-details/follow-up/follow-up.component';
import { AuditReportComponent } from './pages/ms-audit/ms-audit-details/audit-report/audit-report.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { AuditWorkflowEngineComponent } from './pages/audit-workflow-engine/audit-workflow-engine.component';
import { AuditWorkflowListComponent } from './pages/audit-workflow-engine/audit-workflow-list/audit-workflow-list.component';
import { AuditWorkflowDetailsComponent } from './pages/audit-workflow-engine/audit-workflow-details/audit-workflow-details.component';
import { MsAuditNonConfirmitiesComponent } from './pages/ms-audit-non-confirmities/ms-audit-non-confirmities.component';
import { NonConfirmitiesDetialsComponent } from './pages/ms-audit-non-confirmities/non-confirmities-detials/non-confirmities-detials.component';
import { NonConfirmitiesListComponent } from './pages/ms-audit-non-confirmities/non-confirmities-list/non-confirmities-list.component';
import { AuditProgramReportComponent } from './pages/ms-audit-programs/ms-audit-programs-detials/audit-report/audit-report.component';
import { SummaryReportComponent } from './pages/summary-report/summary-report.component';
import { SummaryReportListComponent } from './pages/summary-report/summary-report-list/summary-report-list.component';
import { SummaryReportInfoComponent } from './pages/summary-report/summary-report-info/summary-report-info.component';
import { ExportSummaryReortComponent } from './pages/summary-report/export-summary-reort/export-summary-reort.component';
import { CorrectiveActionListComponent } from './pages/corrective-actions/corrective-action-list/corrective-action-list.component';
import { MsAuditManagementOverviewComponent } from './pages/ms-audit-management-overview/ms-audit-management-overview.component';
import { MsAuditReportsComponent } from './pages/ms-audit-reports/ms-audit-reports.component';
import { MsAuditReportListComponent } from './pages/ms-audit-reports/pages/ms-audit-report-list/ms-audit-report-list.component';
import { MsAuditReportDetailsComponent } from './pages/ms-audit-reports/pages/ms-audit-report-details/ms-audit-report-details.component';
import { MsAuditDetailReportComponent } from './pages/ms-audit-reports/pages/ms-audit-detail-report/ms-audit-detail-report.component';
import { MsAuditScheduleChecklistComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedule-checklist/ms-audit-schedule-checklist.component';
import { MsAuditScheduleMsAuditComponent } from './pages/ms-audit/ms-audit-details/ms-audit-schedule-ms-audit/ms-audit-schedule-ms-audit.component';
import { FindingsRcaComponent } from './pages/ms-audit/ms-audit-follow-up-details/findings-rca/findings-rca.component';
import { FindingsCaComponent } from './pages/ms-audit/ms-audit-follow-up-details/findings-ca/findings-ca.component';
import { CorrectiveActionDetailsComponent } from './pages/corrective-actions/corrective-action-details/corrective-action-details.component';
import { CorrectiveActionComponent } from './pages/corrective-actions/corrective-action/corrective-action.component';
import { AuditPlanReportComponent } from './pages/ms-audit-plans/ms-audit-plans-detials/audit-plan-report/audit-plan-report.component';
import { MsAuditScheduleFindingComponent } from './pages/ms-audit-schedules/ms-audit-schedules-detials/ms-audit-schedule-finding/ms-audit-schedule-finding.component';



const routes: Routes = [
  {
    path: 'dashboard',
    component : DashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: null
    },
  },
  {
    path: 'user-guides',
    component : MsAuditManagementOverviewComponent,
    data: {
      core: { title: 'Overview' },
      breadcrumb: null
    },
  },
  {
    path: 'ms-teams',
    component: MsAuditTeamComponent,
    data: {
      core: { title: 'MsAudit Team' },
      breadcrumb: 'audit_teams'
    },
    children: [
      {
        path: '',
        component: MsAuditTeamListComponent,
        data: {
          core: { title: 'Teams List' },
          // breadcrumb: 'audit_teams'
        },
      },
      {
        path: ':id',
        component: MsAuditTeamDetailsComponent,
        data: {
          core: { title: 'Team Details' },
          breadcrumb: 'audit_teams'
        },
      },
    ]
  },
  {
    path: 'checklists',
    component: MsAuditCheckListComponent,
    data: {
      core: { title: 'Ms Audit Check List' },
    }
  },
  {
    path: 'corrective-actions',
    component: CorrectiveActionComponent,
    data: {
      core: { title: 'MsAudit Corrective actions' },
    },
    children:[
      {
        path: '',
        component : CorrectiveActionListComponent,
        data: {
          core: { title: "MsAudit Corrective actions" },
          breadcrumb: 'corrective_action'
        },
      },
      {
        path: "findings/:finding_id/corrective-actions/:id",
        component: CorrectiveActionDetailsComponent,
        data: {
          core: { title: 'MsAudit Corrective action Details' },
          breadcrumb: 'corrective_action'
        },
      },
    ]
  },
  {
    path: 'audit-program-annual-summary-reports',
    component: SummaryReportComponent,
    data: {
      core: { title: 'Summary report' },
    },
    children:[
      {
        path: '',
        component : SummaryReportListComponent,
        data: {
          core: { title: "Summary Report List" },
          breadcrumb: null
        },
      },
      {
        path: ':id',
        component : SummaryReportInfoComponent,
        data: {
          core: { title: "Summary Report Details" },
          breadcrumb: null
        },
      },
      {
        path: ':id/export',
        component : ExportSummaryReortComponent,
        data: {
          core: { title: "Summary Report Details" },
          breadcrumb: null
        },
      },
    ]
  },
  {
    path: 'ms-audit-programs',
    component: MsAuditProgramsComponent,
    data: {
      core: { title: "Audit programs" },
      breadcrumb: 'ms_audit_programs',
    },
    children: [
      {
        path: '',
        component: MsAuditProgramsListComponent,
        data: {
          core: { title: "List" },
          breadcrumb: 'ms_audit_programs'
        },
      },
      {
        path: ':id',
        component: MsAuditProgramsDetialsComponent,
        children: [
          {
            path: '',
              component: InfoComponent,
              data: {
                core: { title: 'Info' },
                breadcrumb: null
              }
          },
          {
            path: 'audit-plans',
            component: AuditPlanComponent,
            data: {
              core: { title: 'Audit Plans' },
              breadcrumb: null
            }
          },
          {
            path: 'ms-audit-schedules',
            component: SchedulesComponent,
            data: {
              core: { title: 'MS Audit Schedules' },
              breadcrumb: null
            }
          },
          {
            path: 'ms-audit-program-summary',
            component: AnnualSummaryComponent,
            data: {
              core: { title: 'MS Audit Program Summary' },
              breadcrumb: null
            }
          },
          {
            path: 'audit-program-report',
            component: AuditProgramReportComponent,
            data: {
              core: { title: 'MS Audit Program Report' },
              breadcrumb: null
            }
          },
        ]
      }
    ]
  },
  {
    path: 'ms-audits',
    component: MsAuditComponent,
    data: {
      core: { title: "Audits" },
      breadcrumb: 'ms_audit',
    },
    children: [
      {
        path: '',
        component: MsAuditListComponent,
        data: {
          core: { title: "list" },
          breadcrumb: 'ms_audit'
        }
      },
      {
        path: ':id',
        component: MsAuditDetailsComponent,
        children: [
          {
            path: '',
            component: MsAuditInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
          },
          {
            path: 'documents',
            component: DocumentsComponent,
            data: {
              core: { title: 'Documents' },
              breadcrumb: null
            },

          },
          {
            path: 'checklist',
            component: AuditCheckListComponent,
            data: {
              core: { title: 'Checklist' },
              breadcrumb: null
            }
          }, 
          {
            path: 'schedules',
            component: MsAuditScheduleMsAuditComponent,
            data: {
              core: { title: 'Schedule' },
              breadcrumb: null
            }
          }, 
          {
            path: 'findings',
            component: AuditNonConfirmityComponent,
            data: {
              core: { title: 'Finding' },
              breadcrumb: null
            }
          },
          {
            path: 'findings/:id',
            component: AuditNonConformityDetailsComponent,
            data: {
              core: { title: 'Finding' },
              breadcrumb: null
            }
          },
          {
            path: 'follow-up',
            component: AuditFollowUpComponent,
            data: {
              core: { title: 'Follow up' },
              breadcrumb: null
            }
          },
          {
            path: 'report',
            component: AuditReportComponent,
            data: {
              core: { title: 'Report' },
              breadcrumb: null
            }
          },
        ]
      }
    ]
  },
  {
    path: 'ms-audits/follow-ups/:id',
    component: MsAuditFollowUpDetailsComponent,
    data: {
      core: { title: "Follow Up" },
      breadcrumb: 'Follow up',
    },
    children: [
      {
        path : '',
        component : FollowUpInfoComponent,
        data: {
          core: { title: 'info' },
          breadcrumb: 'checklist'
        }
      },
      {
        path : 'score',
        component : FollowUpComponent,
        data: {
          core: { title: 'Corrective Action Update' },
          breadcrumb: 'checklist'
        }
      }
    ]
  },
  {
    path: 'ms-audit-plans',
    component: MsAuditPlansComponent,
    data: {
      core: { title: "MS Audit plans" },
      breadcrumb: 'ms_audit_plans',
    },
    children: [
      {
        path: '',
        component: MsAuditPlansListComponent,
        data: {
          core: { title: "List" },
          breadcrumb: 'ms_audit_plans'
        },
      },
      {
        path: ':id',
        component: MsAuditPlansDetialsComponent,
        children: [
          {
            path: '',
              component: MsAuditPlansInfoComponent,
              data: {
                core: { title: 'Info' },
                breadcrumb: null
              }
          },
          {
            path: 'ms-audit-schedules',
            component: PlanSchedulesComponent,
            data: {
              core: { title: 'MS Audit Schedules' },
              breadcrumb: null
            }
          },
          {
            path: 'ms-audit-plan-report',
            component: AuditPlanReportComponent,
            data: {
              core: { title: 'MS Audit Plan Report' },
              breadcrumb: null
            }
          },
        ]
      }
    ]
  },
  {
    path: 'ms-audit-schedules',
    component: MsAuditSchedulesComponent,
    data: {
      core: { title: "MS Audit Schedules" },
      breadcrumb: 'ms_audit_schedules',
    },
    children: [
      {
        path: '',
        component: MsAuditSchedulesListComponent,
        data: {
          core: { title: "List" },
          breadcrumb: 'ms_audit_schedules'
        },
      },
      {
        path: ':id',
        component: MsAuditSchedulesDetialsComponent,
        children: [
          {
            path: '',
            component: MsAuditSchedulesInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
          },
          {
            path: 'checklist',
            component: MsAuditScheduleChecklistComponent,
            data: {
              core: { title: 'checklist' },
              breadcrumb: null
            }
          },
          {
            path: 'findings',
            component: MsAuditScheduleFindingComponent,
            data: {
              core: { title: 'findings' },
              breadcrumb: null
            }
          }
        ]
      }
    ]
  },
  {
    path: 'ms-audit-workflows',
    component: AuditWorkflowEngineComponent,
    children: [
      {
        path: "",
        component: AuditWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: AuditWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  },
  {
    path:"findings",
    component:MsAuditNonConfirmitiesComponent,
    data: {
      core: { title: "Findings" },
      breadcrumb: 'findings',
    },
    children:[
      {
        path:"",
        component:NonConfirmitiesListComponent,
        data: {
          core: { title: "Findings" },
          breadcrumb: 'findings',
        }
      },
      {
        path:":id",
        component:NonConfirmitiesDetialsComponent,
        data: {
          core: { title: 'info' },
          breadcrumb: 'findings'
        },
        children: [
          {
            path : '',
            component : FollowUpInfoComponent,
            data: {
              core: { title: 'info' },
              breadcrumb: 'findings'
            }
          },
          {
            path : 'score',
            component : FollowUpComponent,
            data: {
              core: { title: 'Corrective Action Update' },
              breadcrumb: 'findings'
            }
          },
          {
            path : 'root-cause-analysis',
            component : FindingsRcaComponent,
            data: {
              core: { title: 'RCA' },
              breadcrumb: 'findings'
            }
          },
          {
            path : 'corrective-action',
            component : FindingsCaComponent,
            data: {
              core: { title: 'CA' },
              breadcrumb: 'findings'
            }
          }
        ]
      }
    ]
  },
  {
    path: 'reports',
    component: MsAuditReportsComponent,
    data: {
      core: { title: 'reports' },
      breadcrumb: 'reports'
  },
  children:[
    {
       path: "",
       component: MsAuditReportListComponent,
       data: {
        core: { title: "reports" },
        breadcrumb: 'reports'
      },
    },
    {
      path: ":riskcountType",
      component: MsAuditReportDetailsComponent,
      data: {
       core: { title: "Reports Details" },
      }
    },
    {
      path: ':riskcountType/:id',
      component: MsAuditDetailReportComponent,
      data: {
        core: { title: 'Ms Audit Count List' },
      },
    },
  ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MsAuditManagementRoutingModule { }