import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AssetMaintenanceScheduleFrequenciesMasterStore } from 'src/app/stores/masters/asset-management/asset-maintenance-schedule-frequencies-store';
import { AssetMaintenanceScheduleFrequenciesService } from 'src/app/core/services/masters/asset-management/asset-maintenance-schedule-frequencies/asset-maintenance-schedule-frequencies.service';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-asset-maintenance-schedule-frequencies',
  templateUrl: './asset-maintenance-schedule-frequencies.component.html',
  styleUrls: ['./asset-maintenance-schedule-frequencies.component.scss']
})
export class AssetMaintenanceScheduleFrequenciesComponent implements OnInit {

  reactionDisposer: IReactionDisposer;
  AssetMaintenanceScheduleFrequenciesMasterStore = AssetMaintenanceScheduleFrequenciesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _assetMaintenanceScheduleFrequenciesService: AssetMaintenanceScheduleFrequenciesService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AssetMaintenanceScheduleFrequenciesComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ASSET_MAINTENANCE_SCHEDULE_FREQUENCY_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_ASSET_MAINTENANCE_SCHEDULE_FREQUENCY', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close', path: 'asset-management'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {             
              case "export_to_excel":
                this._assetMaintenanceScheduleFrequenciesService.exportToExcel();
                break;
                case "search":
                  AssetMaintenanceScheduleFrequenciesMasterStore.searchText = SubMenuItemStore.searchText;
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
    if (newPage) AssetMaintenanceScheduleFrequenciesMasterStore.setCurrentPage(newPage);
    this._assetMaintenanceScheduleFrequenciesService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

 
    sortTitle(type: string) {
      this._assetMaintenanceScheduleFrequenciesService.sortAssetMaintenanceScheduleFrequenciesList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof AssetMaintenanceScheduleFrequenciesComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      AssetMaintenanceScheduleFrequenciesMasterStore.searchText = '';
      AssetMaintenanceScheduleFrequenciesMasterStore.currentPage = 1 ;
    }
    
}
