import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BusinessContinuityPlanStatusService } from 'src/app/core/services/masters/bcm/business-continuity-plan-status/business-continuity-plan-status.service';
import { BusinessContinuityPlanStatusMasterStore } from 'src/app/stores/masters/bcm/business-continuity-plan-status.store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-business-continuity-plan-status',
  templateUrl: './business-continuity-plan-status.component.html',
  styleUrls: ['./business-continuity-plan-status.component.scss']
})
export class BusinessContinuityPlanStatusComponent implements OnInit {  

  reactionDisposer: IReactionDisposer;
  BusinessContinuityPlanStatusMasterStore = BusinessContinuityPlanStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _businessContinuityPlanStatusService: BusinessContinuityPlanStatusService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof BusinessContinuityPlanStatusComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'BUSINESS_CONTINUITY_PLAN_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_BUSINESS_CONTINUITY_PLAN_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'bcm'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._businessContinuityPlanStatusService.exportToExcel();
                break;
                case "search":
                  BusinessContinuityPlanStatusMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) BusinessContinuityPlanStatusMasterStore.setCurrentPage(newPage);
    this._businessContinuityPlanStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

    sortTitle(type: string) {
      this._businessContinuityPlanStatusService.sortBusinessContinuityPlanStatusList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof BusinessContinuityPlanStatusComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      BusinessContinuityPlanStatusMasterStore.searchText = '';
      BusinessContinuityPlanStatusMasterStore.currentPage = 1 ;
    }
    
}
