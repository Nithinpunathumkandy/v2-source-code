import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QlikDashboardsRoutingModule } from './qlik-dashboards-routing.module';
import { QlikDashboardsComponent } from './pages/qlik-dashboards/qlik-dashboards.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    QlikDashboardsComponent
  ],
  imports: [
    CommonModule,
    QlikDashboardsRoutingModule,
    SharedModule
  ]
})
export class QlikDashboardsModule { }
