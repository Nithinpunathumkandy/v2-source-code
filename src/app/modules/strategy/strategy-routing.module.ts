import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StrategyListComponent } from "src/app/modules/strategy/pages/strategy/strategy-list/strategy-list.component";
import { ActionPlanDetailsComponent } from './pages/action-plans/action-plan-details/action-plan-details.component';
import { ActionPlanInfoComponent } from './pages/action-plans/action-plan-details/action-plan-info/action-plan-info.component';
import { ActionPlansListComponent } from './pages/action-plans/action-plans-list/action-plans-list.component';
import { AddInitiativeComponent } from './pages/initiatives/add-initiative/add-initiative.component';
import { EditInitiativeComponent } from './pages/initiatives/edit-initiative/edit-initiative.component';
import { InitiativeDetailsComponent } from './pages/initiatives/initiative-details/initiative-details.component';
import { InitiativeInfoComponent } from './pages/initiatives/initiative-details/initiative-info/initiative-info.component';
import { InitiativeMilestonesComponent } from './pages/initiatives/initiative-details/initiative-milestones/initiative-milestones.component';
import { InitiativeListComponent } from './pages/initiatives/initiative-list/initiative-list.component';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import { KpiDetailsComponent } from './pages/kpi/kpi-details/kpi-details.component';
import { KpiInfoComponent } from './pages/kpi/kpi-details/kpi-info/kpi-info.component';
import { KpiListComponent } from './pages/kpi/kpi-list/kpi-list.component';
import { StrategyObjectiveReviewComponent } from './pages/review/strategy-review/strategy-objective-review/strategy-objective-review.component';
import { StrategyReviewComponent } from './pages/review/strategy-review/strategy-review.component';
import { StrategyMappingListComponent } from './pages/strategy-mapping/strategy-mapping-list/strategy-mapping-list.component';
import { StrategyMappingComponent } from './pages/strategy-mapping/strategy-mapping.component';
import { StrategyWorkflowDetailsComponent } from './pages/strategy-workflow-engine/strategy-workflow-details/strategy-workflow-details.component';
import { StrategyWorkflowEngineComponent } from './pages/strategy-workflow-engine/strategy-workflow-engine.component';
import { StrategyWorkflowListComponent } from './pages/strategy-workflow-engine/strategy-workflow-list/strategy-workflow-list.component';
import { AddStrategyComponent } from './pages/strategy/add-strategy/add-strategy.component';
import { EditStrategyComponent } from './pages/strategy/edit-strategy/edit-strategy.component';
import { StrategyDetailsComponent } from './pages/strategy/strategy-details/strategy-details.component';
import { StrategyFocusAreaComponent } from './pages/strategy/strategy-details/strategy-focus-area/strategy-focus-area.component';
import { StrategyInfoComponent } from './pages/strategy/strategy-details/strategy-info/strategy-info.component';
import { StrategyObjectivesComponent } from './pages/strategy/strategy-details/strategy-objectives/strategy-objectives.component';
import { StrategyComponent } from './pages/strategy/strategy.component';
import { DashbordComponent } from './pages/dashboard/dashbord/dashbord.component';
import { OnGoiningProfilesComponent } from './pages/dashboard/on-goining-profiles/on-goining-profiles.component';
import { OnGoingProfileDetailsComponent } from './pages/dashboard/on-going-profile-details/on-going-profile-details.component';
import { InfoComponent } from './pages/dashboard/on-going-profile-details/info/info.component';
import { KpiScoreChartComponent } from './pages/dashboard/kpi-score-chart/kpi-score-chart.component';
import { StrategyReportComponent } from './pages/repotrs/strategy-report/strategy-report.component';
import { StrategyCountListComponent } from './pages/repotrs/strategy-report/strategy-count-list/strategy-count-list.component';
import { StrategyCountTypeComponent } from './pages/repotrs/strategy-report/strategy-count-type/strategy-count-type.component';
import { ScoreComponent } from './pages/score/score/score.component';
import { ObjectiveScoreComponent } from './pages/objective-score/objective-score/objective-score.component';
import { DetailsComponent } from './pages/objective-score/objective-score/details/details.component';
import { StrategyObjectivePlanComponent } from './pages/review/strategy-review/strategy-objective-plan/strategy-objective-plan.component';
import { ObjectiveFrequenyListComponent } from './pages/objective-score/objective-score/objective-frequeny-list/objective-frequeny-list.component';
import { KpiFrequencyListComponent } from './pages/kpi/kpi-details/kpi-frequency-list/kpi-frequency-list.component';
import { StrategyReportBookComponent } from './pages/strategy-report-book/strategy-report-book.component';
import { StrategyOverviewComponent } from './pages/strategy-overview/strategy-overview.component';
import { StrategyInitiativesComponent } from './pages/strategy/strategy-details/strategy-initiatives/strategy-initiatives.component';
import { StrategyDashboardComponent } from './pages/dashboard/strategy-dashboard/strategy-dashboard.component';
import { StrategyMilestoneComponent } from './pages/strategy/strategy-details/strategy-milestone/strategy-milestone.component';
import { StrategyRoleDetailsComponent } from './pages/strategy-role-details/strategy-role-details.component';
import { StrategyDepartmentDetailsComponent } from './pages/strategy-department-details/strategy-department-details.component';
import { StrategyMappingDetailsComponent } from './pages/strategy-mapping-details/strategy-mapping-details.component';
import { MappingFocusAreaInfoComponent } from './pages/strategy-mapping-details/mapping-focus-area-info/mapping-focus-area-info.component';
import { MappingObjectiveInfoComponent } from './pages/strategy-mapping-details/mapping-objective-info/mapping-objective-info.component';
import { RiskListComponent } from './pages/dashboard/risk-list/risk-list.component';
import { StrategyScoringMatrixComponent } from './pages/strategy-scoring-matrix/strategy-scoring-matrix.component';


