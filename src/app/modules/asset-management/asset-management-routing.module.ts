import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AssetRegisterComponent } from './pages/asset-register/asset-register.component';
// import { AddAssetComponent } from './pages/asset-register/add-asset/add-asset.component';
import { AssetManagementComponent } from './pages/asset-management/asset-management.component';
import { AddAssetComponent } from './pages/asset-management/asset-register/add-asset/add-asset.component';
import { AssetDetailsComponent } from './pages/asset-management/asset-details/asset-details.component';
import { AssetProfileComponent } from './pages/asset-management/asset-details/asset-profile/asset-profile.component';
import { AssetMatrixComponent } from './pages/asset-matrix/asset-matrix.component';
import { AssetRegisterComponent } from './pages/asset-management/asset-register/asset-register.component';
import { EditAssetComponent } from './pages/asset-management/asset-register/edit-asset/edit-asset.component';
import { AssetMappingComponent } from './pages/asset-management/asset-details/asset-mapping/asset-mapping.component';
import { AssetMatrixDetailsComponent } from './pages/asset-matrix/asset-matrix-details/asset-matrix-details.component';
import { AssetMatrixListComponent } from './pages/asset-matrix/asset-matrix-list/asset-matrix-list.component';
import { AssetCriticalityComponent } from './pages/asset-management/asset-details/asset-criticality/asset-criticality.component';
import { AssetMaintenanceComponent } from './pages/asset-management/asset-details/asset-maintenance/asset-maintenance.component';
import { AddAssetMaintenanceComponent } from './pages/asset-maintenances/add-asset-maintenance/add-asset-maintenance.component';
import { MaintenanceDetailsComponent } from './pages/asset-maintenances/maintenance-details/maintenance-details.component';
import { EditAssetMaintenanceComponent } from './pages/asset-maintenances/edit-asset-maintenance/edit-asset-maintenance.component';
import { AssetMaintenancesComponent } from './pages/asset-maintenances/asset-maintenances.component';
import { MaintenanceListComponent } from './pages/asset-maintenances/maintenance-list/maintenance-list.component';
import { AssetMaintenanceListComponent } from './pages/asset-management/asset-details/asset-maintenance/asset-maintenance-list/asset-maintenance-list.component';
import { AssetSpecificationComponent } from './pages/asset-management/asset-details/asset-specification/asset-specification.component';
import { SpecificationAddComponent } from './pages/asset-management/asset-details/asset-specification/components/specification-add/specification-add.component';
import { SpecificationEditComponent } from './pages/asset-management/asset-details/asset-specification/components/specification-edit/specification-edit.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { AssetReportComponent } from './pages/asset-report/asset-report.component';
import { AssetCountListComponent } from './pages/asset-report/asset-count-list/asset-count-list.component';
import { AssetCountTypeComponent } from './pages/asset-report/asset-count-type/asset-count-type.component';
import { MaintenanceSchedulesComponent } from './pages/maintenance-schedules/maintenance-schedules.component';
import { ScheduleListComponent } from './pages/maintenance-schedules/schedule-list/schedule-list.component';
import { ScheduleDetailComponent } from './pages/maintenance-schedules/schedule-detail/schedule-detail.component';
import { AssetManagementOverviewComponent } from './pages/asset-management-overview/asset-management-overview.component';
// import { AssetManagementComponent } from './pages/asset-register/add-asset/add-asset.component';

const routes: Routes = [

	{
		path: 'dashboard',
		component: AssetDashboardComponent,
		data: {
			core: { title: 'Dashboard' },
			breadcrumb: 'asset_dashboard'

		},
	},
	{
		path: 'user-guides',
		component: AssetManagementOverviewComponent,
		data: {
			core: { title: 'Overview' },
			// breadcrumb: null

		},
	},
	{
		path: 'assets',
		component: AssetManagementComponent,

		children: [
			{
				path: '',
				component: AssetRegisterComponent,
				data: {
					core: { title: 'Assets' },
					breadcrumb: 'assets'
				},
			},

			{
				path: 'add-asset',
				component: AddAssetComponent,
				data: {
					core: { title: 'Add Asset' },
					breadcrumb: null
				},
			},
			{
				path: 'edit-asset',
				component: EditAssetComponent,
				data: {
					core: { title: 'Edit Asset' },
					breadcrumb: null
				},
			},

			{
				path: ':id',
				component: AssetDetailsComponent,
				children: [
					{
						path: '',
						component: AssetProfileComponent,
						data: {
							core: { title: 'Asset Profile' },
							breadcrumb: null
						},
					},
					{
						path: 'asset-specification',
						component: AssetSpecificationComponent,
						data: {
							core: { title: 'Asset Specification' },
							breadcrumb: null
						},
					},
					{
						path: 'add-asset-specification',
						component: SpecificationAddComponent,
						data: {
							core: { title: 'Add Asset Specification' },
							breadcrumb: null
						},
					},
					{
						path: 'edit-asset-specification',
						component: SpecificationEditComponent,
						data: {
							core: { title: 'Edit Asset Specification' },
							breadcrumb: null
						},
					},
					{
						path: 'asset-mapping',
						component: AssetMappingComponent,
						data: {
							core: { title: 'Asset Mapping' },
							breadcrumb: null
						},
					},
					{
						path: 'asset-criticality',
						component: AssetCriticalityComponent,
						data: {
							core: { title: 'Asset Criticality' },
							breadcrumb: null
						},
					},
					{
						path: 'maintenances',
						component: AssetMaintenanceComponent,
						children: [
							{
								path: '',
								component: AssetMaintenanceListComponent,
								data: {
									core: { title: 'Asset Maintenance' },
									breadcrumb: null
								},
							},
							{
								path: ':id',
								component: MaintenanceDetailsComponent,
								data: {
									core: { title: 'Asset Maintenance Details' },
									breadcrumb: null
								},
							},

						]




					},
					{
						path: 'add-asset-maintenance',
						component: AddAssetMaintenanceComponent,
						data: {
							core: { title: 'Add Asset Maintenance' },
							breadcrumb: null
						},
					},
					{
						path: 'edit-asset-maintenance',
						component: EditAssetMaintenanceComponent,
						data: {
							core: { title: 'Edit Asset Maintenance' },
							breadcrumb: null
						},
					},


				]
			},

		]
	},
	{
		path: 'asset-matrix',
		component: AssetMatrixComponent,

		children: [
			{
				path: '',
				component: AssetMatrixListComponent,
				data: {
					core: { title: 'Asset Criticality Matrix' },
					breadcrumb: 'Asset Criticality Matrix'
				},
			},
			{
				path: ':id',
				component: AssetMatrixDetailsComponent,

				data: {
					core: { title: 'Asset Matrix Details' },
					breadcrumb: null
				},
			},
		]
	},
	{
		path: 'asset-maintenances',
		component: AssetMaintenancesComponent,

		children: [
			{
				path: '',
				component: MaintenanceListComponent,
				data: {
					core: { title: 'Asset Maintenances' },
					breadcrumb: 'Asset Maintenances'
				},
			},
			{
				path: 'add-maintenance',
				component: AddAssetMaintenanceComponent,
				data: {
					core: { title: 'Add Asset Maintenance' },
					breadcrumb: null
				},
			},
			{
				path: 'edit-maintenance',
				component: EditAssetMaintenanceComponent,
				data: {
					core: { title: 'Edit Asset Maintenance' },
					breadcrumb: null
				},
			},

			{
				path: ':id',
				component: MaintenanceDetailsComponent,

				data: {
					core: { title: 'Asset Maintenance Details' },
					breadcrumb: null
				},
			},

		]
	},

	{
		path: 'asset-maintenance-schedules',
		component: MaintenanceSchedulesComponent,

		children: [
			{
				path: '',
				component: ScheduleListComponent,
				data: {
					core: { title: 'Maintenance Schedules' },
					breadcrumb: 'Maintenance Schedules'
				},
			},
		

			{
				path: ':id',
				component: ScheduleDetailComponent,

				data: {
					core: { title: 'Maintenance Schedule Details' },
					breadcrumb: null
				},
			},

		]
	},
 // reports start here
 {
  path: 'reports',
  component: AssetReportComponent,
  data: {
    core: { title: 'Asset Reports' },
    breadcrumb: 'reports'
  },
},
{
  path: 'reports/:assetcountType',
  component: AssetCountTypeComponent,
  data: {
    core: { title: 'Asset Count Type' },
  },
},
{
  path: 'reports/:assetcountType/:id',
  component: AssetCountListComponent,
  data: {
    core: { title: 'Asset Count List' },
  },
},
  // reports end here



];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AssetManagementRoutingModule { }
