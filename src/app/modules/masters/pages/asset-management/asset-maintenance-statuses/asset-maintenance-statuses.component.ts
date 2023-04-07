import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AssetMaintenanceStatusesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-statuses';
import { AssetMaintenanceStatusesService } from 'src/app/core/services/masters/asset-management/asset-maintenance-statuses/asset-maintenance-statuses.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-asset-maintenance-statuses',
  templateUrl: './asset-maintenance-statuses.component.html',
  styleUrls: ['./asset-maintenance-statuses.component.scss']
})
export class AssetMaintenanceStatusesComponent implements OnInit {  

  reactionDisposer: IReactionDisposer;
  AssetMaintenanceStatusesMasterStore = AssetMaintenanceStatusesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _assetMaintenanceStatusesService: AssetMaintenanceStatusesService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AssetMaintenanceStatusesComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ASSET_MAINTENANCE_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_ASSET_MAINTENANCE_STATUS', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'asset-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._assetMaintenanceStatusesService.exportToExcel();
                break;
                case "search":
                  AssetMaintenanceStatusesMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) AssetMaintenanceStatusesMasterStore.setCurrentPage(newPage);
    this._assetMaintenanceStatusesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

    sortTitle(type: string) {
      this._assetMaintenanceStatusesService.sortAssetMaintenanceStatusesList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof AssetMaintenanceStatusesComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      AssetMaintenanceStatusesMasterStore.searchText = '';
      AssetMaintenanceStatusesMasterStore.currentPage = 1 ;
    }
    
}
