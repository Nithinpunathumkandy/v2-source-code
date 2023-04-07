import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsmsAssetCriticalityComponent } from './pages/isms-risk-configuration/isms-asset-criticality/isms-asset-criticality.component';
import { IsmsImpactComponent } from './pages/isms-risk-configuration/isms-impact/isms-impact.component';
import { IsmsLikelihoodComponent } from './pages/isms-risk-configuration/isms-likelihood/isms-likelihood.component';
import { IsmsRiskConfigurationComponent } from './pages/isms-risk-configuration/isms-risk-configuration.component';
import { IsmsRiskScoreComponent } from './pages/isms-risk-configuration/isms-risk-score/isms-risk-score.component';
import { IsmsHeatMapComponent } from './pages/isms-risk-heat-map/isms-heat-map/isms-heat-map.component';
import { IsmsHmByCategoryComponent } from './pages/isms-risk-heat-map/isms-hm-by-category/isms-hm-by-category.component';
import { IsmsHmByDepartmentComponent } from './pages/isms-risk-heat-map/isms-hm-by-department/isms-hm-by-department.component';
import { IsmsHmByDivisionComponent } from './pages/isms-risk-heat-map/isms-hm-by-division/isms-hm-by-division.component';
import { IsmsHmBySectionComponent } from './pages/isms-risk-heat-map/isms-hm-by-section/isms-hm-by-section.component';
import { IsmsHmBySourceComponent } from './pages/isms-risk-heat-map/isms-hm-by-source/isms-hm-by-source.component';
import { IsmsRiskHeatMapComponent } from './pages/isms-risk-heat-map/isms-risk-heat-map.component';
import { IsmsRiskMatrixComponent } from './pages/isms-risk-matrix/isms-risk-matrix.component';
import { IsmsImpactAnalysisComponent } from './pages/isms-risk-register/isms-risk-details/isms-impact-analysis/isms-impact-analysis.component';
import { IsmsKeyRiskIndicatorComponent } from './pages/isms-risk-register/isms-risk-details/isms-key-risk-indicator/isms-key-risk-indicator.component';
import { IsmsResidualRiskComponent } from './pages/isms-risk-register/isms-risk-details/isms-residual-risk/isms-residual-risk.component';
import { IsmsRiskAssessmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-assessment/isms-risk-assessment.component';
import { IsmsRiskContextComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-context/isms-risk-context.component';
import { IsmsRiskDetailsComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-details.component';
import { IsmsRiskJourneyComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-journey/isms-risk-journey.component';
import { IsmsRiskMappingComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-mapping/isms-risk-mapping.component';
import { AddIsmsRiskTreatmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-treatment/add-isms-risk-treatment/add-isms-risk-treatment.component';
import { EditIsmsRiskTreatmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-treatment/edit-isms-risk-treatment/edit-isms-risk-treatment.component';
import { IsmsRiskTreatmentComponent } from './pages/isms-risk-register/isms-risk-details/isms-risk-treatment/isms-risk-treatment.component';
import { IsmsRootCauseAnalysisComponent } from './pages/isms-risk-register/isms-risk-details/isms-root-cause-analysis/isms-root-cause-analysis.component';
import { IsmsAddRiskComponent } from './pages/isms-risk-register/isms-risk-list/isms-add-risk/isms-add-risk.component';
import { IsmsCorporateRiskListComponent } from './pages/isms-risk-register/isms-risk-list/isms-corporate-risk-list/isms-corporate-risk-list.component';
import { IsmsEditRiskComponent } from './pages/isms-risk-register/isms-risk-list/isms-edit-risk/isms-edit-risk.component';
import { IsmsRiskListComponent } from './pages/isms-risk-register/isms-risk-list/isms-risk-list.component';
import { IsmsRiskRegisterComponent } from './pages/isms-risk-register/isms-risk-register.component';
import { IsmsRiskWorkflowDetailsComponent } from './pages/isms-risk-workflow/isms-risk-workflow-details/isms-risk-workflow-details.component';
import { IsmsRiskWorkflowListComponent } from './pages/isms-risk-workflow/isms-risk-workflow-list/isms-risk-workflow-list.component';
import { IsmsRiskWorkflowComponent } from './pages/isms-risk-workflow/isms-risk-workflow.component';
import { SoaDetailsComponent } from './pages/soa/soa-details/soa-details.component';
import { SoaListComponent } from './pages/soa/soa-list/soa-list.component';
import { SoaComponent } from './pages/soa/soa.component';
import { IsmsRiskTreatmentPlansComponent } from './pages/treatments/isms-risk-treatments/isms-risk-treatment-plans/isms-risk-treatment-plans.component';
import { IsmsRiskTreatmentsComponent } from './pages/treatments/isms-risk-treatments/isms-risk-treatments.component';
import { IsmsRiskTreatmentDetailsComponent } from './pages/treatments/isms-treatment-details/isms-risk-treatment-details/isms-risk-treatment-details.component';
import { IsmsReportComponent } from './pages/report/isms-report/isms-report.component';
import { IsmsCountTypeComponent } from './pages/report/isms-count-type/isms-count-type.component';
import { IsmsCountListComponent } from './pages/report/isms-count-list/isms-count-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TopTenComponent } from './pages/dashboard/top-ten/top-ten.component';
import { RiskDetailsComponent } from './pages/dashboard/risk-details/risk-details.component';
import { IsmsOverviewComponent } from './pages/isms-overview/isms-overview.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  // {
  //   path: 'dashboard',
  //   component: RisksDashboardComponent,
  //   data: {
  //     core: { title: 'Dashboard' },
  //     breadcrumb: 'dashboard'
  //   }
  // },
  {
    path: 'corporate-isms-risks',
    component: IsmsRiskRegisterComponent,
    data: {
      core: { title: 'ISMS Corporate Risk Register' },
      breadcrumb: 'isms_corporate_risk_register'
    },
    children: [
      {
        path: '',
        component: IsmsCorporateRiskListComponent,
        data: {
          core: { title: 'ISMS Corporate Risk Register' },
          breadcrumb: 'isms_corporate_risk_register'
        },
      },
     
      {
        path: 'add-isms-risk',
        component: IsmsAddRiskComponent,
        data: {
          core: { title: 'Add ISMS Risk' },
          breadcrumb: null
        }
      },
      {
        path: 'edit-isms-risk',
        component: IsmsEditRiskComponent,
        data: {
          core: { title: 'Edit ISMS Risk' },
          breadcrumb: null
        }
      },
      {
        path: ':id',
        component: IsmsRiskDetailsComponent,
        children: [

          {
            path: '',
            component: IsmsRiskContextComponent,
            data: {
              core: { title: 'ISMS Risk Context' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-mapping',
            component: IsmsRiskMappingComponent,
            data: {
              core: { title: 'ISMS Risk Mapping' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-assessment',
            component: IsmsRiskAssessmentComponent,
            data: {
              core: { title: 'ISMS Risk Assessment' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-treatment',
            component: IsmsRiskTreatmentComponent,
            data: {
              core: { title: 'ISMS Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-residual-risk',
            component: IsmsResidualRiskComponent,
            data: {
              core: { title: 'ISMS Residual Risk' },
              breadcrumb: null
            }
          },
          {
            path: 'add-isms-risk-treatment',
            component: AddIsmsRiskTreatmentComponent,
            data: {
              core: { title: 'Add ISMS Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'edit-isms-risk-treatment',
            component: EditIsmsRiskTreatmentComponent,
            data: {
              core: { title: 'Edit ISMS Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-root-cause-analyses',
            component: IsmsRootCauseAnalysisComponent,
            data: {
              core: { title: 'Root Cause Analyses' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-key-risk-indicators',
            component: IsmsKeyRiskIndicatorComponent,
            data: {
              core: { title: 'Key Risk Indicators' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-impact-analysis',
            component: IsmsImpactAnalysisComponent,
            data: {
              core: { title: 'Impact Analysis' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-journey',
            component: IsmsRiskJourneyComponent,
            data: {
              core: { title: 'Risk Journey' },
              breadcrumb: null
            }
          },
        ]
      },
    ]
  },
  {
    path: 'isms-risks',
    component: IsmsRiskRegisterComponent,
    data: {
      core: { title: 'ISMS Risk Register' },
      breadcrumb: 'isms_risk_register'
    },
    children: [
      {
        path: '',
        component: IsmsRiskListComponent,
        data: {
          core: { title: 'ISMS Risk Register' },
          breadcrumb: 'isms_risk_register'
        },
      },

     
      {
        path: 'add-isms-risk',
        component: IsmsAddRiskComponent,
        data: {
          core: { title: 'Add ISMS Risk' },
          breadcrumb: null
        }
      },
      {
        path: 'edit-isms-risk',
        component: IsmsEditRiskComponent,
        data: {
          core: { title: 'Edit Risk' },
          breadcrumb: null
        }
      },
      {
        path: ':id',
        component: IsmsRiskDetailsComponent,
        children: [

          {
            path: '',
            component: IsmsRiskContextComponent,
            data: {
              core: { title: 'ISMS Risk Context' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-mapping',
            component: IsmsRiskMappingComponent,
            data: {
              core: { title: 'ISMS Risk Mapping' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-assessment',
            component: IsmsRiskAssessmentComponent,
            data: {
              core: { title: 'ISMS Risk Assessment' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-treatment',
            component: IsmsRiskTreatmentComponent,
            data: {
              core: { title: 'ISMS Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-residual-risk',
            component: IsmsResidualRiskComponent,
            data: {
              core: { title: 'ISMS Residual Risk' },
              breadcrumb: null
            }
          },
          {
            path: 'add-isms-risk-treatment',
            component: AddIsmsRiskTreatmentComponent,
            data: {
              core: { title: 'Add ISMS Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'edit-isms-risk-treatment',
            component: EditIsmsRiskTreatmentComponent,
            data: {
              core: { title: 'Edit ISMS Risk Treatment' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-root-cause-analyses',
            component: IsmsRootCauseAnalysisComponent,
            data: {
              core: { title: 'Root Cause Analyses' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-key-risk-indicators',
            component: IsmsKeyRiskIndicatorComponent,
            data: {
              core: { title: 'Key Risk Indicators' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-impact-analysis',
            component: IsmsImpactAnalysisComponent,
            data: {
              core: { title: 'Impact Analysis' },
              breadcrumb: null
            }
          },
          {
            path: 'isms-risk-journey',
            component: IsmsRiskJourneyComponent,
            data: {
              core: { title: 'Risk Journey' },
              breadcrumb: null
            }
          },
        ]
      },
    

    ],
  },


  {
    path: 'reports',
    component: IsmsReportComponent,
    data: {
      core: { title: 'Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'user-guides',
    component: IsmsOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb: 'Overview'
    },
  },
  {
    path: 'reports/:ismscountType',
    component: IsmsCountTypeComponent,
    data: {
      core: { title: 'Isms Count Type' },
    },
  },
  {
    path: 'reports/:ismscountType/:id',
    component: IsmsCountListComponent,
    data: {
      core: { title: 'Isms Count List' },
    },
  },

  {
    path: 'isms-risk-matrix',
    component: IsmsRiskMatrixComponent,
    data: {
      core: { title: 'Risk Matrix' },
      breadcrumb: 'risk_matrix'
    }
  },
  {
    path: 'isms-risk-heat-map',
    component: IsmsRiskHeatMapComponent,

    children: [
      {
        path: '',
        component: IsmsHeatMapComponent,
        data: {
          core: { title: 'Risk Heat-Map' },
          breadcrumb: 'risk_heat_map'
        },
      },
      {
        path: 'by-category',
        component: IsmsHmByCategoryComponent,
        data: {
          core: { title: 'Heat-Map by Category' },
          breadcrumb: null
        },
      },
      {
        path: 'by-department',
        component: IsmsHmByDepartmentComponent,
        data: {
          core: { title: 'Heat-Map by Department' },
          breadcrumb: null
        },
      },
      {
        path: 'by-division',
        component: IsmsHmByDivisionComponent,
        data: {
          core: { title: 'Heat-Map by Division' },
          breadcrumb: null
        },
      },
      {
        path: 'by-section',
        component: IsmsHmBySectionComponent,
        data: {
          core: { title: 'Heat-Map by Section' },
          breadcrumb: null
        },
      },
      {
        path: 'by-source',
        component: IsmsHmBySourceComponent,
        data: {
          core: { title: 'Heat-Map by Source' },
          breadcrumb: null
        },
      },

    ]
  },
  {
    path: 'isms-risk-configuration',
    component: IsmsRiskConfigurationComponent,
    children: [

      {
        path: '',
        component: IsmsAssetCriticalityComponent,
        data: {
          core: { title: 'Asset Criticality' },
          breadcrumb: null
        }
      },
      {
        path: 'isms-likelihood',
        component: IsmsLikelihoodComponent,
        data: {
          core: { title: 'Likelihood' },
          breadcrumb: null
        }
      },
      {
        path: 'isms-impact',
        component: IsmsImpactComponent,
        data: {
          core: { title: 'Impact' },
          breadcrumb: null
        }
      },
      {
        path: 'isms-risk-score',
        component: IsmsRiskScoreComponent,
        data: {
          core: { title: 'Risk Score' },
          breadcrumb: null
        }
      },
    ]
  },
  {
    path: 'isms-risk-treatments',
    component: IsmsRiskTreatmentsComponent,
    children: [
      {
        path: '',
        component: IsmsRiskTreatmentPlansComponent,
        data: {
          core: { title: 'ISMS Risk Treatments' },
          breadcrumb: 'ISMS Risk Treatments'
        }
      },
      {
        path: 'add-isms-risk-treatment-plan',
        component: AddIsmsRiskTreatmentComponent,
        data: {
          core: { title: 'Add ISMS Risk Treatment plan' },
          breadcrumb: null
        }
      },
      {
        path: 'edit-isms-risk-treatment-plan',
        component: EditIsmsRiskTreatmentComponent,
        data: {
          core: { title: 'Edit ISMS Risk Treatment plan' },
          breadcrumb: null
        }
      },
    ]
  },
  {
    path: 'isms-risk-treatment',
    component: IsmsRiskTreatmentsComponent,
    children: [
      {
        path: ':id',
        component: IsmsRiskTreatmentDetailsComponent,
        data: {
          core: { title: 'ISMS Risk Treatment Details' },
          breadcrumb: null
        }
      },
    ]
  },
  

  {
    path: 'workflow',
    component: IsmsRiskWorkflowComponent,
    children: [
      {
        path: "",
        component: IsmsRiskWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: IsmsRiskWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  },

  {
    path: 'soa',
    component: SoaComponent,
    children: [
      {
        path: "",
        component: SoaListComponent,
        data: {
          core: { title: 'Statement of Applicability' },
          breadcrumb: 'statement_of_applicability'
        }
      },
      {
        path: ':id',
        component: SoaDetailsComponent,
        data: {
          core: { title: 'Statement of Applicability Info' },

        }
      },
    ]
  },

  // dashboard start here
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: 'dashboard'
    },
  },
  {
    path: 'dashboard/top-ten',
    component: TopTenComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: 'dashboard'
    },
  },
  {
    path: 'dashboard/risk-details',
    component: RiskDetailsComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: 'dashboard'
    },
  },
  // dashboard end here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IsmsRoutingModule { }
