import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CustomerComplaintActionPlanStatusesService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-action-plan-statuses/customer-complaint-action-plan-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CustomerComplaintActionPlanStatusesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-plan-statuses';

@Component({
  selector: 'app-customer-complaint-action-plan-statuses',
  templateUrl: './customer-complaint-action-plan-statuses.html',
  styleUrls: ['./customer-complaint-action-plan-statuses.scss']
})
export class CustomerComplaintActionPlanStatusesComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  CustomerComplaintActionPlanStatusesMasterStore = CustomerComplaintActionPlanStatusesMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(
    private _customerComplaintActionPlanStatusesService: CustomerComplaintActionPlanStatusesService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService

  ) { }

  ngOnInit(): void {

     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CUSTOMER_COMPLAINT_ACTION_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_CUSTOMER_COMPLAINT_ACTION_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'customer-engagement'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._customerComplaintActionPlanStatusesService.exportToExcel();
            break;
          case "search":
            CustomerComplaintActionPlanStatusesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    
     
    })
   
    this.pageChange(1);
    
  }
  pageChange(newPage: number = null) {
    if (newPage) CustomerComplaintActionPlanStatusesMasterStore.setCurrentPage(newPage);
    this._customerComplaintActionPlanStatusesService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for sorting
   sortTitle(type: string) {
    this._customerComplaintActionPlanStatusesService.sortCustomerComplaintActionPlanStatusesList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

}
