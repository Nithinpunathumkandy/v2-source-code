import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerComplaintService } from 'src/app/core/services/customer-satisfaction/customer-complaint/customer-complaint.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { CustomerComplaintStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-compaint-store';
import { CustomerMappingStore } from 'src/app/stores/customer-engagement/customer-complaint/customer-mapping-store';
import { CustomerInvestigationStore } from 'src/app/stores/customer-engagement/customer-investigation/customer-investigation-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Component({
  selector: 'app-customer-complaint-details',
  templateUrl: './customer-complaint-details.component.html',
  styleUrls: ['./customer-complaint-details.component.scss']
})
export class CustomerComplaintDetailsComponent implements OnInit {


  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  customerComplaintSubscription: any;
  
  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _customerComplaintService: CustomerComplaintService,
    private _activatedRouter: ActivatedRoute,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
      CustomerComplaintStore.selectedCustomerComplaintId = id;
      this._customerComplaintService.saveCustomerComplaintId(id);
     this.getCustomerComplaint(id);
     
    });

    CustomerComplaintActionPlanStore.unsetCustomerComplaintActionPlan();
    this.customerComplaintSubscription = this._eventEmitterService.customerComplaint.subscribe(res => {
      this.getCustomerComplaint(CustomerComplaintStore.selectedCustomerComplaintId)
    });

  }
  getCustomerComplaint(id){
    this._customerComplaintService.getItem(id).subscribe(res=>{
        CustomerComplaintStore.setSelectedCustomerComplaintId(res['id']);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    CustomerComplaintActionPlanStore.individualLoaded = false;
    CustomerComplaintStore.individualLoaded = false;
    CustomerComplaintActionPlanStore.unsetCustomerComplaintActionPlan();
    CustomerComplaintStore.unsetIndivitualCustomerComplaint();
    CustomerMappingStore.unsetCustomerComplaintMapping();
    CustomerInvestigationStore.unsetIndivitualCustomerInvestigation();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.customerComplaintSubscription.unsubscribe()
  }

}
