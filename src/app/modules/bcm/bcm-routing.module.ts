import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBcStrategyComponent } from './pages/bc-strategy/pages/add-bc-strategy/add-bc-strategy.component';
import { BcStrategyDetailsComponent } from './pages/bc-strategy/pages/bc-strategy-details/bc-strategy-details.component';
import { BcStrategyListComponent } from './pages/bc-strategy/pages/bc-strategy-list/bc-strategy-list.component';
import { BcStrategyComponent } from './pages/bc-strategy/pages/bc-strategy.component';
import { EditBcStrategyComponent } from './pages/bc-strategy/pages/edit-bc-strategy/edit-bc-strategy.component';
import { BcpWorkflowDetailsComponent } from './pages/bcp-workflow/pages/bcp-workflow-details/bcp-workflow-details.component';
import { BcpWorkflowListComponent } from './pages/bcp-workflow/pages/bcp-workflow-list/bcp-workflow-list.component';
import { BcpWorkflowComponent } from './pages/bcp-workflow/pages/bcp-workflow.component';
import { BcpCalltreeComponent } from './pages/bcp/bcp-details/bcp-calltree/bcp-calltree.component';
import { BcpDetailsComponent } from './pages/bcp/bcp-details/bcp-details.component';
import { BcpInfoComponent } from './pages/bcp/bcp-details/bcp-info/bcp-info.component';
import { BcpListComponent } from './pages/bcp/bcp-list/bcp-list.component';
import { BcpComponent } from './pages/bcp/bcp.component';
import { BcpChangeRequestPageComponent } from './pages/bcp/bcp-details/app-bcp-change-request-component/app-bcp-change-request-component.component';
import { BiaMatrixConfigComponent } from './pages/bia-matrix/pages/bia-matrix-config/bia-matrix-config.component';
import { BiaRatingComponent } from './pages/bia-matrix/pages/bia-matrix-config/bia-rating/bia-rating.component';
import { BiaScaleComponent } from './pages/bia-matrix/pages/bia-matrix-config/bia-scale/bia-scale.component';
import { ImpactAreaComponent } from './pages/bia-matrix/pages/bia-matrix-config/impact-area/impact-area.component';
import { ImpactCategoryComponent } from './pages/bia-matrix/pages/bia-matrix-config/impact-category/impact-category.component';
import { ImpactScenarioComponent } from './pages/bia-matrix/pages/bia-matrix-config/impact-scenario/impact-scenario.component';
import { TierConfigComponent } from './pages/bia-matrix/pages/bia-matrix-config/tier-config/tier-config.component';
import { BiaMatrixDetailsComponent } from './pages/bia-matrix/pages/bia-matrix-details/bia-matrix-details.component';
import { BiaMatrixListComponent } from './pages/bia-matrix/pages/bia-matrix-list/bia-matrix-list.component';
import { BiaMatrixComponent } from './pages/bia-matrix/pages/bia-matrix.component';
import { BiaAddComponent } from './pages/bia/pages/bia-add/bia-add.component';
import { BiaDetailComponent } from './pages/bia/pages/bia-detail/bia-detail.component';
import { BiaEditComponent } from './pages/bia/pages/bia-edit/bia-edit.component';
import { BiaListComponent } from './pages/bia/pages/bia-list/bia-list.component';
import { BiaComponent } from './pages/bia/pages/bia.component';
import { RiskAssessmentAddComponent } from './pages/risk-assessment/pages/risk-assessment-add/risk-assessment-add.component';
import { BcmResidualRiskComponent } from './pages/risk-assessment/pages/risk-assessment-detail/bcm-residual-risk/bcm-residual-risk.component';
import { BcmRiskAssessmentComponent } from './pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-assessment/bcm-risk-assessment.component';
import { BcmRiskContextComponent } from './pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-context/bcm-risk-context.component';
import { BcmRiskJourneyComponent } from './pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-journey/bcm-risk-journey.component';
import { BcmRiskMappingComponent } from './pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-mapping/bcm-risk-mapping.component';
import { BcmRiskTreatmentComponent } from './pages/risk-assessment/pages/risk-assessment-detail/bcm-risk-treatment/bcm-risk-treatment.component';
import { RiskAssessmentDetailComponent } from './pages/risk-assessment/pages/risk-assessment-detail/risk-assessment-detail.component';
import { RiskAssessmentEditComponent } from './pages/risk-assessment/pages/risk-assessment-edit/risk-assessment-edit.component';
import { RiskAssessmentListComponent } from './pages/risk-assessment/pages/risk-assessment-list/risk-assessment-list.component';
import { RiskAssessmentComponent } from './pages/risk-assessment/pages/risk-assessment.component';
import { TestAndExerciseDetailsComponent } from './pages/test-exercise/pages/test-and-exercise-details/test-and-exercise-details.component';
import { TestAndExerciseInfoComponent } from './pages/test-exercise/pages/test-and-exercise-details/test-and-exercise-info/test-and-exercise-info.component';
import { TestAndExerciseOutcomeComponent } from './pages/test-exercise/pages/test-and-exercise-details/test-and-exercise-outcome/test-and-exercise-outcome.component';
import { TestAndExerciseListComponent } from './pages/test-exercise/pages/test-and-exercise-list/test-and-exercise-list.component';
import { TestAndExerciseComponent } from './pages/test-exercise/pages/test-and-exercise.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BcpVersionsComponent } from './pages/bcp/bcp-details/bcp-versions/bcp-versions.component';
import { BCMReportComponent } from './pages/reports/bcm-report.component';
import { BCMCountTypeComponent } from './pages/reports/bcm-count-type/bcm-count-type.component';
import { BCMCountListComponent } from './pages/reports/bcm-count-list/bcm-count-list.component';
import { BcpTemplateComponent } from './pages/bcp-template/bcp-template.component';
import { BcpTemplateListComponent } from './pages/bcp-template/bcp-template-list/bcp-template-list.component';
import { BcpTemplateDetailsComponent } from './pages/bcp-template/bcp-template-details/bcp-template-details.component';
import { TestAndExercisesActionPlanDetailsComponent } from './pages/test-exercise/pages/test-and-exercise-details/test-and-exercises-action-plan-details/test-and-exercises-action-plan-details.component';
import { BcpRiskAssessmentComponent } from './pages/bcp/bcp-details/bcp-risk-assessment/bcp-risk-assessment.component';
import { BcpBiaDetailsComponent } from './pages/bcp/bcp-details/bcp-bia-details/bcp-bia-details.component';
import { BcmOverviewComponent } from './pages/bcm-overview/bcm-overview.component';

