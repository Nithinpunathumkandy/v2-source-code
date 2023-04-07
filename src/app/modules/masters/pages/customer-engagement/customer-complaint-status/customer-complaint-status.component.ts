import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CustomerCompliantStatusService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-status/customer-compliant-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CustomerCompliantStatusMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-status-store';

@Component({
  selector: 'app-customer-complaint-status',
  templateUrl: './customer-complaint-status.component.html',
  styleUrls: ['./customer-complaint-status.component.scss']
})
export class CustomerComplaintStatusComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  CustomerCompliantStatusMasterStore = CustomerCompliantStatusMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(
    private _customerCompliantStatusService: CustomerCompliantStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService

  ) { }

  ngOnInit(): void {

     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CUSTOMER_COMPLAINT_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_CUSTOMER_COMPLAINT_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'customer-engagement'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._customerCompliantStatusService.exportToExcel();
            break;
          case "search":
            CustomerCompliantStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) CustomerCompliantStatusMasterStore.setCurrentPage(newPage);
    this._customerCompliantStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for sorting
   sortTitle(type: string) {

    this._customerCompliantStatusService.sortCompliantStatusList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }
}
