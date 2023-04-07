import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { KpiDetialsComponent } from './pages/dashboard/kpi-detials/kpi-detials.component';
import { KpiMainDashbordComponent } from './pages/dashboard/kpi-main-dashbord/kpi-main-dashbord.component';
import { PendingReviewsComponent } from './pages/dashboard/pending-reviews/pending-reviews.component';
import { ImprovementPlansDetailsComponent } from './pages/improvement-plans/improvement-plans-details/improvement-plans-details.component';
import { ImprovementPlansListComponent } from './pages/improvement-plans/improvement-plans-list/improvement-plans-list.component';
import { ImprovementPlansComponent } from './pages/improvement-plans/improvement-plans.component';
import { KpiOverviewComponent } from './pages/kpi-overview/kpi-overview.component';
import { InfoScoreComponent } from './pages/kpi-score/kpi-score-detials/info-score/info-score.component';
import { KpiScoreDetialsComponent } from './pages/kpi-score/kpi-score-detials/kpi-score-detials.component';
import { KpiScoreListComponent } from './pages/kpi-score/kpi-score-list/kpi-score-list.component';
import { KpiScoreComponent } from './pages/kpi-score/kpi-score.component';
import { KpiAddComponent } from './pages/kpi/kpi-add/kpi-add.component';
import { ImprovementPlanComponent } from './pages/kpi/kpi-details/improvement-plan/improvement-plan.component';
import { InfoComponent } from './pages/kpi/kpi-details/info/info.component';
import { KpiDetailsComponent } from './pages/kpi/kpi-details/kpi-details.component';
import { ScoreComponent } from './pages/kpi/kpi-details/score/score.component';
import { KpiEditComponent } from './pages/kpi/kpi-edit/kpi-edit.component';
import { KpiListComponent } from './pages/kpi/kpi-list/kpi-list.component';
import { KpiComponent } from './pages/kpi/kpi.component';
import { KpiCountListComponent } from './pages/reports/kpi-count-list/kpi-count-list.component';
import { KpiCountTypeComponent } from './pages/reports/kpi-count-type/kpi-count-type.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { KpiWorkflowComponent } from './pages/workflow/kpi-workflow.component';
import { KpiWorkflowDetailsComponent } from './pages/workflow/pages/kpi-workflow-details/kpi-workflow-details.component';
import { KpiWorkflowListComponent } from './pages/workflow/pages/kpi-workflow-list/kpi-workflow-list.component';


const routes: Routes = [
  {
    path:'kpis',
    component:KpiComponent,
    data: {
      core: { title: "KPI" },
      breadcrumb: 'KPIS',
    },
    children:[
      {
        path:"",
        component:KpiListComponent,
        data: {
          core: { title: "List" },
          breadcrumb: 'KPIS'
        },
      },
      {
        path:'add-kpi',
        component:KpiAddComponent,
        data: {
          core: { title: "Add KPI" },
          breadcrumb: null
        },
      },
      {
        path:'edit-kpi',
        component:KpiEditComponent,
        data: {
          core: { title: "Edit KPI" },
          breadcrumb: null
        },
      },
      {
        path:':id',
        component:KpiDetailsComponent,
        children:[
          {
            path: '',
              component: InfoComponent,
              data: {
                core: { title: 'Info' },
                breadcrumb: null
              }
          },
          {
            path: 'score',
            component: ScoreComponent,
            data: {
              core: { title: 'Score' },
              breadcrumb: null
            }
          },
          {
            path: 'improvement-plans',
            component: ImprovementPlanComponent,
            data: {
              core: { title: 'Improvement Plans' },
              breadcrumb: null
            }
          },
        ]
      }
    ]
  },
  {
    path:'kpi-scores',
    component:KpiScoreComponent,
    data: {
      core: { title: "KPI Score" },
      breadcrumb: 'kpi_score',
    },
    children:[
      {
        path:'',
        component:KpiScoreListComponent,
        data: {
          core: { title: "List" },
          breadcrumb: 'kpi_score'
        },
        
      },
      {
        path:':id',
        component:KpiScoreDetialsComponent,
        children:[
          {
            path: '',
              component: InfoScoreComponent,
              data: {
                core: { title: 'Info' },
                breadcrumb: null
              }
          }
        ]
      },
    ]
  },
  {
    path:'improvement-plans',
    component:ImprovementPlansComponent,
    data: {
      core: { title: "Improvement Plans" },
      breadcrumb: 'improvement_plans',
    },
    children:[
      {
        path:'',
        component:ImprovementPlansListComponent,
        data: {
          core: { title: 'List' },
          breadcrumb: 'improvement_plans',
        }
      },
      {
        path:":id",
        component:ImprovementPlansDetailsComponent,
        data:{
          core: { title: "Details Improvement Plans" },
          breadcrumb: null,
        }
      }
    ]
  },
  {
    path: 'kpi-management-workflows',
    component: KpiWorkflowComponent,
    children: [  
      {
        path: "",
        component: KpiWorkflowListComponent,
        data: {
          core: { title: 'Workflow Engine' },
          breadcrumb: 'workflow_engine'
        }
      },    
      {
        path: ':id',
        component: KpiWorkflowDetailsComponent,
        data: {
          core: { title: 'Workflow Engine Details' },
          breadcrumb: null,
        }
      },
    ]
  },
  {
    path:'dashboard',
    component:DashboardComponent,
    children:[
      {
        path:'',
        component:KpiMainDashbordComponent,
        data: {
          core: { title: 'KPI Dashboard' },
          breadcrumb: 'kpi_dashboard',
        },
      },
      {
        path:'kpi-detials',
        component:KpiDetialsComponent
      },
      {
        path:'peending-reviews',
        component:PendingReviewsComponent
      }
    ]
  },
  //report
  {
    path: 'reports',
    component: ReportsComponent,
    data: {
      core: { title: 'KPI Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'user-guides',
    component: KpiOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb: null
    },
  },
  {
    path: 'reports/:kpiCountType',
    component: KpiCountTypeComponent,
    data: {
      core: { title: 'KPI Count Type' },
    },
  },
  {
    path: 'reports/:kpiCountType/:id',
    component: KpiCountListComponent,
    data: {
      core: { title: 'KPI Count List' },
    },
  },
  //** report
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiManagementRoutingModule { }
