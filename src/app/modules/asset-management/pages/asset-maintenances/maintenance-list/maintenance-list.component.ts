import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetDashboardStore } from 'src/app/stores/asset-management/asset-dashboard/asset-dashboard-store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
declare var $: any;


@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss']
})
export class MaintenanceListComponent implements OnInit {
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
  reactionDisposer: IReactionDisposer
  AssetMaintenanceStore = AssetMaintenanceStore;
  AppStore = AppStore;
  deleteEventSubscription: any;

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };

  filterSubscription: Subscription = null;
  
  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _assetMaintenanceService: AssetMaintenanceService,
    private _eventEmitterService: EventEmitterService,
    private _rightSidebarFilterService: RightSidebarFilterService,) { }

  ngOnInit(): void {
    
    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.AssetMaintenanceStore.loaded = false;
		  this.pageChange(1);
		})
    AssetRegisterStore.assetId=null;
    AssetRegisterStore.currentAssetPage="maintenance-main";
    AssetMaintenanceStore.maintenanceId = null;
    AssetMaintenanceStore.maintananceMainTab = true
    NoDataItemStore.setNoDataItems({ title: "maintenance_empty_message", subtitle: 'maintenance_subtitle', buttonText: 'add_new' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName:null,submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'new_modal' } },

      ]

      this._helperService.checkSubMenuItemPermissions(900, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {

          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addAssetMaintenance();
            }, 1000);
            break;
          case "template":
            this._assetMaintenanceService.generateTemplate();
            break;
          case "export_to_excel":
            this._assetMaintenanceService.exportToExcel();
            break;
          case "search":
            AssetMaintenanceStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            AssetMaintenanceStore.searchText = '';
            AssetMaintenanceStore.loaded = false;
            this.pageChange(1);
            break;	
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.addAssetMaintenance();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.deleteMaintenance(item);
      }
    );

    RightSidebarLayoutStore.filterPageTag = 'asset_maintenance';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
      'asset_maintenance_category_ids',
      'asset_maintenance_type_ids',
      'asset_maintenance_schedule_frequency_ids',
      'asset_maintenance_status_ids',
      'asset_ids'
		]);

    //this.pageChange(1);
    if(AssetMaintenanceStore.currentPage)
    {
      this.pageChange(AssetMaintenanceStore.currentPage);
    }
    else
    {
      this.pageChange(1);
    }
  }


  pageChange(newPage: number = null) {
    if (newPage) AssetMaintenanceStore.setCurrentPage(newPage);
    var additionalParams=''
    if (AssetDashboardStore.dashboardParam) {
      additionalParams = AssetDashboardStore.dashboardParam
    }
    this._assetMaintenanceService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  deleteMaintenance(status: boolean) {
    if (status && this.popupObject.id) {
      this._assetMaintenanceService.deleteMaintenance(this.popupObject.id).subscribe(
        (resp) => {
          this._utilityService.detectChanges(this._cdr);
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        },
      );
    } else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }
  }


  clearPopupObject() {
    this.popupObject.id = null;

  }


  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal("hide");
    this._utilityService.detectChanges(this._cdr);
  }


  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = "";
    this.popupObject.id = id;
    this.popupObject.title = "Delete Maintenance?";
    this.popupObject.subtitle = "common_delete_subtitle";
    $(this.confirmationPopUp.nativeElement).modal("show");
  }

  addAssetMaintenance() {
    if(AssetRegisterStore.currentAssetPage!='maintenance-main')
    AssetRegisterStore.individual_asset_loaded = true;
    this._utilityService.detectChanges(this._cdr);
    this._router.navigateByUrl('asset-management/asset-maintenances/add-maintenance');

  }

  gotoDetails(maintenance) {
    this.AssetMaintenanceStore.setMaintenanceId(maintenance.id);
    AssetRegisterStore.assetId = maintenance.asset_id;
    this._utilityService.detectChanges(this._cdr)
    this._router.navigateByUrl('asset-management/asset-maintenances/'+AssetMaintenanceStore.maintenanceId);
  }

  editMaintenance(id) {
    AssetMaintenanceStore.maintenanceId = id;
    AssetMaintenanceStore.editFlag = true;
    this._router.navigateByUrl('asset-management/asset-maintenances/edit-maintenance');
  }
  sortTitle(type: string) {
    this._assetMaintenanceService.sortMaintenanceList(type,false);
    this.pageChange()
  }

  ngOnDistroy(){
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
    AssetDashboardStore.unsetDashboardParam();
  }

}
