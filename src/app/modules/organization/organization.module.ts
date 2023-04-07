import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrganizationRoutingModule } from './organization-routing.module';
import { BusinessProfileComponent } from './pages/business-profile/business-profile.component';
import { OrganizationContextComponent } from './pages/context/organization-context.component';
import { OrganizationReportsComponent } from './pages/reports/organization-reports.component';
import { OrganizationDashboardComponent } from './pages/dashboard/organization-dashboard.component';
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
import { PestleAnalysisComponent } from './pages/context/pages/pestle-analysis/pestle-analysis.component';
import { InternalIssuesComponent } from './pages/context/pages/internal-issues/internal-issues.component';
import { ExternalIssuesComponent } from './pages/context/pages/external-issues/external-issues.component';
import { StakeholderAnalysisComponent } from './pages/context/pages/stakeholder-analysis/stakeholder-analysis.component';
import { IssueListComponent } from './pages/context/pages/issue-list/issue-list.component';
import { SwotAnalysisComponent } from './pages/context/pages/swot-analysis/swot-analysis.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { IssuelistMainComponent } from './pages/context/pages/issue-list/issuelist-main/issuelist-main.component';
import { IssueDetailsComponent } from "./pages/context/pages/issue-list/issuelist-main/pages/issue-details/issue-details.component";
import { IssueProcessesComponent } from "./pages/context/pages/issue-list/issuelist-main/pages/issue-processes/issue-processes.component";
import { IssueActivityLogComponent } from "./pages/context/pages/issue-list/issuelist-main/pages/issue-activity-log/issue-activity-log.component";
import { AddIssueComponent } from './pages/context/pages/add-issue/add-issue.component';
import { EditProfileComponent } from './pages/business-profile/profile/edit-profile/edit-profile.component';
// import { AddprocessComponent } from './components/context/addprocess/addprocess.component';
import { EditIssueComponent } from './pages/context/pages/edit-issue/edit-issue.component';
import { PreviewcomponentComponent } from './components/shared/previewcomponent/previewcomponent.component';
import { ViewMoreComponent } from './components/context/view-more/view-more.component';
import { ProfileSliderComponent } from './components/business-profile/profile-slider/profile-slider.component';
import { OrganizationChartDivComponent } from './components/business-profile/organization-chart-div/organization-chart-div.component';
// import { IssueListLoaderComponent } from './components/loaders/issue-list-loader/issue-list-loader.component';
import { ProfileComponentLoaderComponent } from './components/loaders/profile-component-loader/profile-component-loader.component';
import { ProfileLoaderComponent } from './components/loaders/profile-loader/profile-loader.component';
import { SubsidiaryLoaderComponent } from './components/loaders/subsidiary-loader/subsidiary-loader.component';
import { BranchesLoaderComponent } from './components/loaders/branches-loader/branches-loader.component';
import { MsTypesLoaderComponent } from './components/loaders/ms-types-loader/ms-types-loader.component';
import { PoliciesLoaderComponent } from './components/loaders/policies-loader/policies-loader.component';
import { ProductsLoaderComponent } from './components/loaders/products-loader/products-loader.component';
import { ServicesLoaderComponent } from './components/loaders/services-loader/services-loader.component';
import { ProjectsLoaderComponent } from './components/loaders/projects-loader/projects-loader.component';
import { OrganizationChartLoaderComponent } from './components/loaders/organization-chart-loader/organization-chart-loader.component';
// import { CustomersLoaderComponent } from './components/loaders/customers-loader/customers-loader.component';
import { StakeholdersComponent } from './pages/stakeholders/stakeholders.component';
import { StakeholderDetailsComponent } from './pages/stakeholders/stakeholder-details/stakeholder-details.component';
import { AddStakeholderNeedsExpectationsComponent } from './components/stakeholders/add-stakeholder-needs-expectations/add-stakeholder-needs-expectations.component';
import { ReportListComponent } from './pages/reports/pages/reports/report-list.component';
import { ReportDetailsComponent } from './pages/reports/pages/reports/report-details/report-details.component';
import { StakeholderAnalysisLoaderComponent } from './components/loaders/stakeholder-analysis-loader/stakeholder-analysis-loader.component';

