import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NonConfirmityCorrectiveActionListComponent } from "./pages/non-confirmity-corrective-action/non-confirmity-corrective-action-list/non-confirmity-corrective-action-list.component";
import { NonConfirmityCorrectiveActionComponent } from "./pages/non-confirmity-corrective-action/non-confirmity-corrective-action.component";
import { NonconfirmityCorrectiveActionInfoComponent } from "./pages/non-confirmity-corrective-action/nonconfirmity-corrective-action-info/nonconfirmity-corrective-action-info.component";
import { NonComformityReportComponent } from "./pages/non-confirmity-reports/non-confirmity-report.component";
import { NonComformityCountListComponent } from "./pages/non-confirmity-reports/non-conformity-count-list/non-conformity-count-list.component";
import { NonComformityCountTypeComponent } from "./pages/non-confirmity-reports/non-conformity-count-type/non-conformity-count-type.component";
import { NonConformityDashboardComponent } from "./pages/non-conformity-dashboard/non-conformity-dashboard.component";
import { FindingsDetailsCorrectiveActionComponent } from "./pages/non-conformity-findings/findings-details/findings-details-corrective-action/findings-details-corrective-action.component";
import { FindingsDetailsInfoComponent } from "./pages/non-conformity-findings/findings-details/findings-details-info/findings-details-info.component";
import { FindingsDetailsComponent } from "./pages/non-conformity-findings/findings-details/findings-details.component";
import { FindingsListComponent } from "./pages/non-conformity-findings/findings-list/findings-list.component";
import { NonConformityFindingsComponent } from "./pages/non-conformity-findings/non-conformity-findings.component";
import { NonConformityOverviewComponent } from "./pages/non-conformity-overview/non-conformity-overview.component";


const routes: Routes = [
  {
    path: 'dashboard',
    component: NonConformityDashboardComponent,
    data: {
      core: { title: 'Non Conformity Dashboard' },
    }
  },
  {
    path: 'user-guides',
    component: NonConformityOverviewComponent,
    data: {
      core: { title: 'Non Conformity Overview' },
    }
  },
  {
    path: 'findings',
    component: NonConformityFindingsComponent,
    children: [
      {
        path: '',
        component: FindingsListComponent,
        data: {
          core: { title: 'Findings' },
          breadcrumb: 'findings'
        }
      },
      {
        path: ':id',
        component: FindingsDetailsComponent,
        // data: {
        //   core: { title: 'Findings Details' },
        //   breadcrumb: null
        // },
        children: [
          {
            path: '',
            component: FindingsDetailsInfoComponent,
            data: {
              core: { title: 'Findings' },
              // breadcrumb: 'findings'
            }
          },
          {
            path: 'corrective-actions',
            component: FindingsDetailsCorrectiveActionComponent,
            data: {
              core: { title: 'Findings Corrective Action' },
              // breadcrumb: 'CA'
            }
          }
        ]
      },
    ]
  },
  {
    path: 'finding-corrective-actions',
    component: NonConfirmityCorrectiveActionComponent,
    children: [
      {
        path: '',
        component: NonConfirmityCorrectiveActionListComponent,
        data: {
          core: { title: 'Corrective Action' },
          breadcrumb: 'Corrective Action'
        }
      },
      {
        path: ':id',
        component: NonconfirmityCorrectiveActionInfoComponent,
        data: {
          core: { title: 'Corrective Action Info' },
          // breadcrumb: 'CA'
        }
      }
    ]
  },

      // non conformity report start here
      {
        path: 'reports',
        component: NonComformityReportComponent,
        data: {
          core: { title: 'Non Conformity Reports' },
          breadcrumb: 'reports'
        },
      },
      {
        path: 'reports/:nonComformityCountType',
        component: NonComformityCountTypeComponent,
        data: {
          core: { title: 'Non Conformity Count Type' },
        },
      },
      {
        path: 'reports/:nonComformityCountType/:id',
        component: NonComformityCountListComponent,
        data: {
          core: { title: 'Non Conformity Count List' },
        },
      },
      // non conformity reports end here
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonConformityRoutingModule { }