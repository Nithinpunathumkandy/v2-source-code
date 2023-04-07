import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditDashboardComponent } from './pages/dashboard/audit-dashboard.component';
import { AuditUniverseComponent } from './pages/audit-universe/audit-universe.component';
import { AuditPlanComponent } from './pages/audit-plan/audit-plan.component';
import { AuditScheduleComponent } from './pages/audit-schedule/pages/audit-schedule.component';
import { AuditFindingsComponent } from './pages/audit-findings/pages/audit-findings.component';
import { AuditReportsComponent } from './pages/reports/pages/audit-reports.component';
import { AuditableItemComponent } from './pages/auditable-item/pages/auditable-item.component';
import { AuditableItemListComponent } from './pages/auditable-item/pages/auditable-item-list/auditable-item-list.component';
import { AddAuditableItemComponent } from './pages/auditable-item/pages/add-auditable-item/add-auditable-item.component';
import { AuditableItemDetailsComponent } from './pages/auditable-item/pages/auditable-item-details/auditable-item-details.component';
import { EditAuditableItemComponent } from './pages/auditable-item/pages/edit-auditable-item/edit-auditable-item.component';
import { AuditProgramComponent } from './pages/audit-program/pages/audit-program.component';
import { AuditProgramListComponent } from './pages/audit-program/pages/audit-program-list/audit-program-list.component';
import { AuditProgramDetailsComponent } from './pages/audit-program/pages/audit-program-details/audit-program-details.component';
import { InfoComponent } from './pages/audit-program/pages/audit-program-details/info/info.component';
import { AuditableItemsComponent } from './pages/audit-program/pages/audit-program-details/auditable-items/auditable-items.component';
import { AuditPlansComponent } from './pages/audit-program/pages/audit-program-details/audit-plans/audit-plans.component';
import { AuditPlanListComponent } from './pages/audit-plan/pages/audit-plan-list/audit-plan-list.component';
import { AddAuditPlanComponent } from './pages/audit-plan/pages/add-audit-plan/add-audit-plan.component';
import { AuditorsComponent } from './pages/audit-program/pages/audit-program-details/auditors/auditors.component';
import { EditAuditPlanComponent } from './pages/audit-plan/pages/edit-audit-plan/edit-audit-plan.component';
import { AuditPlanInfoComponent } from './pages/audit-plan/pages/audit-plan-details/audit-plan-info/audit-plan-info.component';
import { AuditPlanDetailsComponent } from './pages/audit-plan/pages/audit-plan-details/audit-plan-details.component';
import { SchedulesComponent } from './pages/audit-plan/pages/audit-plan-details/schedules/schedules.component';
import { AddNewAuditPlanScheduleComponent } from './pages/audit-plan/pages/audit-plan-details/schedules/add-new-audit-plan-schedule/add-new-audit-plan-schedule.component';
import { AuditPlanScheduleComponent } from './pages/audit-plan-schedule/pages/audit-plan-schedule.component';
import { AuditPlanScheduleListComponent } from './pages/audit-plan-schedule/pages/audit-plan-schedule-list/audit-plan-schedule-list.component';
import { AuditPlanScheduleDetailsComponent } from './pages/audit-plan-schedule/pages/audit-plan-schedule-details/audit-plan-schedule-details.component';
import { AuditComponent } from './pages/audit/pages/audit.component';
import { AuditListComponent } from './pages/audit/pages/audit-list/audit-list.component';
import { AddPlannedAuditComponent } from './pages/audit/pages/add/planned-audit/add-planned-audit/add-planned-audit.component';
import { EditPlannedAuditComponent } from './pages/audit/pages/add/planned-audit/edit-planned-audit/edit-planned-audit.component';
import { AuditDetailsComponent } from './pages/audit/pages/audit-details/audit-details.component';
import { AuditInfoComponent } from './pages/audit/pages/audit-details/audit-info/audit-info.component';
import { AuditSchedulesComponent } from './pages/audit/pages/audit-details/audit-schedules/audit-schedules.component';
import { FindingsComponent } from './pages/audit/pages/audit-details/findings/findings.component';
import { AddAuditPlanScheduleComponent } from './pages/audit-plan-schedule/pages/add-audit-plan-schedule/add-audit-plan-schedule.component';
import { EditAuditPlanScheduleComponent } from './pages/audit-plan-schedule/pages/edit-audit-plan-schedule/edit-audit-plan-schedule.component';
import { ExecuteChecklistComponent } from './pages/audit/pages/audit-details/audit-schedules/execute-checklist/execute-checklist.component';
import { AuditSchedulesListComponent } from './pages/audit-schedule/pages/audit-schedules-list/audit-schedules-list.component';
import { AuditScheduleDetailsComponent } from './pages/audit-schedule/pages/audit-schedule-details/audit-schedule-details.component';
import { ScheduleExecuteChecklistComponent } from './pages/audit-schedule/pages/audit-schedule-details/schedule-execute-checklist/schedule-execute-checklist.component';
import { AuditFindingsListComponent } from './pages/audit-findings/pages/audit-findings-list/audit-findings-list.component';
import { FindingsAddComponent } from './pages/audit-findings/pages/findings-add/findings-add.component';
import { FindingInfoComponent } from './pages/audit-findings/pages/audit-findings-details/finding-info/finding-info.component';
import { AuditFindingsDetailsComponent } from './pages/audit-findings/pages/audit-findings-details/audit-findings-details.component';
import { FindingsEditComponent } from './pages/audit-findings/pages/findings-edit/findings-edit.component';
import { RootCauseAnalysisComponent } from './pages/audit-findings/pages/audit-findings-details/root-cause-analysis/root-cause-analysis.component';
import { ImpactAnalysisComponent } from './pages/audit-findings/pages/audit-findings-details/impact-analysis/impact-analysis.component';
import { ImpactAnalysisDetailsComponent } from './pages/audit-findings/pages/audit-findings-details/impact-analysis/impact-analysis-details/impact-analysis-details.component';
import { CorrectiveActionComponent } from './pages/audit-findings/pages/audit-findings-details/corrective-action/corrective-action.component';
import { AddNewPlanComponent } from './pages/audit-program/pages/audit-program-details/audit-plans/add-new-plan/add-new-plan.component';
import { EditPlanComponent } from './pages/audit-program/pages/audit-program-details/audit-plans/edit-plan/edit-plan.component';
import { NewFindingsComponent } from './pages/audit/pages/audit-details/findings/new-findings/new-findings.component';
import { EditFindingsComponent } from './pages/audit/pages/audit-details/findings/edit-findings/edit-findings.component';
import { ActionPlanComponent } from './pages/action-plan/pages/action-plan.component';
import { ActionPlanListComponent } from './pages/action-plan/pages/action-plan-list/action-plan-list.component';
import { ActionPlanDetailsComponent } from './pages/action-plan/pages/action-plan-details/action-plan-details.component';
import { AnnualPlanComponent } from './pages/annual-plan/pages/annual-plan.component';
import { AnnualPlanMainTabComponent } from './pages/annual-plan/pages/annual-plan-main-tab/annual-plan-main-tab.component';
import { ByAuditorComponent } from './pages/annual-plan/pages/annual-plan-main-tab/by-auditor/by-auditor.component';
import { ByAuditorDetailsComponent } from './pages/annual-plan/pages/annual-plan-main-tab/by-auditor/by-auditor-details/by-auditor-details.component';
import { ByDepartmentComponent } from './pages/annual-plan/pages/annual-plan-main-tab/by-department/by-department.component';
import { ByYearComponent } from './pages/annual-plan/pages/annual-plan-main-tab/by-year/by-year.component';
import { MainReportComponent } from './pages/reports/pages/main-report/main-report.component';
import { AuditTemplateComponent } from './pages/audit-template/pages/audit-template.component';
import { AuditTemplateListComponent } from './pages/audit-template/pages/audit-template-list/audit-template-list.component';
import { AuditTemplateDetailsComponent } from './pages/audit-template/pages/audit-template-details/audit-template-details.component';
import { EditNewPlanScheduleComponent } from './pages/audit-plan/pages/audit-plan-details/schedules/edit-new-plan-schedule/edit-new-plan-schedule.component';
import { AuditsComponent } from './pages/audit-program/pages/audit-program-details/audits/audits.component';
import { FindingsFromProgramComponent } from './pages/audit-program/pages/audit-program-details/findings/findings.component';
import { AuditWorkflowComponent } from './pages/audit-workflow/pages/audit-workflow.component';
import { AuditWorkflowListComponent } from './pages/audit-workflow/pages/audit-workflow-list/audit-workflow-list.component';
import { AuditWorkflowDetailsComponent } from './pages/audit-workflow/pages/audit-workflow-details/audit-workflow-details.component';
import { AuditReportsListComponent } from './pages/reports/pages/audit-reports-list/audit-reports-list.component';
import { AuditReportComponent } from './pages/audit/pages/audit-details/audit-report/audit-report.component';
import { ReportsAuditComponent } from './pages/reports-audit/reports-audit.component';
import { AuditCountTypeComponent } from './pages/reports-audit/audit-count-type/audit-count-type.component';
import { AuditCountListComponent } from './pages/reports-audit/audit-count-list/audit-count-list.component';
import { FindingDetailsDashboardComponent } from './pages/finding-details-dashboard/finding-details-dashboard.component';
import { AuditOverviewComponent } from './pages/audit-overview/audit-overview.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: AuditDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
    }
  }, 
  {
    path: 'user-guides',
    component: AuditOverviewComponent,
    data: {
      core: { title: 'Audit Overview' },
    }
  },
  {
    path: 'finding-details',
    component: FindingDetailsDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
    }
  }, {
    path: 'auditable-items',
    component: AuditableItemComponent,
    data: {
      core: { title: 'Auditable Item' },
    },

    children: [
      {
        path: "",
        component: AuditableItemListComponent,
        data: {
          core: { title: "Auditable Item" },
          breadcrumb: 'auditable_items'
        }
      }, {
        path: "add-auditable-item",
        component: AddAuditableItemComponent,
        data: {
          core: { title: "Auditable Item" }
        }

      }, {
        path: "edit-auditable-item",
        component: EditAuditableItemComponent,
        data: {
          core: { title: "Auditable Item" }
        }

      },
      {

        path: ":id",
        component: AuditableItemDetailsComponent,
        data: {
          core: { title: "Auditable Item Details" }
        },

      }
    ]
  },
  {
    path: 'audit-universe',
    component: AuditUniverseComponent,
    data: {
      core: { title: 'Audit Universe' },
    }
  },
  {
    path: 'audit-programs',
    component: AuditProgramComponent,
    data: {
      core: { title: 'Audit program' },
    },
    children: [
      {
        path: "",
        component: AuditProgramListComponent,
        data: {
          core: { title: "Audit Program" },
          breadcrumb: 'audit_programs'
        }
      }, {
        path: "add-plan",
        component: AddNewPlanComponent,
        data: {
          core: { title: "Add Plan" },
        }
      }, {
        path: "edit-audit-plan",
        component: EditPlanComponent,
        data: {
          core: { title: "Edit Plan" },
        }
      }, {
        path: ":id",
        component: AuditProgramDetailsComponent,
        children: [
          {
            path: "",
            component: InfoComponent,
            data: {
              core: { title: "Info" },
            },
          }, {
            path: "auditable-items",
            component: AuditableItemsComponent,
            data: {
              core: { title: "Auditable Items" },
            },
          }, {
            path: "auditors",
            component: AuditorsComponent,
            data: {
              core: { title: "Auditors" },
            },
          },
          {
            path: "audit-plan",
            component: AuditPlansComponent,
            data: {
              core: { title: "Audit Plan" },
            },
          },
          {
            path: "audits",
            component: AuditsComponent,
            data: {
              core: { title: "Audits" },
            },
          },
          {
            path: "findings",
            component: FindingsFromProgramComponent,
            data: {
              core: { title: "Audits" },
            },
          }
        ]

      }
    ]
  },
  {
    path: 'audit-plans',
    component: AuditPlanComponent,
    data: {
      core: { title: 'Audit plan' },
    },
    children: [
      {
        path: "",
        component: AuditPlanListComponent,
        data: {
          core: { title: "Audit Plan" },
          breadcrumb: 'audit_plans'
        }
      },

      {
        path: "add-audit-plan",
        component: AddAuditPlanComponent,
        data: {
          core: { title: "Audit Plan" }
        }

      }, {
        path: "edit-audit-plan",
        component: EditAuditPlanComponent,
        data: {
          core: { title: "Audit Plan" }
        }

      }, {

        path: "new-schedule",
        component: AddNewAuditPlanScheduleComponent,
        data: {
          core: { title: " Add New Schedules" },
        },

      },{

        path: "edit-audit-plan-schedule",
        component: EditNewPlanScheduleComponent,
        data: {
          core: { title: " Add New Schedules" },
        },

      },
      {

        path: ":id",
        component: AuditPlanDetailsComponent,
        data: {
          core: { title: "Audit Plan Details" }
        },
        children: [
          {
            path: "",
            component: AuditPlanInfoComponent,
            data: {
              core: { title: "Audit Plan Details" },
            }
          }, {
            path: "schedules",
            component: SchedulesComponent,
            data: {
              core: { title: "Schedules" },
            },
          },


        ]
      },
    ]
  },
  {
    path: 'audit-schedules',
    component: AuditScheduleComponent,
    data: {
      core: { title: 'Audit Schedule' },
    }, children: [
      {
        path: "",
        component: AuditSchedulesListComponent,
        data: {
          core: { title: "Audit Schedule" },
          breadcrumb: 'audit_schedules'
        }
      }, {

        path: "execute-checklists",
        component: ScheduleExecuteChecklistComponent,
        data: {
          core: { title: "Execute Checklist" },
        }

      }, {

        path: ":id",
        component: AuditScheduleDetailsComponent,
        data: {
          core: { title: "Audit Schedule Details" }
        },

      }
    ]
  },

  {
    path: 'audit-plan-schedules',
    component: AuditPlanScheduleComponent,
    data: {
      core: { title: 'Audit Plan Schedule' },
    },
    children: [
      {
        path: "",
        component: AuditPlanScheduleListComponent,
        data: {
          core: { title: "Audit Plan Schedule" },
          breadcrumb: 'audit_plan_schedules'
        }
      }, {

        path: "add-audit-plan-schedule",
        component: AddAuditPlanScheduleComponent,
        data: {
          core: { title: "Audit Plan Schedule" }
        },

      }, {

        path: "edit-audit-plan-schedule",
        component: EditAuditPlanScheduleComponent,
        data: {
          core: { title: "Audit Plan Schedule" }
        },

      },

      {

        path: ":id",
        component: AuditPlanScheduleDetailsComponent,
        data: {
          core: { title: "Audit Plan Schedule Details" }
        },

      }
    ]
  },
  {
    path: 'audits',
    component: AuditComponent,
    data: {
      core: { title: 'Audit' },
    }, children: [
      {
        path: "",
        component: AuditListComponent,
        data: {
          core: { title: "Audit" },
          breadcrumb: 'audits'
        }
      }, {

        path: "add-planned-audit",
        component: AddPlannedAuditComponent,
        data: {
          core: { title: "Planned Audit" },
        }

      }, {

        path: "edit-planned-audit",
        component: EditPlannedAuditComponent,
        data: {
          core: { title: "Planned Audit" },
        }

      }, {

        path: "audit-schedule/execute-checklist",
        component: ExecuteChecklistComponent,
        data: {
          core: { title: "Execute Checklist" },
        }

      }, {
        path: "add-findings",
        component: NewFindingsComponent,
        data: {
          core: { title: "Add Findings" },
        }

      }, {
        path: "edit-findings",
        component: EditFindingsComponent,
        data: {
          core: { title: "Add Findings" },
        }

      },

      {

        path: ":id",
        component: AuditDetailsComponent,
        data: {
          core: { title: "Audit Details" }
        },
        children: [
          {
            path: "",
            component: AuditInfoComponent,
            data: {
              core: { title: "Audit Details" },
            }
          }, {
            path: "schedules",
            component: AuditSchedulesComponent,
            data: {
              core: { title: "Schedules" },
            },
          }, {
            path: "findings",
            component: FindingsComponent,
            data: {
              core: { title: "Findings" },
            },
          },{
            path: "report/:id",
            component: AuditReportComponent,
            data: {
              core: { title: "Report" },
            },
          },
        ]
      }
    ]
  },
  {
    path: 'findings',
    component: AuditFindingsComponent,
    data: {
      core: { title: 'Audit Findings' },
    }, children: [
      {
        path: "",
        component: AuditFindingsListComponent,
        data: {
          core: { title: "Audit Findings List" },
          breadcrumb: 'audit_findings'
        }
      }, {

        path: 'add-findings',
        component: FindingsAddComponent,
        data: {
          core: { title: "Audit Findings" },
        }
      }, {

        path: 'edit-findings',
        component: FindingsEditComponent,
        data: {
          core: { title: "Audit Findings" },
        }
      },
      {

        path: ":id",
        component: AuditFindingsDetailsComponent,
        data: {
          core: { title: "Audit Findings Details" }
        },
        children: [
          {
            path: "",
            component: FindingInfoComponent,
            data: {
              core: { title: "Findings Details" },
            }
          }, {
            path: 'root-cause-analyses',
            component: RootCauseAnalysisComponent,
            data: {
              core: { title: "RCA" },
            }
          }, {
            path: 'corrective-actions',
            component: CorrectiveActionComponent,
            data: {
              core: { title: "CA" },
            }
          }, {
            path: 'impact-analyses',
            component: ImpactAnalysisComponent,
            data: {
              core: { title: "IA" },
            }
          }, {
            path: 'impact-analysis-details',
            component: ImpactAnalysisDetailsComponent,
            data: {
              core: { title: "IA Details" },
            }
          },
        ]
      }
    ]
  }, {
    path: 'corrective-action',
    component: ActionPlanComponent,
    data: {
      core: { title: 'Corrective Actions' },
    },
    children: [
      {
        path: "",
        component: ActionPlanListComponent,
        data: {
          core: { title: "Corrective Action List" },
          breadcrumb: 'corrective_actions'
        }
      },
      {

        path: "findings/:finding_id/corrective-actions/:id",
        component: ActionPlanDetailsComponent,
        data: {
          core: { title: "Action Plan Details" }
        },

      }
    ]
  }, {
    path: 'anual-plan',
    component: AnnualPlanComponent,
    data: {
      core: { title: 'Annual Plan' },
    },
    children: [
      {
        path: "",
        component: AnnualPlanMainTabComponent,
        data: {
          core: { title: "Annual Plan" },
        },
        children: [
          {
            path: '',
            component: ByAuditorComponent,
            data: {
              core: { title: "Annual Plan By Auditor" },
              breadcrumb: 'audit_plans_by_auditor'
            }
          },{
            path: 'by_auditor/:id',
            component: ByAuditorDetailsComponent,
            data: {
              core: { title: "Annual Plan By Auditor" },
            },
           },{
            path: 'by_department',
            component: ByDepartmentComponent,
            data: {
              core: { title: "Annual Plan By Department" },
              breadcrumb: 'audit_plans_by_department'
            },
           },{
            path: 'by_year',
            component: ByYearComponent,
            data: {
              core: { title: "Annual Plan By Year" },
              breadcrumb: 'audit_plans_by_year'
            },
           }
        ]
      }
    ]
  },
  {
    path: 'audit-report-template',
    component: AuditTemplateComponent,
    data: {
      core: { title: 'Audit Reports Template' },
    },
    children:[
      {
        path: "",
        component:AuditTemplateListComponent,
        data: {
          core: { title: 'Audit Template' },
          breadcrumb: 'audit_templates'
        },
      },
      {
        path: ":id",
        component: AuditTemplateDetailsComponent,
        data: {
          core: { title: "Audit Template Details" }
        },

      }
    ]
  }
  , {
    path: 'audit-reports',
    component: AuditReportsComponent,
    // data: {
    //   core: { title: 'Audit Reports' },
    // },
    children:[
      {
        path: "",
        component:AuditReportsListComponent,
        data: {
          core: { title: 'Audit Reports' },
          breadcrumb: 'audit_reports'
        },
    },
      {
        path: ":id",
        component:MainReportComponent,
        data: {
          core: { title: 'Audit Reports' },
        },
      },
    ]
  },

  {
    path: 'reports',
    component: ReportsAuditComponent,
    data: {
      core: { title: 'Audit Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: AuditCountTypeComponent,
    data: {
      core: { title: 'Audit Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: AuditCountListComponent,
    data: {
      core: { title: 'Audit Count List' },
    },
  },
  {
  path: 'workflow',
  component: AuditWorkflowComponent,
  children:[
    {
      path: "",
      component:AuditWorkflowListComponent,
      data: {
        core: { title: 'Workflow Engine' },
        breadcrumb: 'workflow_engine'
      },
    },
    {
      path: ":id",
      component: AuditWorkflowDetailsComponent,
      data: {
        core: { title: "Workflow Engine Detailss" }
      },

    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalAuditRoutingModule { }
