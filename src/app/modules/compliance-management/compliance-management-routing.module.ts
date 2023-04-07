import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComplianceDashboardComponent } from './pages/compliance-dashboard/compliance-dashboard.component';
import { AddComplianceRegisterComponent } from './pages/compliance-register/add-compliance-register/add-compliance-register.component';
import { ComplianceRegisterDetailsComponent } from './pages/compliance-register/compliance-register-details/compliance-register-details.component';
import { ComplianceRegisterListComponent } from './pages/compliance-register/compliance-register-list/compliance-register-list.component';
import { ComplianceRegisterComponent } from './pages/compliance-register/compliance-register.component';
// import { EditComplianceRegisterComponent } from './pages/compliance-register/edit-compliance-register/edit-compliance-register.component';
import { SlaContractDetailsComponent } from './pages/sla-contract/sla-contract-details/sla-contract-details.component';
import { SlaContractListComponent } from './pages/sla-contract/sla-contract-list/sla-contract-list.component';
import { SlaContractComponent } from './pages/sla-contract/sla-contract.component';
import { ComplianceReportComponent } from './pages/compliance-report/compliance-report.component';
import { ComplianceCountTypeComponent } from './pages/compliance-report/compliance-count-type/compliance-count-type.component';
import { ComplianceCountListComponent } from './pages/compliance-report/compliance-count-list/compliance-count-list.component';
import { ComplianceWorkflowComponent } from './pages/compliance-workflow/compliance-workflow.component';
import { ComplianceWorkflowListComponent } from './pages/compliance-workflow/pages/compliance-workflow-list/compliance-workflow-list.component';
import { ComplianceWorkflowDetailsComponent } from './pages/compliance-workflow/pages/compliance-workflow-details/compliance-workflow-details.component';
import { ComplianceRegisterMappingComponent } from './pages/compliance-register/compliance-register-details/compliance-register-mapping/compliance-register-mapping.component';
import { ComplianceRegisterRouterComponent } from './pages/compliance-register/compliance-register-details/compliance-register-router/compliance-register-router.component';
import { SlaContractMappingComponent } from './pages/sla-contract/sla-contract-details/sla-contract-mapping/sla-contract-mapping.component';
import { SlaContractInfoComponent } from './pages/sla-contract/sla-contract-details/sla-contract-info/sla-contract-info.component';
import { ComplianceActionPlansComponent } from './pages/compliance-action-plans/compliance-action-plans.component';
import { ComplianceActionPlansListComponent } from './pages/compliance-action-plans/compliance-action-plans-list/compliance-action-plans-list.component';
import { ComplianceActionPlansDetailsComponent } from './pages/compliance-action-plans/compliance-action-plans-details/compliance-action-plans-details.component';
import { ComplianceRegisterActionPlansComponent } from './pages/compliance-register/compliance-register-details/compliance-register-action-plans/compliance-register-action-plans.component';
import { ComplianceOverviewComponent } from './pages/compliance-overview/compliance-overview.component';
import { ComplainceChecklistComponent } from './pages/complaince-checklist/complaince-checklist.component';
import { ComplainceChecklitDetailsComponent } from './pages/complaince-checklist/complaince-checklit-details/complaince-checklit-details.component';
import { ContractAssessmentsComponent } from './pages/contract-assessments/contract-assessments.component';
import { ContractAssessmentListComponent } from './pages/contract-assessments/contract-assessment-list/contract-assessment-list.component';
import { ContractAssessmentDetailsComponent } from './pages/contract-assessments/contract-assessment-details/contract-assessment-details.component';


const routes: Routes = [
  {
      path: 'dashboard',
      component: ComplianceDashboardComponent,
      data: {
        core: { title: 'Dashboard' },
        breadcrumb:'compliance_dashboard'
      },
  },
  {
    path: 'user-guides',
    component: ComplianceOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb:'compliance_overview'
    },
},
  {
    path: 'sla-and-contracts',
    component: SlaContractComponent,
    children: [
      {
        path: '',
        component: SlaContractListComponent,
        data: {
          core: { title: 'SLA & Contracts List' },
          breadcrumb: 'sla_contracts_list'
        }
      },      
      {
        path: ':id',
        component: SlaContractDetailsComponent,
        // data: {
        //   core: { title: 'SLA Contract Details' },
        //   breadcrumb: null
        // },
        children:[
          {
            path: '',
            component: SlaContractInfoComponent,
            data: {
              core: { title: 'SLA Contract Details' },
              breadcrumb: null
            }
          }, 
          {
            path: 'sla-contract-mapping',
            component: SlaContractMappingComponent,
            data: {
              core: { title: 'SLA Contract Details' },
              breadcrumb: null
            }
          }
        ]
      }
    ]
  },
  {
    path: 'compliance-registers',
    component: ComplianceRegisterComponent,
    data: {
      core: { title: 'Compliance Register' },
      breadcrumb: 'compliance_register'
    },
    children: [
      {
        path: '',
        component: ComplianceRegisterListComponent,
        data: {
          core: { title: 'Compliance Register' },
          // breadcrumb: 'Compliance Register List'
        }
      },
      {
        path: ':id',
        component: ComplianceRegisterRouterComponent,
        data: {
          core: { title: 'Compliance Register Details' },
          
        },
        children: [          
          {
            path: "",
            component: ComplianceRegisterDetailsComponent,
            data: {
              core: { title: 'Compliance Register Details' },
              
            }
          },
          {
            path: 'compliance-mapping',
            component: ComplianceRegisterMappingComponent,
            data: {
              core: { title: "Compliance Register Mapping" },
            }
          },
          {
            path: 'compliance-action-plans',
            component: ComplianceRegisterActionPlansComponent,
            data: {
              core: { title: "Compliance Register Action Plans" },
            }
          },
        ]
      },
       
      // {
      //   path: 'edit-compliance-register',
      //   component: EditComplianceRegisterComponent,
      //   data: {
      //     core: { title: 'Edit Compliance Register' },
      //     breadcrumb: null
      //   }
      // },
      {
        path: 'add-compliance-register',
        component: AddComplianceRegisterComponent,
        data: {
          core: { title: 'Add Compliance Register' },
          breadcrumb: null
        }
      }, 
     
    ]
  },
  {
    path: 'reports',
    component: ComplianceReportComponent,
    data: {
      core: { title: 'Compliance Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: ComplianceCountTypeComponent,
    data: {
      core: { title: 'Compliance Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: ComplianceCountListComponent,
    data: {
      core: { title: 'Compliance Count List' },
    },
  },{
    path:'compliance-workflows',
    component:ComplianceWorkflowComponent,
    children:[
      {
        path:'',
        component:ComplianceWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: ComplianceWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },
        }
      }
    ]
  },
  {
    path:'action-plans',
    component:ComplianceActionPlansComponent,
    children:[
      {
        path: '',
        component: ComplianceActionPlansListComponent,
        data: {
          core: { title: 'Actionplans' },
          breadcrumb: 'Actionplans'
        },
      },
      {
        path: ':id',
        component: ComplianceActionPlansDetailsComponent,
        data: {
          core: { title: 'Actionplan Details' },
          breadcrumb: null
        },
      },
    ]
  },
  {
    path: 'checklists',
    component: ComplainceChecklistComponent,
    data: {
      core: { title: 'Compliance Checklists' },
      breadcrumb: null
    }
  }, 
  {
    path: 'checklists/:id',
    component: ComplainceChecklitDetailsComponent,
    data: {
      core: { title: 'Compliance Checklists Details' },
      breadcrumb: null
    }
  }, 
  {
    path: 'contract-assessments',
    component: ContractAssessmentsComponent,
    data: {
      core: { title: 'Contract Assessment' },
      breadcrumb: null
    },
    children:[
      {
        path: '',
        component: ContractAssessmentListComponent,
        data: {
          core: { title: 'Contract Assessment' },
          breadcrumb: 'Contract Assessment'
        },
      },
      {
        path: ':id',
        component: ContractAssessmentDetailsComponent,
        data: {
          core: { title: 'Assessment Details' },
          breadcrumb: null
        },
      },
    ]
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianceManagementRoutingModule { }
