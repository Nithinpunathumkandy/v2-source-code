import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CustomerComplaintInvestigationStatusService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-investigation-status/customer-complaint-investigation-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { CustomerComplaintInvestigationStatusMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-investigation-status-store';

@Component({
  selector: 'app-customer-complaint-investigation-status',
  templateUrl: './customer-complaint-investigation-status.component.html',
  styleUrls: ['./customer-complaint-investigation-status.component.scss']
})
export class CustomerComplaintInvestigationStatusComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  CustomerComplaintInvestigationStatusMasterStore = CustomerComplaintInvestigationStatusMasterStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(
    private _customerComplaintInvestigationStatusService: CustomerComplaintInvestigationStatusService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService

  ) { }

  ngOnInit(): void {

     NoDataItemStore.setNoDataItems({title: "common_nodata_title"});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CUSTOMER_COMPLAINT_INVESTIGATION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_CUSTOMER_COMPLAINT_INVESTIGATION_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'customer-engagement'}},
      ]
     
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
                           
      
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "export_to_excel":
            this._customerComplaintInvestigationStatusService.exportToExcel();
            break;
          case "search":
            CustomerComplaintInvestigationStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) CustomerComplaintInvestigationStatusMasterStore.setCurrentPage(newPage);
    this._customerComplaintInvestigationStatusService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

   // for sorting
   sortTitle(type: string) {

    this._customerComplaintInvestigationStatusService.sortCustomerComplaintInvestigationStatusList(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

}
