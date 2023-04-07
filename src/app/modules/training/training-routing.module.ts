import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrainingReportStore } from 'src/app/stores/training/training-report/training-report-store';
import { TrainingCountListComponent } from './pages/reports/training-count-list/training-count-list.component';
import { TrainingCountTypeComponent } from './pages/reports/training-count-type/training-count-type.component';
import { TrainingReportComponent } from './pages/reports/training-report.component';
import { TrainingDashboardComponent } from './pages/training-dashboard/training-dashboard.component';
import { TrainingDetailsComponent } from './pages/trainings/training-details/training-details.component';
import { TrainingListComponent } from './pages/trainings/training-list/training-list.component';
import { TrainingMappingComponent } from './pages/trainings/training-mapping/training-mapping.component';
import { TrainingsComponent } from './pages/trainings/trainings.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: TrainingDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: null

    },
},
  {
    path: 'training',
    component: TrainingsComponent,
    children: [
      {
        path: '',
        component: TrainingListComponent,
        data: {
          core: { title: 'Training List' },
          breadcrumb: 'trainings'
        }
      },
      {
        path: ':id',
        component: TrainingDetailsComponent,
        data: {
          core: { title: 'Training Details' },
          breadcrumb: null
        }
      }, 
      {
        path: ':id/mapping',
        component: TrainingMappingComponent,
        data: {
          core: { title: 'Training Mapping' },
          breadcrumb: null
        }
      },
    ]
  },

  // reports start here
  {
    path: 'reports',
    component: TrainingReportComponent,
    data: {
      core: { title: 'Training Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: TrainingCountTypeComponent,
    data: {
      core: { title: 'Training Count By Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: TrainingCountListComponent,
    data: {
      core: { title: 'Training List' },
    },
  },
    // reports end here
  {
    path: 'dashboard',
    component: TrainingDashboardComponent,
    data: {
      core: { title: 'Dashboard' },
      breadcrumb: null

    },
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
