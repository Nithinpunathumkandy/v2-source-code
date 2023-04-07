import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AclRoutingModule } from './acl-routing.module';
import { AclComponent } from './pages/acl/acl.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RoleActivitiesComponent } from './pages/acl/role-activities/role-activities.component';
import { ActivityLogComponent } from './pages/activity-log/activity-log.component';
import { SystemLogsComponent } from './pages/system-logs/system-logs.component';
import { SystemLogDashboardComponent } from './pages/system-logs/system-log-dashboard/system-log-dashboard.component';
import { SystemLogListComponent } from './pages/system-logs/system-log-list/system-log-list.component';
import { SystemLogDetailsComponent } from './pages/system-logs/system-log-details/system-log-details.component';
import { SystemlogDetailsLoaderComponent } from './component/loader/systemlog-details-loader/systemlog-details-loader.component';
import { ActivityLogDetailsComponent } from './pages/activity-log/activity-log-details/activity-log-details.component';
import { AclTableLoaderComponent } from './component/loader/acl-table-loader/acl-table-loader.component';
import { LogDetailsComponentComponent } from './component/log-details-component/log-details-component.component';
import { SecurityOverviewComponent } from './pages/security-overview/security-overview.component';
import { RoleActivitiesLoaderComponent } from './component/loader/role-activities-loader/role-activities-loader.component';

@NgModule({
  declarations: [AclComponent, RoleActivitiesComponent, ActivityLogComponent, SystemLogsComponent, SystemLogDashboardComponent, SystemLogListComponent, SystemLogDetailsComponent, SystemlogDetailsLoaderComponent, ActivityLogDetailsComponent, AclTableLoaderComponent, LogDetailsComponentComponent, SecurityOverviewComponent, RoleActivitiesLoaderComponent],
  imports: [
    CommonModule,
    AclRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ]
})
export class AclModule { }
