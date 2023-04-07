import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmAuditCaDetailsComponent } from './pages/am-audit-corrective-actions/am-audit-ca-details/am-audit-ca-details.component';
import { AmAuditCaListComponent } from './pages/am-audit-corrective-actions/am-audit-ca-list/am-audit-ca-list.component';
import { AmAuditCorrectiveActionsComponent } from './pages/am-audit-corrective-actions/am-audit-corrective-actions.component';
import { AmAuditDraftReportsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-draft-reports/am-audit-draft-reports.component';
import { AmAuditFieldWorkDetailsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-details.component';
import { AmAuditFieldWorkFindingsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-audit-field-work-findings.component';
import { AmAuditFindingCaComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-ca/am-audit-finding-ca.component';
import { AmAuditFindingIaComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-ia/am-audit-finding-ia.component';
import { AmAuditFindingInfoComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-info/am-audit-finding-info.component';
import { AmAuditFindingRcaComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-audit-finding-rca/am-audit-finding-rca.component';
import { AmFieldWorkFindingDetailsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-findings/am-field-work-finding-details/am-field-work-finding-details.component';
import { AmAuditFieldWorkInfoComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-info/am-audit-field-work-info.component';
import { FieldWorkTestPlanDetailsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-field-work-info/field-work-test-plan-details/field-work-test-plan-details.component';
import { AmAuditFinalReportsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-final-reports/am-audit-final-reports.component';
import { AmAuditPreliminaryReportsComponent } from './pages/am-audit-field-works/am-audit-field-work-details/am-audit-preliminary-reports/am-audit-preliminary-reports.component';
import { AmAuditFieldWorkListComponent } from './pages/am-audit-field-works/am-audit-field-work-list/am-audit-field-work-list.component';
import { AmAuditFieldWorksComponent } from './pages/am-audit-field-works/am-audit-field-works.component';
import { AmAuditFindingsComponent } from './pages/am-audit-findings/am-audit-findings.component';
import { AmAnnualAuditPlanComponent } from './pages/am-audit-plan/am-audit-plan-details/am-annual-audit-plan/am-annual-audit-plan.component';
import { IndividualAuditPlanInfoComponent } from './pages/am-audit-plan/am-audit-plan-details/am-annual-audit-plan/individual-audit-plan-info/individual-audit-plan-info.component';
import { AmAuditPlanDetailsComponent } from './pages/am-audit-plan/am-audit-plan-details/am-audit-plan-details.component';
import { AmAuditPlanInfoComponent } from './pages/am-audit-plan/am-audit-plan-details/am-audit-plan-info/am-audit-plan-info.component';
import { AmAuditSummaryComponent } from './pages/am-audit-plan/am-audit-plan-details/am-audit-summary/am-audit-summary.component';
import { AmAuditableItemComponent } from './pages/am-audit-plan/am-audit-plan-details/am-auditable-item/am-auditable-item.component';
import { AmAuditPlanListComponent } from './pages/am-audit-plan/am-audit-plan-list/am-audit-plan-list.component';
import { AmAuditPlanComponent } from './pages/am-audit-plan/am-audit-plan.component';
import { AmAuditCountListComponent } from './pages/am-audit-reports/am-audit-count-list/am-audit-count-list.component';
import { AmAuditReportsComponent } from './pages/am-audit-reports/am-audit-reports.component';
import { AmAuditsCountTypeComponent } from './pages/am-audit-reports/am-audits-count-type/am-audits-count-type.component';
import { AmAuditUniverseDepartmentListComponent } from './pages/am-audit-universe/am-audit-universe-department-list/am-audit-universe-department-list.component';
import { AmAuditUniverseProcessListComponent } from './pages/am-audit-universe/am-audit-universe-process-list/am-audit-universe-process-list.component';
import { AmAuditUniverseRiskListComponent } from './pages/am-audit-universe/am-audit-universe-risk-list/am-audit-universe-risk-list.component';
import { AmAuditUniverseStrategicObjectiveListComponent } from './pages/am-audit-universe/am-audit-universe-strategic-objective-list/am-audit-universe-strategic-objective-list.component';
import { AmAuditUniverseComponent } from './pages/am-audit-universe/am-audit-universe.component';
import { AmAuditCommencementLetterComponent } from './pages/am-audit/am-audit-details/am-audit-commencement-letter/am-audit-commencement-letter.component';
import { AmAuditDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-details.component';
import { AmAuditDocumentsComponent } from './pages/am-audit/am-audit-details/am-audit-documents/am-audit-documents.component';
import { AmAuditInfoComponent } from './pages/am-audit/am-audit-details/am-audit-info/am-audit-info.component';
import { AmAuditInformationRequestComponent } from './pages/am-audit/am-audit-details/am-audit-information-request/am-audit-information-request.component';
import { AmInformationRequestDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-information-request/am-information-request-details/am-information-request-details.component';
import { AmAuditMeetingDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-meetings/am-audit-meeting-details/am-audit-meeting-details.component';
import { AmAuditMeetingsComponent } from './pages/am-audit/am-audit-details/am-audit-meetings/am-audit-meetings.component';
import { AmAuditTestPlanDetailsComponent } from './pages/am-audit/am-audit-details/am-audit-test-plans/am-audit-test-plan-details/am-audit-test-plan-details.component';
import { AmAuditTestPlansComponent } from './pages/am-audit/am-audit-details/am-audit-test-plans/am-audit-test-plans.component';
import { AmAuditListComponent } from './pages/am-audit/am-audit-list/am-audit-list.component';
import { AmAuditComponent } from './pages/am-audit/am-audit.component';
import { AmIndividualAuditPlansListComponent } from './pages/am-individual-audit-plans-list/am-individual-audit-plans-list.component';
import { AmWorkflowDetailsComponent } from './pages/am-workflow/am-workflow-details/am-workflow-details.component';
import { AmWorkflowListComponent } from './pages/am-workflow/am-workflow-list/am-workflow-list.component';
import { AmWorkflowComponent } from './pages/am-workflow/am-workflow.component';
import { AmFindingsDashboardComponent } from './pages/audit-management-dashboard/am-findings-dashboard/am-findings-dashboard.component';
import { AmTopFindingsDashboardComponent } from './pages/audit-management-dashboard/am-top-findings-dashboard/am-top-findings-dashboard.component';
import { AuditManagementDashboardComponent } from './pages/audit-management-dashboard/audit-management-dashboard.component';
import { AuditManagementOverviewComponent } from './pages/audit-management-overview/audit-management-overview.component';
import { ControlSelfAssessmentsComponent } from './pages/control-self-assessments/control-self-assessments.component';
import { CsaDetailsComponent } from './pages/control-self-assessments/csa-details/csa-details.component';
import { CsaListComponent } from './pages/control-self-assessments/csa-list/csa-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: AuditManagementDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: 'dashboard'
    }
  },
  {
    path: 'finding-dashboard',
    component: AmFindingsDashboardComponent,
    data: {
      core: { title: 'Finding Dashboard' },
      breadcrumb: 'dashboard'
    }
  },
  {
    path: 'top-finding-dashboard',
    component: AmTopFindingsDashboardComponent,
    data: {
      core: { title: 'Top 20 Finding' },
      breadcrumb: 'dashboard'
    }
  },
  {
    path: 'user-guides',
    component: AuditManagementOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb: null
    }
  },
  {
    path: 'am-audit-plans',
    component: AmAuditPlanComponent,
    data: {
      core: { title: 'Audit Plans' },
      breadcrumb: 'Audit Plans'
    },
    children: [
      {
        path: '',
        component: AmAuditPlanListComponent,
        data: {
          core: { title: 'Audit Plans' },
          breadcrumb: 'Audit Plans'
        },
      },

      {
        path: ':id',
        component: AmAuditPlanDetailsComponent,
        children: [

          {
            path: '',
            component: AmAuditPlanInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
          },
          {
            path: 'auditable-items',
            component: AmAuditableItemComponent,
            data: {
              core: { title: 'Auditable Items' },
              breadcrumb: null
            }
          },
          {
            path: 'annual-audit-plans',
            component: AmAnnualAuditPlanComponent,
            data: {
              core: { title: 'Annual Audit Plans' },
              breadcrumb: null
            }
          },
          {
            path: 'audit-summary',
            component: AmAuditSummaryComponent,
            data: {
              core: { title: 'Audit Summary' },
              breadcrumb: null
            }
          },
        ]

      },
      {
        path: ':id/annual-audit-plans/:ind_id',
        component: IndividualAuditPlanInfoComponent,
        data: {
          core: { title: 'Info' },
          breadcrumb: null
        }
      },
    ]
  },
  {
    path: 'am-audit-universes',
    component: AmAuditUniverseComponent,
    data: {
      core: { title: 'Audit Universe' },
      breadcrumb: null
    },
    children: [
      {
        path: '',
        component: AmAuditUniverseProcessListComponent,
        data: {
          core: { title: 'Processes' },
          breadcrumb: null
        },
      },
      {
        path: 'risks',
        component: AmAuditUniverseRiskListComponent,
        data: {
          core: { title: 'Risks' },
          breadcrumb: null
        },
      },
      {
        path: 'strategic-objectives',
        component: AmAuditUniverseStrategicObjectiveListComponent,
        data: {
          core: { title: 'Strategic Objectives' },
          breadcrumb: null
        },
      },
      {
        path: 'departments',
        component: AmAuditUniverseDepartmentListComponent,
        data: {
          core: { title: 'Departments' },
          breadcrumb: null
        },
      },
    ]
  },
  {
    path: 'am-audit-control-self-assessments',
    component: ControlSelfAssessmentsComponent,
    data: {
      core: { title: 'Control Self Assessments' },
      breadcrumb: 'Control Self Assessments'
    },
    children: [
      {
        path: '',
        component: CsaListComponent,
        data: {
          core: { title: 'Control Self Assessments' },
          breadcrumb: 'Control Self Assessments'
        },
      },
      {
        path: ':id',
        component: CsaDetailsComponent,
        data: {
          core: { title: 'Info' },
          breadcrumb: null
        }
      },
    ],
  },
  {
    path: 'am-audits',
    component: AmAuditComponent,
    data: {
      core: { title: 'Audit' },
      breadcrumb: 'Audit'
    },
    children: [
      {
        path: '',
        component: AmAuditListComponent,
        data: {
          core: { title: 'Audits' },
          breadcrumb: 'Audits'
        },
      },
      {
        path: ':id',
        component: AmAuditDetailsComponent,
        children: [

          {
            path: '',
            component: AmAuditInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-commencement-letters',
            component: AmAuditCommencementLetterComponent,
            data: {
              core: { title: 'am_commencement_letter' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-information-request',
            component: AmAuditInformationRequestComponent,
            data: {
              core: { title: 'am_information_requests' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-documents',
            component: AmAuditDocumentsComponent,
            data: {
              core: { title: 'am_audit_documents' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-meetings',
            component: AmAuditMeetingsComponent,
            data: {
              core: { title: 'am_audit_meetings' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-test-plans',
            component: AmAuditTestPlansComponent,
            data: {
              core: { title: 'am_audit_test_plans' },
              breadcrumb: null
            }
          },

        ]
      },
      {
        path: ':id/am-audit-information-request/:info_id',
        component: AmInformationRequestDetailsComponent,
        data: {
          core: { title: 'am_information_request' },
          breadcrumb: null
        }
      },
      {
        path: ':id/am-audit-meetings/:meeting_id',
        component: AmAuditMeetingDetailsComponent,
        data: {
          core: { title: 'am_audit_meetings' },
          breadcrumb: null
        }
      },
      {
        path: ':id/am-audit-test-plans/:test_id',
        component: AmAuditTestPlanDetailsComponent,
        data: {
          core: { title: 'am_audit_test_plans' },
          breadcrumb: null
        }
      },


    ]
  },
  {
    path: 'am-audit-field-works',
    component: AmAuditFieldWorksComponent,
    data: {
      core: { title: 'Audit Field Works' },
      breadcrumb: 'Audit Field Works'
    },
    children: [
      {
        path: '',
        component: AmAuditFieldWorkListComponent,
        data: {
          core: { title: 'Audit Field Works' },
          breadcrumb: 'Audit Field Works'
        },
      },

      {
        path: ':id',
        component: AmAuditFieldWorkDetailsComponent,
        children: [

          {
            path: '',
            component: AmAuditFieldWorkInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-findings',
            component: AmAuditFieldWorkFindingsComponent,
            data: {
              core: { title: 'Findings' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-preliminary-reports',
            component: AmAuditPreliminaryReportsComponent,
            data: {
              core: { title: 'Preliminary Reports' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-draft-reports',
            component: AmAuditDraftReportsComponent,
            data: {
              core: { title: 'Draft Reports' },
              breadcrumb: null
            }
          },
          {
            path: 'am-audit-final-reports',
            component: AmAuditFinalReportsComponent,
            data: {
              core: { title: 'Final Reports' },
              breadcrumb: null
            }
          },
        ]
      },
      {
        path: ':id/am-audit-test-plans/:test_id',
        component: FieldWorkTestPlanDetailsComponent,
        data: {
          core: { title: 'am_audit_test_plans' },
          breadcrumb: null
        }
      },
      {
        path: ':id/am-audit-findings/:finding_id',
        component: AmFieldWorkFindingDetailsComponent,

        children: [
          {
            path: '',
            component: AmAuditFindingInfoComponent,
            data: {
              core: { title: 'Info' },
              breadcrumb: null
            },
          },
          {
            path: 'am-impact-analyses',
            component: AmAuditFindingIaComponent,
            data: {
              core: { title: 'IA' },
              breadcrumb: null
            },
          },
          {
            path: 'am-root-cause-analysis',
            component: AmAuditFindingRcaComponent,
            data: {
              core: { title: 'RCA' },
              breadcrumb: null
            },
          },
          {
            path: 'am-corrective-actions',
            component: AmAuditFindingCaComponent,
            data: {
              core: { title: 'CA' },
              breadcrumb: null
            },
          },
        ]
      },
    ]
  },
  {
    path: 'am-audit-findings',
    component: AmAuditFindingsComponent,
    data: {
      core: { title: 'Audit Findings' },
      breadcrumb: 'Audit Findings'
    },
  },
  {
    path: 'am-audit-finding-corrective-actions',
    component: AmAuditCorrectiveActionsComponent,
    data: {
      core: { title: 'Corrective Actions' },
      breadcrumb: 'Corrective Actions'
    },
    children: [
      {
        path: '',
        component: AmAuditCaListComponent,
        data: {
          core: { title: 'Corrective Actions' },
          breadcrumb: 'Corrective Actions'
        },
      },
      {
        path: ':id',
        component: AmAuditCaDetailsComponent,
        data: {
          core: { title: 'Corrective Action Details' },
          breadcrumb: null
        },
      },
    ]
  },

  {
    path: 'am-workflows',
    component: AmWorkflowComponent,
    data: {
      core: { title: 'Audit Management Workflow' },
      breadcrumb: 'Audit Management Workflow'
    },
    children: [
      {
        path: '',
        component: AmWorkflowListComponent,
        data: {
          core: { title: 'Audit Management Workflow' },
          breadcrumb: 'Audit Management Workflow'
        },
      },
      {
        path: ':id',
        component: AmWorkflowDetailsComponent,
        data: {
          core: { title: 'Info' },
          breadcrumb: null
        }
      }
    ]
  },
  // reports start here
  {
    path: 'reports',
    component: AmAuditReportsComponent,
    data: {
      core: { title: 'Audit Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:amAuditCountType',
    component: AmAuditsCountTypeComponent,
    data: {
      core: { title: 'Audit Count Type' },
    },
  },
  {
    path: 'reports/:amAuditCountType/:id',
    component: AmAuditCountListComponent,
    data: {
      core: { title: 'Audit Count List' },
    },
  },
  {
    path: 'individual-audit-plans',
    component: AmIndividualAuditPlansListComponent,
    data: {
      core: { title: 'Individual Audit Plans' },
      breadcrumb: 'Individual Audit Plans'
    }
  },
  // reports end here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditManagementRoutingModule { }
