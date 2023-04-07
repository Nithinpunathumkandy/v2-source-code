import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AclComponent } from './pages/acl/acl.component';
import { RoleActivitiesComponent } from './pages/acl/role-activities/role-activities.component';
import { ActivityLogDetailsComponent } from './pages/activity-log/activity-log-details/activity-log-details.component';
import { ActivityLogComponent } from './pages/activity-log/activity-log.component';
import { SecurityOverviewComponent } from './pages/security-overview/security-overview.component';
import { SystemLogDashboardComponent } from './pages/system-logs/system-log-dashboard/system-log-dashboard.component';
import { SystemLogDetailsComponent } from './pages/system-logs/system-log-details/system-log-details.component';
import { SystemLogListComponent } from './pages/system-logs/system-log-list/system-log-list.component';
import { SystemLogsComponent } from './pages/system-logs/system-logs.component';



const routes: Routes = [
  {
    path: '',
    component: AclComponent,
    data: {
      core: { title: 'Acl' },
      breadcrumb: null
    },
  },
  {
    path: 'roles',
    component: AclComponent,
    data: {
      core: { title: 'Acl' },
      breadcrumb: 'Acl'
    },
  },
  {
    path: 'user-guides',
    component: SecurityOverviewComponent,
    data: {
      core: { title: 'Overview' },
      // breadcrumb: null
    },
  },
  {
    path: 'role-activities',
    component: RoleActivitiesComponent,
    data: {
      core: { title: 'Role Activities' },
      breadcrumb: 'role_activities'
    }
  },
  {
    path: 'activity-logs',
    component: ActivityLogComponent,
    data: {
      core: { title: 'Activity Log' },
      breadcrumb: 'activity_log'
    }
  },
  {
    path: 'activity-log-details',
    component: ActivityLogDetailsComponent,
    data: {
      core: { title: 'ActivityLog Details' },
      breadcrumb: 'activity_log_details'
    }
  },
  {
    path: 'system-logs',
    component: SystemLogsComponent,
    data: {
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: SystemLogDashboardComponent,
        data: {
          core: { title: "System Log Dashboard" }
        }
      },
      {
        path: 'logs',
        component: SystemLogListComponent,
        data: {
          core: { title: "System Log List" }
        }
      },
      {
        path: 'log-details',
        component: SystemLogDetailsComponent,
        data: {
          core: { title: "System Log Details" }
        }
      },
    ]
  },

  //   {
  //     path: '',
  //     redirectTo: 'system-log-dashboard',
  //     pathMatch: 'full',
  //   },

  //   ]
  // }
  // children: [
  //   {
  //       path: 'acl-details',
  //       component: AclDetailsComponent,
  //       data: {
  //           core: { title: 'Acl Details' },
  //           breadcrumb: 'Acl Details'
  //       }
  //   },
  // ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AclRoutingModule {

}
