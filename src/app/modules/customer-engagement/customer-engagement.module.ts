import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerEngagementRoutingModule } from './customer-engagement-routing.module';
import { CustomerComplaintComponent } from './pages/customer-complaint/customer-complaint.component';
import { CustomerComplaintListComponent } from './pages/customer-complaint/customer-complaint-list/customer-complaint-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComplaintListLoaderComponent } from './component/loader/complaint-list-loader/complaint-list-loader.component';
import { AddCustomerComplaintComponent } from './pages/customer-complaint/add-customer-complaint/add-customer-complaint.component';
import { CustomerComplaintDetailsComponent } from './pages/customer-complaint/customer-complaint-details/customer-complaint-details.component';
import { CustomerComplaintInfoComponent } from './pages/customer-complaint/customer-complaint-details/customer-complaint-info/customer-complaint-info.component';
import { PreviewComponent } from './component/preview/preview.component';
import { CustomerInvestigationListComponent } from './pages/customer-investigation/customer-investigation-list/customer-investigation-list.component';
import { CustomerInvestigationComponent } from './pages/customer-investigation/customer-investigation.component';
import { AddCustomerInvestigationComponent } from './pages/customer-investigation/add-customer-investigation/add-customer-investigation.component';
import { AddCustomerComplaintActionPlanComponent } from './pages/customer-complaint-action-plans/components/add-customer-complaint-action-plan/add-customer-complaint-action-plan.component';
import { CustomerComplaintMappingComponent } from './pages/customer-complaint/customer-complaint-details/customer-complaint-mapping/customer-complaint-mapping.component';
import { CustomerComplaintActionPlansComponent } from './pages/customer-complaint-action-plans/pages/customer-complaint-action-plans.component';
import { CustomerComplaintActionPlansListComponent } from './pages/customer-complaint-action-plans/pages/customer-complaint-action-plans-list/customer-complaint-action-plans-list.component';
import { CustomerComplaintActionPlansDetailsComponent } from './pages/customer-complaint-action-plans/pages/customer-complaint-action-plans-details/customer-complaint-action-plans-details.component';
import { CustomerActionPlanComponent } from './pages/customer-complaint/customer-complaint-details/customer-action-plan/customer-action-plan.component';
import { MappingComponent } from './component/loader/mapping/mapping.component';
import { InfoLoaderComponent } from './component/loader/info-loader/info-loader.component';
import { ActionPlanAccordionComponent } from './component/loader/action-plan-accordion/action-plan-accordion.component';
import { ActionPlanDetailsLoaderComponent } from './pages/customer-complaint-action-plans/components/action-plan-details-loader/action-plan-details-loader.component';
import { CustomersComponent } from './pages/customers/customers.component';
// import { AddCustomersComponentComponent } from './component/add-customers-component/add-customers-component/add-customers-component.component';
import { CustomersLoaderComponent } from './component/loader/customers-loader/customers-loader/customers-loader.component';
// import { CustomersDetailsLoaderComponent } from './component/loader/customers-details-loader/customers-details-loader.component';
import { AddCustomersDetailsComponent } from './component/add-customers-details/add-customers-details.component';
import { CustomersDetailsComponent } from './pages/customers/customers-details/customers-details.component';
import { CustomerCorrectiveActionUpdateModalComponent } from './pages/customer-complaint-action-plans/components/modals/customer-corrective-action-update-modal/customer-corrective-action-update-modal.component';
import { CustomerCorrectiveActionHistoryModalComponent } from './pages/customer-complaint-action-plans/components/modals/customer-corrective-action-history-modal/customer-corrective-action-history-modal.component';
import { CustomerEngagementOverviewComponent } from './pages/customer-engagement-overview/customer-engagement-overview.component';




@NgModule({
  declarations: [
    CustomerComplaintComponent,
    CustomerComplaintListComponent,
    ComplaintListLoaderComponent,
    AddCustomerComplaintComponent,
    CustomerComplaintDetailsComponent,
    CustomerComplaintInfoComponent,
    PreviewComponent,
    CustomerInvestigationListComponent,
    CustomerInvestigationComponent,
    AddCustomerInvestigationComponent,
    CustomerComplaintMappingComponent,
    CustomerComplaintActionPlansComponent,
    CustomerComplaintActionPlansListComponent,
    CustomerComplaintActionPlansDetailsComponent,
    AddCustomerComplaintActionPlanComponent,
    CustomerActionPlanComponent,
    MappingComponent,
    InfoLoaderComponent,
    ActionPlanAccordionComponent,
    ActionPlanDetailsLoaderComponent,
    CustomersComponent,
    // AddCustomersComponentComponent,
    CustomersLoaderComponent,
    // CustomersDetailsLoaderComponent,
    AddCustomersDetailsComponent,
    CustomersDetailsComponent,
    CustomerCorrectiveActionUpdateModalComponent,
    CustomerCorrectiveActionHistoryModalComponent,
    CustomerEngagementOverviewComponent
  
   
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxPaginationModule,
    CustomerEngagementRoutingModule
  ],
  exports: [
    // AddCustomersComponentComponent 
  ]
})
export class CustomerEngagementModule { }