const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
  },
  {
    path: "strategy-profiles",
    component: StrategyComponent,
    data: {
      core: { title: "Strategy Profile" },
      breadcrumb: 'strategy_profile',
    },
    children: [
      {
        path: "",
        component: StrategyListComponent,
        data: {
          core: { title: "Strategy Profile" },
          breadcrumb: 'strategy_profile',
        },
      },
      {
        path: "add",
        component: AddStrategyComponent,
        data: {
          core: { title: "New Strategy" }
        },
      },
      {
        path: "edit",
        component: EditStrategyComponent,
        data: {
          core: { title: "Edit Strategy" }
        },
      },
      {
        path: ":id",
        component: StrategyDetailsComponent,
        children: [
          {
            path: "",
            component: StrategyInfoComponent,
            data: {
              core: { title: "Strategy Info" },
            },
          },
          {
            path: "focus-areas",
            component: StrategyFocusAreaComponent,
            data: {
              core: { title: "Strategy Focus Areas" },
            },
          },
          {
            path: "objectives",
            component: StrategyObjectivesComponent,
            data: {
              core: { title: "Strategy Objectives" },
            },
          },
          {
            path: "initiatives",
            component: StrategyInitiativesComponent,
            data: {
              core: { title: "Strategy Initiatives" },
            },
          },
          {
            path: "action-plans",
            component: StrategyMilestoneComponent,
            data: {
              core: { title: "Strategy Milestone" },
            },
          },
        ]
      },
    ]
  },

  {
    path: "strategy-initiatives",
    component: InitiativesComponent,
    data: {
      core: { title: "Initiative" },
      breadcrumb: 'initiative',
    },
    children: [
      {
        path: "",
        component: InitiativeListComponent,
        data: {
          core: { title: "Initiative" },
          breadcrumb: 'initiative',
        },
      },
      {
        path: "add",
        component: AddInitiativeComponent,
        data: {
          core: { title: "New Initiative" }
        },
      },
      {
        path: "edit",
        component: EditInitiativeComponent,
        data: {
          core: { title: "Edit Initiative" }
        },
      },
      {
        path: ":id",
        component: InitiativeDetailsComponent,
        children: [
          {
            path: "",
            component: InitiativeInfoComponent,
            data: {
              core: { title: "Initiative Info" },
            },
          },
          {
            path: "initiative-milestones",
            component: InitiativeMilestonesComponent,
            data: {
              core: { title: "Initiative Milestone" },
            },
          }
        ]
      },
    ]
  },
  {
    path:'strategy-profiles-scoring-matrix',
    component:StrategyScoringMatrixComponent,
    data:{
      core:{title:"Strategy Scoring Matrix"}
    }
  },
  {
    path: "strategy-mappings",
    component: StrategyMappingComponent,
    data: {
      core: { title: "Strategy Mapping" },
      breadcrumb: 'strategy_mapping',
    },
  },
  {
    path: "strategy-mapping-details",
    component: StrategyMappingDetailsComponent,
    children: [
      {
        path: "focus-area",
        component: MappingFocusAreaInfoComponent,
        data: {
          core: { title: "Focus Area Info" },
        },
      },
      {
        path: "objective",
        component: MappingObjectiveInfoComponent,
        data: {
          core: { title: "Objective Info" },
        },
      },
      // {
      //   path: "objectives",
      //   component: StrategyObjectivesComponent,
      //   data: {
      //     core: { title: "Strategy Objectives" },
      //   },
      // },
      // {
      //   path: "initiatives",
      //   component: StrategyInitiativesComponent,
      //   data: {
      //     core: { title: "Strategy Initiatives" },
      //   },
      // },
      // {
      //   path: "action-plans",
      //   component: StrategyMilestoneComponent,
      //   data: {
      //     core: { title: "Strategy Milestone" },
      //   },
      // },
    ]
  },
  {
    path : "strategy-role-details",
    component: StrategyRoleDetailsComponent,
    data:{
      core: { title: "Strategy Mapping Role" },
          breadcrumb: null,
    }
  },
  {
    path : "strategy-department-details",
    component: StrategyDepartmentDetailsComponent,
    data:{
      core: { title: "Strategy Mapping Department" },
          breadcrumb: null,
    }
  },
  {
    path: "user-guides",
    component: StrategyOverviewComponent,
    data: {
      core: { title: "Overview" },
      // breadcrumb: null,
    },
  },
  {
    path: 'strategy-mappings/:id',
    component: StrategyMappingComponent,
    data: {
      core: { title: 'Strategy Mapping' },
      breadcrumb: null
    },
  },
  {
    path: 'strategy-workflows',
    component: StrategyWorkflowEngineComponent,
    children: [
      {
        path: "",
        component: StrategyWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },
      {
        path: ':id',
        component: StrategyWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },

        }
      },
    ]
  },
  {
    path: "strategy-reviews",
    component: StrategyReviewComponent,
    data: {
      core: { title: "Review" },
      breadcrumb: 'Review',
    },
    children: [
      {
        path: "",
        component: StrategyObjectiveReviewComponent,
        data: {
          core: { title: "Strategy Review" },
        },

      },
      {
        path: "plan",
        component: StrategyObjectivePlanComponent,
        data: {
          core: { title: "Strategy Plan" },
        },

      },
    ]
  },

  {
    path: "strategy-kpis",
    component: KpiListComponent,
    data: {
      core: { title: "KPIS" },
      breadcrumb: 'KPIS',
    },
  },
  {
    path: 'strategy-kpis',
    component: KpiDetailsComponent,
    // data: {
    //   core: { title: "KPIS" },
    //   breadcrumb: 'KPIS',
    // },
    children: [
      {
        path: ':id',
        component: KpiInfoComponent,
        // data: {
        //   core: { title: "KPIS" },
        //   breadcrumb: 'KPIS',
        // }
      },
      {
        path: ':id/frequencies',
        component: KpiFrequencyListComponent,
        //   data: {
        //    core: { title: "KPI Frequencies" },
        //    breadcrumb: 'KPI Frequencies',
        //  },
      }
    ]
  },

  {
    path: "strategy-action-plans",
    component: ActionPlansListComponent,
    data: {
      core: { title: "Action Plans" },
      breadcrumb: 'Action Plans',
    },
  },
  {
    path: 'strategy-action-plan',
    component: ActionPlanDetailsComponent,
    data: {
      core: { title: "Action Plans" },
      breadcrumb: 'Action Plans',
    },
    children: [
      {
        path: ':id',
        component: ActionPlanInfoComponent,
        data: {
          core: { title: "Action Plans" },
          breadcrumb: 'Action Plans',
        }
      }
    ]
  },
  {
    path: "dashboard",
    component: StrategyDashboardComponent,
    data: {
      core: { title: "Dashboard" },
      breadcrumb: 'Dashboard',
    },
  },
  {
    path: 'risk-list',
    component: RiskListComponent,
    data: {
      core: { title: "Risk List" },
    }
  },
  {
    path: "on-going-profiles",
    component: OnGoiningProfilesComponent,
    data: {
      core: { title: "Profiles" },
      breadcrumb: 'Profiles',
    },
  },
  {
    path: "profiles-details",
    component: OnGoingProfileDetailsComponent,
    data: {
      core: { title: "Profiles" },
      breadcrumb: 'Profiles',
    },
    children: [
      {
        path: ":id",
        component: InfoComponent,
        data: {
          core: { title: "Details" },
          breadcrumb: 'Details',
        },
      }
    ]
  },
  {
    path: "kpi-score",
    component: KpiScoreChartComponent,
    data: {
      core: { title: "KPI Score Chart" },
      breadcrumb: 'KPI Score Chart',
    }
  },
  {
    path: 'report',
    component: StrategyReportComponent,
    data: {
      core: { title: 'Strategy Profile Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'report/:riskcountType',
    component: StrategyCountTypeComponent,
    data: {
      core: { title: 'Stretegy Count Type' },
    },
  },
  {
    path: 'report/:riskcountType/:id',
    component: StrategyCountListComponent,
    data: {
      core: { title: 'Strategy Count List' },
    },
  },
  {
    path: 'strategy-scoring',
    component: ScoreComponent,
    data: {
      core: { title: "Strategy Score" },
      breadcrumb: 'Strategy Score',
    }
  },
  {
    path: 'objectives',
    component: ObjectiveScoreComponent,
    // data: {
    //   core: { title: "Objective Score" },
    //   breadcrumb: 'Objective Score',
    // },
    children: [
      {
        path: ':id',
        component: DetailsComponent,
        // data: {
        //   core: { title: "Objective Score" },
        //   breadcrumb: 'Objective Score',
        // },
      },
      {
        path: ':id/frequencies',
        component: ObjectiveFrequenyListComponent,
        //  data: {
        //   core: { title: "Objective Frequencies" },
        //   breadcrumb: 'Objective Frequencies',
        // },
      }

    ]

  },

  {
    path: "strategy-reports/:id",
    component: StrategyReportBookComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategyRoutingModule { }
