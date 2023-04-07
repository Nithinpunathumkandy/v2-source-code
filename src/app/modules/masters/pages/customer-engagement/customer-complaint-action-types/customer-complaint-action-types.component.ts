import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { CustomerComplaintActionTypesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-types';
import { CustomerComplaintActionTypesService } from 'src/app/core/services/masters/customer-engagement/customer-complaint-action-types/customer-complaint-action-types.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-customer-complaint-action-types',
  templateUrl: './customer-complaint-action-types.component.html',
  styleUrls: ['./customer-complaint-action-types.component.scss']
})
export class CustomerComplaintActionTypesComponent implements OnInit {  

  reactionDisposer: IReactionDisposer;
  CustomerComplaintActionTypesMasterStore = CustomerComplaintActionTypesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _customerComplaintActionTypesService: CustomerComplaintActionTypesService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof CustomerComplaintActionTypesComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'CUSTOMER_COMPLAINT_ACTION_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_CUSTOMER_COMPLAINT_ACTION_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'customer-engagement'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._customerComplaintActionTypesService.exportToExcel();
                break;
                case "search":
                  CustomerComplaintActionTypesMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
              default:
                break;
            }
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
        })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) CustomerComplaintActionTypesMasterStore.setCurrentPage(newPage);
    this._customerComplaintActionTypesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

    sortTitle(type: string) {
      this._customerComplaintActionTypesService.sortCustomerComplaintActionTypesList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof CustomerComplaintActionTypesComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      CustomerComplaintActionTypesMasterStore.searchText = '';
      CustomerComplaintActionTypesMasterStore.currentPage = 1 ;
    }
    
}