import { SwotLoaderComponent } from './components/loaders/swot-loader/swot-loader.component';
import { ExternalIssuesLoaderComponent } from './components/loaders/external-issues-loader/external-issues-loader.component';
import { InternalIssuesLoaderComponent } from './components/loaders/internal-issues-loader/internal-issues-loader.component';
import { IssueDetailsLoaderComponent } from './components/loaders/issue-details-loader/issue-details-loader.component';
import { ReportByCategoryComponent } from './pages/reports/pages/reports/report-by-category/report-by-category.component';
import { StakeholderDetailsLoaderComponent } from './components/loaders/stakeholder-details-loader/stakeholder-details-loader.component';
import { BusinessApplicationsComponent } from './pages/business-profile/business-applications/business-applications.component';
import { StrategicObjectivesComponent } from './pages/business-profile/strategic-objectives/strategic-objectives.component';
import { OcDepartmentLoaderComponent } from './components/loaders/oc-department-loader/oc-department-loader.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DashboardLoaderComponent } from './components/loaders/dashboard-loader/dashboard-loader.component';
import { PoliciesDetialsLoaderComponent } from './components/loaders/policies-detials-loader/policies-detials-loader.component';
import { OrganisationChartFullviewComponent } from './components/business-profile/organisation-chart-fullview/organisation-chart-fullview.component';
import { SupplierComponent } from './pages/business-profile/supplier/supplier.component';
import { OrganizationOverviewComponent } from './pages/organization-overview/organization-overview.component';
import { OrganizationOverviewAddComponent } from './pages/organization-overview/organization-overview-add/organization-overview-add.component';
import { OrganizationChartViewComponent } from './components/business-profile/organization-chart-view/organization-chart-view.component';
import { SupplierDetailsComponent } from './pages/business-profile/supplier/supplier-details/supplier-details.component';
// import { CustomersDetailsLoaderComponent } from '../customer-engagement/component/loader/customers-details-loader/customers-details-loader.component';
@NgModule({
  declarations: [
    BusinessProfileComponent, OrganizationContextComponent, OrganizationReportsComponent, 
    OrganizationDashboardComponent, ProfileComponent, PoliciesComponent, SubsidiaryComponent, BranchesComponent, 
    MsTypeComponent, ProductsComponent, ServicesComponent, ProjectsComponent, OcComponent, 
    CustomerComponent, PestleAnalysisComponent, InternalIssuesComponent, ExternalIssuesComponent, 
    StakeholderAnalysisComponent, IssueListComponent,
    SwotAnalysisComponent, IssuelistMainComponent, IssueDetailsComponent, 
    IssueProcessesComponent, IssueActivityLogComponent, AddIssueComponent, EditProfileComponent,
    EditIssueComponent, PreviewcomponentComponent, ViewMoreComponent, 
    ProfileSliderComponent, OrganizationChartDivComponent, ProfileComponentLoaderComponent, 
    ProfileLoaderComponent, SubsidiaryLoaderComponent, BranchesLoaderComponent, MsTypesLoaderComponent, 
    PoliciesLoaderComponent, ProductsLoaderComponent, ServicesLoaderComponent, ProjectsLoaderComponent, 
    OrganizationChartLoaderComponent, StakeholdersComponent, StakeholderDetailsComponent, 
    AddStakeholderNeedsExpectationsComponent, ReportListComponent, ReportDetailsComponent, StakeholderAnalysisLoaderComponent, SwotLoaderComponent, ExternalIssuesLoaderComponent, InternalIssuesLoaderComponent, IssueDetailsLoaderComponent, ReportByCategoryComponent, StakeholderDetailsLoaderComponent, BusinessApplicationsComponent, StrategicObjectivesComponent, OcDepartmentLoaderComponent, DashboardLoaderComponent, PoliciesDetialsLoaderComponent, OrganisationChartFullviewComponent, SupplierComponent, OrganizationOverviewComponent, OrganizationOverviewAddComponent, OrganizationChartViewComponent, SupplierDetailsComponent,
    // CustomersDetailsLoaderComponent
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
    SharedModule,
    NgxPaginationModule,
    CarouselModule
  ],
  exports: [
    
  ]
})
export class OrganizationModule { }
