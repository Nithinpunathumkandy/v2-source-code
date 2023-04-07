import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetManagementRoutingModule } from './asset-management-routing.module';
import { AssetRegisterComponent } from './pages/asset-management/asset-register/asset-register.component';
import { AddAssetComponent } from './pages/asset-management/asset-register/add-asset/add-asset.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssetManagementComponent } from './pages/asset-management/asset-management.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssetDetailsComponent } from './pages/asset-management/asset-details/asset-details.component';
import { AssetProfileComponent } from './pages/asset-management/asset-details/asset-profile/asset-profile.component';
import { AssetMatrixComponent } from './pages/asset-matrix/asset-matrix.component';
import { EditAssetComponent } from './pages/asset-management/asset-register/edit-asset/edit-asset.component';
import { AssetMatrixDetailsComponent } from './pages/asset-matrix/asset-matrix-details/asset-matrix-details.component';
import { AssetMappingComponent } from './pages/asset-management/asset-details/asset-mapping/asset-mapping.component';
import { AssetMappingLoaderComponent } from './components/loader/asset-mapping-loader/asset-mapping-loader.component';
import { AssetItemPreviewComponent } from './components/asset-item-preview/asset-item-preview.component';
import { AssetMatrixListComponent } from './pages/asset-matrix/asset-matrix-list/asset-matrix-list.component';
import { AssetCriticalityComponent } from './pages/asset-management/asset-details/asset-criticality/asset-criticality.component';
import { AssetMaintenanceComponent } from './pages/asset-management/asset-details/asset-maintenance/asset-maintenance.component';
import { MaintenanceDetailsComponent } from './pages/asset-maintenances/maintenance-details/maintenance-details.component';
import { AddAssetMaintenanceComponent } from './pages/asset-maintenances/add-asset-maintenance/add-asset-maintenance.component';
import { AssetProfileLoaderComponent } from './components/loader/asset-profile-loader/asset-profile-loader.component';
import { AssetCriticalityProfileFormComponent } from './components/loader/asset-criticality-profile-form/asset-criticality-profile-form.component';
import { AssetCriticalityLoaderComponent } from './components/loader/asset-criticality-loader/asset-criticality-loader.component';
import { AssetMatrixDetailLoaderComponent } from './components/loader/asset-matrix-detail-loader/asset-matrix-detail-loader.component';
import { CriticalityRatingFormLoaderComponent } from './components/loader/criticality-rating-form-loader/criticality-rating-form-loader.component';
import { AssetMaintenanceDetailsLoaderComponent } from './components/loader/asset-maintenance-details-loader/asset-maintenance-details-loader.component';
import { EditAssetMaintenanceComponent } from './pages/asset-maintenances/edit-asset-maintenance/edit-asset-maintenance.component';
import { AssetMaintenancesComponent } from './pages/asset-maintenances/asset-maintenances.component';
import { MaintenanceListComponent } from './pages/asset-maintenances/maintenance-list/maintenance-list.component';
import { AssetMaintenanceListComponent } from './pages/asset-management/asset-details/asset-maintenance/asset-maintenance-list/asset-maintenance-list.component';
import { AssetSpecificationComponent } from './pages/asset-management/asset-details/asset-specification/asset-specification.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { SpecificationAddComponent } from './pages/asset-management/asset-details/asset-specification/components/specification-add/specification-add.component';
import { SpecificationEditComponent } from './pages/asset-management/asset-details/asset-specification/components/specification-edit/specification-edit.component';
import { AssetReportComponent } from './pages/asset-report/asset-report.component';
import { AssetCountTypeComponent } from './pages/asset-report/asset-count-type/asset-count-type.component';
import { AssetCountListComponent } from './pages/asset-report/asset-count-list/asset-count-list.component';
import { AssetReportLoaderComponent } from './components/loader/asset-report-loader/asset-report-loader.component';
import { MaintenanceSchedulesComponent } from './pages/maintenance-schedules/maintenance-schedules.component';
import { ScheduleListComponent } from './pages/maintenance-schedules/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from './pages/maintenance-schedules/schedule-detail/schedule-detail.component';
import { AssetMaintenanceScheduleLoaderComponent } from './components/loader/asset-maintenance-schedule-loader/asset-maintenance-schedule-loader.component';
import { AssetMaintenanceScheduleDetailsLoaderComponent } from './components/loader/asset-maintenance-schedule-details-loader/asset-maintenance-schedule-details-loader.component';
import { AssetDashboardLoaderComponent } from './components/loader/asset-dashboard-loader/asset-dashboard-loader.component';
import { AssetManagementOverviewComponent } from './pages/asset-management-overview/asset-management-overview.component';


@NgModule({
  declarations: [AssetRegisterComponent, AddAssetComponent, AssetManagementComponent, AssetDetailsComponent, AssetProfileComponent, AssetMatrixComponent, EditAssetComponent, AssetMatrixDetailsComponent, AssetMappingComponent, AssetMappingLoaderComponent,AssetItemPreviewComponent, AssetMatrixListComponent, AssetCriticalityComponent, AssetMaintenanceComponent, MaintenanceDetailsComponent, AddAssetMaintenanceComponent, AssetProfileLoaderComponent, AssetCriticalityProfileFormComponent, AssetCriticalityLoaderComponent, AssetMatrixDetailLoaderComponent, CriticalityRatingFormLoaderComponent, AssetMaintenanceDetailsLoaderComponent, EditAssetMaintenanceComponent, AssetMaintenancesComponent, MaintenanceListComponent, AssetMaintenanceListComponent, AssetSpecificationComponent, AssetDashboardComponent, SpecificationAddComponent, SpecificationEditComponent, AssetReportComponent, AssetCountTypeComponent, AssetCountListComponent, AssetReportLoaderComponent, MaintenanceSchedulesComponent, ScheduleListComponent, ScheduleDetailComponent, AssetMaintenanceScheduleLoaderComponent, AssetMaintenanceScheduleDetailsLoaderComponent, AssetDashboardLoaderComponent, AssetManagementOverviewComponent],
  imports: [
    CommonModule,
    AssetManagementRoutingModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class AssetManagementModule { }
