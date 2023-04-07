import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationDashboardComponent } from './pages/dashboard/organization-dashboard.component';
import { BusinessProfileComponent } from './pages/business-profile/business-profile.component';
import { OrganizationContextComponent } from './pages/context/organization-context.component';
import { OrganizationReportsComponent } from './pages/reports/organization-reports.component';
import { ProfileComponent } from './pages/business-profile/profile/profile.component';
import { PoliciesComponent } from './pages/business-profile/policies/policies.component';
import { SubsidiaryComponent } from './pages/business-profile/subsidiary/subsidiary.component';
import { BranchesComponent } from './pages/business-profile/branches/branches.component';
import { MsTypeComponent } from './pages/business-profile/ms-type/ms-type.component';
import { ProductsComponent } from './pages/business-profile/products/products.component';
import { ServicesComponent } from './pages/business-profile/services/services.component';
import { ProjectsComponent } from './pages/business-profile/projects/projects.component';
import { OcComponent } from './pages/business-profile/oc/oc.component';
import { CustomerComponent } from './pages/business-profile/customer/customer.component';
import { InternalIssuesComponent } from './pages/context/pages/internal-issues/internal-issues.component';
import { PestleAnalysisComponent } from './pages/context/pages/pestle-analysis/pestle-analysis.component';
import { ExternalIssuesComponent } from './pages/context/pages/external-issues/external-issues.component';
import { StakeholderAnalysisComponent } from './pages/context/pages/stakeholder-analysis/stakeholder-analysis.component';
import { IssueListComponent } from './pages/context/pages/issue-list/issue-list.component';
import { SwotAnalysisComponent } from './pages/context/pages/swot-analysis/swot-analysis.component';
import { IssuelistMainComponent } from './pages/context/pages/issue-list/issuelist-main/issuelist-main.component';
import { IssueDetailsComponent } from './pages/context/pages/issue-list/issuelist-main/pages/issue-details/issue-details.component';
import { IssueProcessesComponent } from './pages/context/pages/issue-list/issuelist-main/pages/issue-processes/issue-processes.component';
import { IssueActivityLogComponent } from './pages/context/pages/issue-list/issuelist-main/pages/issue-activity-log/issue-activity-log.component';
import { AddIssueComponent } from './pages/context/pages/add-issue/add-issue.component';
import { EditProfileComponent } from './pages/business-profile/profile/edit-profile/edit-profile.component';
import { EditIssueComponent } from './pages/context/pages/edit-issue/edit-issue.component';
import { StakeholdersComponent } from './pages/stakeholders/stakeholders.component';
import { StakeholderDetailsComponent } from './pages/stakeholders/stakeholder-details/stakeholder-details.component';
import { ReportListComponent } from './pages/reports/pages/reports/report-list.component';
import { ReportDetailsComponent } from './pages/reports/pages/reports/report-details/report-details.component';
import { ReportByCategoryComponent } from './pages/reports/pages/reports/report-by-category/report-by-category.component';
import { BusinessApplicationsComponent } from './pages/business-profile/business-applications/business-applications.component';
import { StrategicObjectivesComponent } from './pages/business-profile/strategic-objectives/strategic-objectives.component';
import { SupplierComponent } from './pages/business-profile/supplier/supplier.component';
import { OrganizationOverviewComponent } from './pages/organization-overview/organization-overview.component';
import { SupplierDetailsComponent } from './pages/business-profile/supplier/supplier-details/supplier-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    component: OrganizationDashboardComponent,
    data: {
        core: { title: 'dashboard' },
        breadcrumb: 'dashboard'
    }
  },
  {
    path: 'user-guides',
    component: OrganizationOverviewComponent,
    data: {
        core: { title: 'Overview' },
        breadcrumb: 'Overview'
    }
  },
  {
    path: 'business-profile',
    component: BusinessProfileComponent,
    data: {
        core: { title: 'business_profile' },
        breadcrumb: 'profile'
    },
    children: [
      
      {
        path: '',
        component: ProfileComponent,
        data: {
          core: { title: 'profile' },
          breadcrumb: 'profile'
        }
      },
      {
        path: 'policies',
        component: PoliciesComponent,
        data: {
          core: { title: 'policies' },
          breadcrumb: 'policies'
        }
      },
      {
        path: 'subsidiaries',
        component: SubsidiaryComponent,
        data: {
          core: { title: 'subsidiary' },
          breadcrumb: 'subsidiaries'
        }
      },
      {
        path: 'branches',
        component: BranchesComponent,
        data: {
          core: { title: 'branches' },
          breadcrumb: 'branches'
        }
      },
      {
        path: 'ms-types',
        component: MsTypeComponent,
        data: {
          core: { title: 'ms_type' },
          breadcrumb: 'ms_types'
        }
      },
      {
        path: 'supplier',
        component: SupplierComponent,
        data: {
          core: { title: 'supplier' },
          breadcrumb: 'supplier'
        },
      },
      
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          core: { title: 'products' },
          breadcrumb: 'products'
        }
      },
      {
        path: 'services',
        component: ServicesComponent,
        data: {
          core: { title: 'services' },
          breadcrumb: 'services'
        }
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        data: {
          core: { title: 'projects' },
          breadcrumb: 'projects'
        }
      },
      {
        path: 'oc',
        component: OcComponent,
        data: {
          core: { title: 'OC' },
          breadcrumb: 'organization_charts'
        }
      },
      {
        path: 'customers',
        component: CustomerComponent,
        data: {
          core: { title: 'customer' },
          breadcrumb: 'customers'
        }
      },
      {
        path: 'business-applications',
        component: BusinessApplicationsComponent,
        data: {
          core: { title: 'business_applications' },
          breadcrumb: 'business_applications'
        }
      },
      {
        path: 'strategic-objectives',
        component: StrategicObjectivesComponent,
        data: {
          core: { title: 'strategic_objectives' },
          breadcrumb: 'strategic_objectives'
        }
      }

    ]
  },
  {
    path: 'profile/edit-profile',
    component: EditProfileComponent,
    data: {
      core: { title: 'edit_profile' },
      breadcrumb: null
    }
  },
  {
    path: 'business-profile/supplier/:id',
    component: SupplierDetailsComponent,
    data: {
      core: { title: 'Supplier Details' },

    }
  },
  {
    path: 'context',
    component: OrganizationContextComponent,
    data: {
        core: { title: 'context' },
        breadcrumb: 'swot_analysis'
    },
    children: [
      {
        path: '',
        component: SwotAnalysisComponent,
        data: {
          core: { title: 'swot_analysis' },
          breadcrumb: 'swot_analysis'
        }
      },
      {
        path: 'pestel-analysis',
        component: PestleAnalysisComponent,
        data: {
          core: { title: 'pestel_analysis' },
          breadcrumb: 'pestel_analysis'
        }
      },
      {
        path: 'internal-issues',
        component: InternalIssuesComponent,
        data: {
          core: { title: 'internal_issues' },
          breadcrumb: 'internal_issues'
        }
      },
      {
        path: 'external-issues',
        component: ExternalIssuesComponent,
        data: {
          core: { title: 'external_issues' },
          breadcrumb: 'external_issues'
        }
      },
      {
        path: 'stakeholder-analysis',
        component: StakeholderAnalysisComponent,
        data: {
          core: { title: 'stakeholder_analysis' },
          breadcrumb: 'stakeholder_analysis'
        }
      },
      {
        path: 'issue-lists',
        component: IssueListComponent,
        data: {
          core: { title: 'issue_lists' },
          breadcrumb: 'issue_list'
        }
      }
    ]
  },
  {
    path: 'reports',
    component: OrganizationReportsComponent,
    data: {
        core: { title: 'reports' },
        breadcrumb: 'reports'
    },
    children:[
      {
         path: "",
         component: ReportListComponent,
         data: {
          core: { title: "reports" },
          breadcrumb: 'reports'
        },
      },
      {
        path: ":id",
        component: ReportDetailsComponent,
        data: {
         core: { title: "reports" },
        }
      },{
        path: ":id/:type",
        component: ReportByCategoryComponent,
        data: {
         core: { title: "report_details" },
        },
      }
    ],
  },
  {
    path: 'issue-details',
    component: IssuelistMainComponent,
    data: {
      core: { title: 'issue_details' },
    },
    children:[
      {
        path: 'processes',
        component: IssueProcessesComponent,
        data: {
          core: { title: 'processes' }
        }
      },
      {
        path: 'activity',
        component: IssueActivityLogComponent,
        data: {
          core: { title: 'activity_log' }
        }
      },
      {
        path: ':id',
        component: IssueDetailsComponent,
        data: {
          core: { title: 'info' }
        }
      },{
        path: '',
        component: IssueDetailsComponent,
        data: {
          core: { title: 'info' }
        }
      }
    ]
  },
  {
    path: 'new-issue',
    component: AddIssueComponent,
    data: {
        core: { title: 'new_issue' },
        //breadcrumb: 'New Issue'
    }
  },
  {
    path: 'edit-issue',
    component: EditIssueComponent,
    data: {
        core: { title: 'edit_issue' },
        breadcrumb: ''
    }
  },
  {
    path: 'stakeholders',
    component: StakeholdersComponent,
    data: {
        core: { title: 'stakeholders' },
        breadcrumb: 'stakeholders'
    }
  },
  {
    path: 'stakeholder-details/:id',
    component: StakeholderDetailsComponent,
    data: {
        core: { title: 'stakeholder_details' }
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
