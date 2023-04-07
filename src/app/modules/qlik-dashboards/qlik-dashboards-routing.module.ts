import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QlikDashboardsComponent } from './pages/qlik-dashboards/qlik-dashboards.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component : QlikDashboardsComponent,
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
export class QlikDashboardsRoutingModule { }
