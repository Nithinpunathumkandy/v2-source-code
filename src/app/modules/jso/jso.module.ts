import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { JsoRoutingModule } from './jso-routing.module';
import { JsoObservationsComponent } from './pages/jso-observations/jso-observations.component';
import { JsoObservationsListComponent } from './pages/jso-observations/jso-observations-list/jso-observations-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { JsoObservationDetailsComponent } from './pages/jso-observations/jso-observation-details/jso-observation-details.component';
import { JsoUnsafeActionsComponent } from './pages/jso-unsafe-actions/jso-unsafe-actions.component';
import { UnsafeActionListComponent } from './pages/jso-unsafe-actions/unsafe-action-list/unsafe-action-list.component';
import { UnsafeActionDetailsComponent } from './pages/jso-unsafe-actions/unsafe-action-details/unsafe-action-details.component';
import { JsoObservationDetailsLoaderComponent } from './component/loader/jso-observation-details-loader/jso-observation-details-loader.component';
import { UnsafeActionDetailsLoaderComponent } from './component/loader/unsafe-action-details-loader/unsafe-action-details-loader.component';
import { JsoDashboardComponent } from './pages/dashboard/jso-dashboard.component';
import { JsoReportComponent } from './pages/jso-report/jso-report.component';
import { JsoCountTypeComponent } from './pages/jso-report/jso-count-type/jso-count-type.component';
import { JsoCountListComponent } from './pages/jso-report/jso-count-list/jso-count-list.component';
import { IncidentReportLoaderComponent } from './component/loader/incident-report-loader/incident-report-loader.component';
import { JsoDashboardLoaderComponent } from './component/loader/jso-dashboard-loader/jso-dashboard-loader.component';
import { JsoOverviewComponent } from './pages/jso-overview/jso-overview.component';


@NgModule({
  declarations: [JsoObservationsComponent,
    JsoObservationsListComponent,
    JsoObservationDetailsComponent,
    JsoUnsafeActionsComponent, UnsafeActionListComponent,
    UnsafeActionDetailsComponent, JsoObservationDetailsLoaderComponent,
    UnsafeActionDetailsLoaderComponent, JsoDashboardComponent,
    JsoReportComponent, JsoCountTypeComponent,
    JsoCountListComponent, IncidentReportLoaderComponent,
    JsoDashboardLoaderComponent,
    JsoOverviewComponent],
  imports: [
    CommonModule,
    JsoRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ]
})
export class JsoModule { }
