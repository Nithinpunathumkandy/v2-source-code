import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JsoDashboardComponent } from './pages/dashboard/jso-dashboard.component';
import { JsoObservationDetailsComponent } from './pages/jso-observations/jso-observation-details/jso-observation-details.component';
import { JsoObservationsListComponent } from './pages/jso-observations/jso-observations-list/jso-observations-list.component';
import { JsoObservationsComponent } from './pages/jso-observations/jso-observations.component';
import { JsoUnsafeActionsComponent } from './pages/jso-unsafe-actions/jso-unsafe-actions.component';
import { UnsafeActionDetailsComponent } from './pages/jso-unsafe-actions/unsafe-action-details/unsafe-action-details.component';
import { UnsafeActionListComponent } from './pages/jso-unsafe-actions/unsafe-action-list/unsafe-action-list.component';
import { JsoReportComponent } from './pages/jso-report/jso-report.component';
import { JsoCountTypeComponent } from './pages/jso-report/jso-count-type/jso-count-type.component';
import { JsoCountListComponent } from './pages/jso-report/jso-count-list/jso-count-list.component';
import { JsoOverviewComponent } from './pages/jso-overview/jso-overview.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: JsoDashboardComponent,
    data: {
      core: { title: 'JSO Dashboard' },
      // breadcrumb: 'JSO Dashboard'
    }
  },
  {
    path: 'user-guides',
    component: JsoOverviewComponent,
    data: {
      core: { title: 'JSO Overview' },
      // breadcrumb: 'jso_overview'
    }
  },
  {
    path: 'jso-observations',
    component: JsoObservationsComponent,
    children: [
      {
        path: '',
        component: JsoObservationsListComponent,
        data: {
          core: { title: 'JSO Observations' },
          breadcrumb: 'jso_observations'
        }
      },
      {
        path: ':id',
        component: JsoObservationDetailsComponent,
        data: {
          core: { title: 'JSO Observation Details' },
          breadcrumb: null
        }
      }, 
    ]
  },
  {
    path: 'unsafe-actions',
    component: JsoUnsafeActionsComponent,
    children: [
      {
        path: '',
        component: UnsafeActionListComponent,
        data: {
          core: { title: 'Unsafe Action List' },
          breadcrumb: 'unsafe_actions'
        }
      },
      {
        path: ':id',
        component: UnsafeActionDetailsComponent,
        data: {
          core: { title: 'Unsafe Action Details' },
          breadcrumb: null
        }
      }, 
    ]
  },
  {
    path: 'reports',
    component: JsoReportComponent,
    data: {
      core: { title: 'Jso Reports' },
      breadcrumb: 'reports'
    },
  },
  {
    path: 'reports/:riskcountType',
    component: JsoCountTypeComponent,
    data: {
      core: { title: 'Jso Count Type' },
    },
  },
  {
    path: 'reports/:riskcountType/:id',
    component: JsoCountListComponent,
    data: {
      core: { title: 'Jso Count List' },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JsoRoutingModule { }
