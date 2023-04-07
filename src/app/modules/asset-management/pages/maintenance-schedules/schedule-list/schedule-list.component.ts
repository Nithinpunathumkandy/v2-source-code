import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetMaintenanceScheduleStore } from 'src/app/stores/asset-management/asset-register/asset-schedule-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MaintenanceScheduleService } from 'src/app/core/services/asset-management/asset-register/maintenance-schedule/maintenance-schedule.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';


@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit,OnDestroy {
  //AssetMaintenanceStore = AssetMaintenanceStore;
  reactionDisposer: IReactionDisposer
  AssetMaintenanceScheduleStore = AssetMaintenanceScheduleStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  filterSubscription: Subscription = null;
  NoDataItemStore = NoDataItemStore;

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _maintenanceScheduleService: MaintenanceScheduleService,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.AssetMaintenanceScheduleStore.loaded = false;
		  this.pageChange(1);
		})

    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'refresh'}},
        // { activityName: '', submenuItem: { type: 'template' } },
        { activityName: '', submenuItem: { type: 'export_to_excel' } },
        {activityName:null,submenuItem: {type: 'search'}},
      ]
      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          // case "template":
          //   this._maintenanceScheduleService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._maintenanceScheduleService.exportToExcel();
            break;
          case "search":
            AssetMaintenanceScheduleStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            AssetMaintenanceScheduleStore.searchText = '';
            AssetMaintenanceScheduleStore.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      // if (NoDataItemStore.clikedNoDataItem) {
      //   this.addAssetMaintenance();
      //   NoDataItemStore.unSetClickedNoDataItem();
      // }

    })

    RightSidebarLayoutStore.filterPageTag = 'asset_maintenance';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
      'asset_ids',
      'supplier_ids',
      'responsible_user_ids'
		]);

    if(AssetMaintenanceScheduleStore.currentPage)
    {
      this.pageChange(AssetMaintenanceScheduleStore.currentPage);
    }
    else
    {
      this.pageChange(1);
    }
    
  }

  gotoDetails(maintenance){
    AssetMaintenanceScheduleStore.setScheduleId(maintenance.id);
    AssetMaintenanceScheduleStore.assetId = maintenance.asset_id;
    this._utilityService.detectChanges(this._cdr)
    this._router.navigateByUrl('asset-management/asset-maintenance-schedules/'+maintenance.id);
  }
  pageChange(newPage: number = null) {
    if (newPage) AssetMaintenanceScheduleStore.setCurrentPage(newPage);
    this._maintenanceScheduleService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100))
  }

  sortTitle(type: string) {
    this._maintenanceScheduleService.sortMaintenanceSchedule(type, SubMenuItemStore.searchText);
    this.pageChange()
  }


  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AssetMaintenanceScheduleStore.searchText = null;
    SubMenuItemStore.searchText = '';
    this._rightSidebarFilterService.resetFilter();
    

  }


}
