import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { BcpChangeRequestTypesService } from 'src/app/core/services/masters/bcm/bcp-change-request-types/bcp-change-request-types.service';
import { BCPChangeRequestTypeMasterStore } from 'src/app/stores/masters/bcm/bcp-change-request-type.store';

@Component({
  selector: 'app-bcp-change-request-types',
  templateUrl: './bcp-change-request-types.component.html',
  styleUrls: ['./bcp-change-request-types.component.scss']
})
export class BcpChangeRequestTypesComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  BCPChangeRequestTypeMasterStore = BCPChangeRequestTypeMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _bcpChangeRequestTypeService: BcpChangeRequestTypesService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_TYPE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_BUSINESS_CONTINUITY_PLAN_CHANGE_REQUEST_TYPE', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'bcm'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._bcpChangeRequestTypeService.exportToExcel();
                break;
                case "search":
                  BCPChangeRequestTypeMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) BCPChangeRequestTypeMasterStore.setCurrentPage(newPage);
    this._bcpChangeRequestTypeService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._bcpChangeRequestTypeService.sortBusinessContinuityPlanStatusList(type, null);
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
    BCPChangeRequestTypeMasterStore.searchText = '';
    BCPChangeRequestTypeMasterStore.currentPage = 1 ;
  }

}
