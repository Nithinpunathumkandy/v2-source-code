import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
declare var $: any;

@Component({
  selector: 'app-asset-maintenance-list',
  templateUrl: './asset-maintenance-list.component.html',
  styleUrls: ['./asset-maintenance-list.component.scss']
})
export class AssetMaintenanceListComponent implements OnInit {
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

  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _assetMaintenanceService: AssetMaintenanceService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    AssetMaintenanceStore.maintananceMainTab = false;
    AssetMaintenanceStore.maintenanceId = null;
    NoDataItemStore.setNoDataItems({ title: "maintenance_empty_message", subtitle: 'maintenance_subtitle', buttonText: 'add_new' });
    this.reactionDisposer = autorun(() => {
      

      var subMenuItems = [
        {activityName:null,submenuItem: {type: 'search'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        { activityName: null, submenuItem: { type: 'new_modal' } },
        { activityName: null, submenuItem: { type: 'close', path: '/asset-management/assets' } },

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
    this.pageChange();
  }


  pageChange(newPage: number = null) {
    if (newPage) AssetMaintenanceStore.setCurrentPage(newPage);
    if(AssetRegisterStore.assetId){
      this._assetMaintenanceService.getItems(false, '&asset_ids=' + AssetRegisterStore.assetId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
    
  }

  ngAfterViewChecked(){
    AssetRegisterStore.currentAssetPage=null;
  }


  deleteMaintenance(status: boolean) {
    if (status && this.popupObject.id) {
      this._assetMaintenanceService.deleteMaintenance(this.popupObject.id,'&asset_ids='+AssetRegisterStore.assetId).subscribe(
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
    AssetRegisterStore.individual_asset_loaded = true;
    this._utilityService.detectChanges(this._cdr);
    this._router.navigateByUrl('asset-management/assets/' + AssetRegisterStore.assetId + '/add-asset-maintenance');

  }

  gotoDetails(id) {
    this.AssetMaintenanceStore.setMaintenanceId(id);
    AssetRegisterStore.currentAssetPage='maintenance';
    this._utilityService.detectChanges(this._cdr)
    this._router.navigateByUrl('asset-management/assets/' + AssetRegisterStore.assetId + '/maintenances/'+AssetMaintenanceStore.maintenanceId);
  }

  editMaintenance(id) {
    AssetMaintenanceStore.maintenanceId = id;
    AssetMaintenanceStore.editFlag = true;
    this._router.navigateByUrl('asset-management/assets/' + AssetRegisterStore.assetId + '/edit-asset-maintenance');
  }

  
setMaintenanceSort(type) {
  this._assetMaintenanceService.sortMaintenanceList(type);
  this.pageChange();
}

  ngOnDistroy(){
    // BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    if (this.reactionDisposer) this.reactionDisposer();
 
  }


}