const routes: Routes = [
  {
    path: 'bia-matrix',
    component: BiaMatrixComponent,
    data: {
      core: { title: 'BIA Matrix' },
    },
    children: [
      {
        path: '',
        component: BiaMatrixListComponent,
        data: {
          core: { title: 'BIA Matrix' },
          breadcrumb: 'bia_matrix'
        },
      },
    ]
  },
  {
    path: 'business-impact-analysis',
    component: BiaComponent,
    data: {
      core: { title: 'BIA' },
    },
    children: [
      {
        path: '',
        component: BiaListComponent,
        data: {
          core: { title: 'BIA' },
          breadcrumb: 'Business Imapact Analysis'
        },
      },
      {
        path: 'add',
        component: BiaAddComponent,
      },
      {
        path: 'edit',
        component: BiaEditComponent,
      },
      {
        path: ':id',
        component: BiaDetailComponent,
        data: {
          core: { title: 'Business Imapact Analysis' },
        }
      },

    ]
  },
  {
    path: 'bia-configuration',
    component: BiaMatrixConfigComponent,
    data: {
      core: { title: 'BIA Configuration' },
    },
    children: [
      {
        path: '',
        component: BiaRatingComponent
      },
      {
        path: 'bia-rating',
        component: BiaRatingComponent
      },
      {
        path: 'impact-category',
        component: ImpactCategoryComponent
      },
      {
        path: 'impact-scenario',
        component: ImpactScenarioComponent
      },
      {
        path: 'impact-area',
        component: ImpactAreaComponent
      },
      {
        path: 'bia-scale',
        component: BiaScaleComponent
      },
      {
        path: 'tier-config',
        component: TierConfigComponent
      },

    ]
  },
  {
    path: 'business-continuity-strategies',
    component: BcStrategyComponent,
    data: {
      core: { title: 'BC Strategy' },
    },
    children: [
      {
        path: '',
        component: BcStrategyListComponent,
        data: {
          breadcrumb: 'BC Strategies'
        },
      },
      {
        path: 'add',
        component: AddBcStrategyComponent,
      },
      {
        path: 'edit',
        component: EditBcStrategyComponent,
      },
      {
        path: ':id',
        component: BcStrategyDetailsComponent,
        data: {
          core: { title: 'BC Strategy' },
        }
      },

    ]
  },
  {
    path: 'business-continuity-plan',
    component: BcpComponent,
    data: {
      core: { title: 'Business Continuity Plan' },
    },
    children: [
      {
        path: '',
        component: BcpListComponent,
        data: {
          breadcrumb: 'Business Continuity Plan'
        },
      },
      {
        path: ':id',
        component: BcpDetailsComponent,
        // data: {
        //   breadcrumb: 'Business Continuity Plan Details'
        // },
        children: [
          {
            path: '',
            component: BcpInfoComponent,
            data: {
              core: { title: 'Business Continuity Plan Details' },

            }
          },
          {
            path: 'change-request',
            component: BcpChangeRequestPageComponent,
            data: {
              core: { title: 'BCP Change Request' },

            }
          },
          {
            path: 'call-tree',
            component: BcpCalltreeComponent,
            data: {
              core: { title: 'BCP Call Tree' },

            }
          },
          {
            path: 'version-history',
            component: BcpVersionsComponent,
            data: {
              core: { title: 'BCP Version History' },

            }
          },
          {
            path: 'risk-assessment',
            component: BcpRiskAssessmentComponent,
            data: {
              core: { title: 'Risk Assessment' },

            }
          },
          {
            path: 'bia',
            component: BcpBiaDetailsComponent,
            data: {
              core: { title: 'BIA' },

            }
          }
        ]
      }
    ]
  },
  {
    path: 'bcp-workflows',
    component: BcpWorkflowComponent,
    children: [
      {
        path: "",
        component: BcpWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: BcpWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  }, {
    path: 'risk-assessment',
    component: RiskAssessmentComponent,
    data: {
      core: { title: 'Risk Assessment' },
    },
    children: [
      {
        path: '',
        component: RiskAssessmentListComponent,
        data: {
          breadcrumb: 'Risk Assessments'
        },
      },
      {
        path: 'add',
        component: RiskAssessmentAddComponent,
      },
      {
        path: 'edit',
        component: RiskAssessmentEditComponent,
      },
      {
        path: ':id',
        component: RiskAssessmentDetailComponent,
        data: {
          core: { title: 'Risk Assessment Details' },
        },
        children: [
          {
            path: '',
            component: BcmRiskContextComponent,
            data: {
              core: { title: 'Risk Context' }
            }
          },
          {
            path: 'risk-mapping',
            component: BcmRiskMappingComponent,
            data: {
              core: { title: 'Risk Mapping' }
            }
          },
          {
            path: 'risk-assessment',
            component: BcmRiskAssessmentComponent,
            data: {
              core: { title: 'Risk Assessment' }
            }
          },
          {
            path: 'risk-treatment',
            component: BcmRiskTreatmentComponent,
            data: {
              core: { title: 'Risk Treatment' }
            }
          },
          {
            path: 'residual-risk',
            component: BcmResidualRiskComponent,
            data: {
              core: { title: 'Residual Risk' }
            }
          },
          {
            path: 'risk-journey',
            component: BcmRiskJourneyComponent,
            data: {
              core: { title: 'Risk Journey' }
            }
          },
        ]
      },

    ]
  },
  {
    path: 'test-and-exercises',
    component: TestAndExerciseComponent,
    data: {
      core: { title: 'Test & Exercise' },
    },
    children: [
      {
        path: '',
        component: TestAndExerciseListComponent,
        data: {
          breadcrumb: 'Test And Exercise'
        },
      },
      {
        path: ':id',
        component: TestAndExerciseDetailsComponent,
       
        children: [
          {
            path: '',
            component: TestAndExerciseInfoComponent,
            data: {
              core: { title: 'Test & Exercise' },
              breadcrumb: null
            },
          },
          {
            path: 'outcome',
            component: TestAndExerciseOutcomeComponent,
            data: {
              core: { title: 'Outcome' },
              breadcrumb: null
            },
          },
          {
            path: 'action-plan',
            component: TestAndExercisesActionPlanDetailsComponent,
            data: {
              core: { title: 'Test & Exercise' },
              breadcrumb: null
            },
          }
        ]
      },
    ]
  },
  {
    path: 'business-continuity-plan-template',
    component: BcpTemplateComponent,
    data: {
      core: { title: 'Bcp Template' },
    },
    children: [
      {
        path: '',
        component: BcpTemplateListComponent,
        data: {
          breadcrumb: 'Template'
        },
      },
      {
        path: ':id',
        component: BcpTemplateDetailsComponent,
      },

    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      core: { title: 'BCM Dashboard' },
    },
  },
  {
    path: 'user-guides',
    component: BcmOverviewComponent,
    data: {
      core: { title: 'Overview' },
    },
  },

  // bcm report start here
  {
    path: 'reports',
    component: BCMReportComponent,
    data: {
      core: { title: 'BCM Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:bcmCountType',
    component: BCMCountTypeComponent,
    data: {
      core: { title: 'BCM Count Type' },
    },
  },
  {
    path: 'reports/:bcmCountType/:id',
    component: BCMCountListComponent,
    data: {
      core: { title: 'BCM Count List' },
    },
  },
  // bcm reports end here

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BcmRoutingModule { }
