import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingRoutingModule } from "./training-routing.module";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "src/app/shared/shared.module";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { TrainingsComponent } from "./pages/trainings/trainings.component";
import { TrainingListComponent } from "./pages/trainings/training-list/training-list.component";
import { TrainingDetailsComponent } from "./pages/trainings/training-details/training-details.component";
import { TrainingListLoaderComponent } from "./components/loader/training-list-loader/training-list-loader.component";
import { TrainingDetailsLoaderComponent } from "./components/loader/training-details-loader/training-details-loader.component";
import { TrainingReportComponent } from "./pages/reports/training-report.component";
import { TrainingCountTypeComponent } from "./pages/reports/training-count-type/training-count-type.component";
import { TrainingCountListComponent } from "./pages/reports/training-count-list/training-count-list.component";
import { TrainingDashboardComponent } from './pages/training-dashboard/training-dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TrainingDashboardLoaderComponent } from './components/loader/training-dashboard-loader/training-dashboard-loader.component';
import { TrainingReportLoaderComponent } from './components/loader/training-report-loader/training-report-loader.component';
import { TrainingMappingComponent } from './pages/trainings/training-mapping/training-mapping.component';
@NgModule({
  declarations: [
    TrainingsComponent,
    TrainingListComponent,
    TrainingDetailsComponent,
    TrainingListLoaderComponent,
    TrainingDetailsLoaderComponent,
    TrainingReportComponent,
    TrainingCountTypeComponent,
    TrainingCountListComponent,
    TrainingReportLoaderComponent,
    TrainingDashboardComponent,
    TrainingDashboardLoaderComponent,
    TrainingMappingComponent
  ],
  imports: [
    CommonModule,
    TrainingRoutingModule,
    NgxPaginationModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CarouselModule
  ],
})
export class TrainingModule {}
