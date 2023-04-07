import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComplaintActionPlansDetailsComponent } from './pages/customer-complaint-action-plans/pages/customer-complaint-action-plans-details/customer-complaint-action-plans-details.component';
import { CustomerComplaintActionPlansListComponent } from './pages/customer-complaint-action-plans/pages/customer-complaint-action-plans-list/customer-complaint-action-plans-list.component';
import { CustomerComplaintActionPlansComponent } from './pages/customer-complaint-action-plans/pages/customer-complaint-action-plans.component';

import { AddCustomerComplaintComponent } from './pages/customer-complaint/add-customer-complaint/add-customer-complaint.component';
import { CustomerActionPlanComponent } from './pages/customer-complaint/customer-complaint-details/customer-action-plan/customer-action-plan.component';
import { CustomerComplaintDetailsComponent } from './pages/customer-complaint/customer-complaint-details/customer-complaint-details.component';
import { CustomerComplaintInfoComponent } from './pages/customer-complaint/customer-complaint-details/customer-complaint-info/customer-complaint-info.component';
import { CustomerComplaintMappingComponent } from './pages/customer-complaint/customer-complaint-details/customer-complaint-mapping/customer-complaint-mapping.component';
import { CustomerComplaintListComponent } from './pages/customer-complaint/customer-complaint-list/customer-complaint-list.component';
import { CustomerComplaintComponent } from './pages/customer-complaint/customer-complaint.component';
import { CustomerEngagementOverviewComponent } from './pages/customer-engagement-overview/customer-engagement-overview.component';
import { AddCustomerInvestigationComponent } from './pages/customer-investigation/add-customer-investigation/add-customer-investigation.component';
import { CustomerInvestigationListComponent } from './pages/customer-investigation/customer-investigation-list/customer-investigation-list.component';
import { CustomerInvestigationComponent } from './pages/customer-investigation/customer-investigation.component';
import { CustomersDetailsComponent } from './pages/customers/customers-details/customers-details.component';
import { CustomersComponent } from './pages/customers/customers.component';




const routes: Routes = [
  {
    path: 'customer',
    component: CustomersComponent,
    data:{
      core: { title: 'Customers' },
      breadcrumb: 'customer'
    }
  },
  {
    path: 'user-guides',
    component: CustomerEngagementOverviewComponent,
    data:{
      core: { title: 'Overview' },
      // breadcrumb: 'overvbiew'
    }
  },
  {
        path: 'customer/:id',
        component: CustomersDetailsComponent,
        data: {
          core: { title: 'Customer Details' },

        }
  },
    
  
  {
    path: 'complaint',
    component: CustomerComplaintComponent,
    data: {
      core: { title: 'Complaints' },
      breadcrumb: 'complaints'
    },
    children: [
      
      {
        path: '',
        component: CustomerComplaintListComponent,
        data: {
          core: { title: 'Complaints' },
          breadcrumb: null
        }
      },
      {
        path: ':id',
        component: CustomerComplaintDetailsComponent,
        children: [
          {
            path: 'info',
            component: CustomerComplaintInfoComponent,
            data: {
              core: { title: "Customer Complaint Info" }
            }
          },
          {
            path: 'mapping',
            component: CustomerComplaintMappingComponent,
            data: {
              core: { title: "Mapping" }
            }
          },
          {
            path: 'action-plan',
            component: CustomerActionPlanComponent,
            data: {
              core: { title: "Action Plan" }
            }
          },
        ]
      },
     
    ]
  },

  {
    path: 'complaint-investigation',
    component: CustomerInvestigationComponent,
    data: {
      core: { title: 'Investigations' },
      breadcrumb: 'investigation'
    },
    children: [
      
      {
        path: '',
        component: CustomerInvestigationListComponent,
        data: {
          core: { title: 'Investigations' },
          breadcrumb: null
        }
      },
      {
        path: 'add-complaint-investigation',
        component: AddCustomerInvestigationComponent,
        data: {
          core: { title: 'Add Customer Investigation' },
          breadcrumb: null
        }
      },
    ]
  },
  

  {
    path: 'complaint-action-plan',
    component: CustomerComplaintActionPlansComponent,
    children: [
      {
        path: "",
        component: CustomerComplaintActionPlansListComponent,
        data: {
          core: { title: 'Customer Complaint Action Plans' },
          breadcrumb: 'complaints_action_plan'
        }
      },
      {
        path: ':id',
        component: CustomerComplaintActionPlansDetailsComponent,
        data: {
          core: { title: 'Customer Complaint Action Plans Details' },
          breadcrumb: null
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerEngagementRoutingModule { }
