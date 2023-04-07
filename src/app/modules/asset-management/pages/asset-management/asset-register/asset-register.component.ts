import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';	
import { AppStore } from 'src/app/stores/app.store';
import { Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Subscription } from 'rxjs';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { AssetDashboardStore } from 'src/app/stores/asset-management/asset-dashboard/asset-dashboard-store';
import { AssetManagementSettingsService } from 'src/app/core/services/settings/organization_settings/asset-management-settings/asset-management-settings.service';
declare var $: any;

@Component({
  selector: 'app-asset-register',
  templateUrl: './asset-register.component.html',
  styleUrls: ['./asset-register.component.scss']
})
export class AssetRegisterComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild("confirmationPopUp") confirmationPopUp: ElementRef;
	reactionDisposer: IReactionDisposer;
	SubMenuItemStore = SubMenuItemStore;	
 	BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	AssetRegisterStore = AssetRegisterStore;
  	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
    fileUploadPopupStore = fileUploadPopupStore;
  	deleteEventSubscription: any;
  	filterSubscription: Subscription = null;

  assetRegisterObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: "",
    title: "",
    id: null,
    subtitle: "",
  };


  constructor(
	private _utilityService: UtilityService,
  private _eventEmitterService: EventEmitterService,
	private _helperService: HelperServiceService,
  private _cdr: ChangeDetectorRef,
	private _router: Router,
  private _renderer2: Renderer2,
	private _assetRegisterService: AssetRegisterService,
  private _rightSidebarFilterService: RightSidebarFilterService,
  private _humanCapitalService:HumanCapitalService,
  private _imageService:ImageServiceService,
  private _assetManagementSettingsService:AssetManagementSettingsService

  ) { }

  ngOnInit(): void {
    
    RightSidebarLayoutStore.showFilter = true;
		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.AssetRegisterStore.loaded = false;
		  this.pageChange(1);
		})

    AssetRegisterStore.currentAssetPage = null;
    AssetRegisterStore.assetId = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle',buttonText:'add_new'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: {type: 'new_modal'}},
        {activityName: null, submenuItem: {type: 'refresh'}},
        { activityName: '', submenuItem: { type: 'template' } },
        { activityName: '', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'IMPORT_ASSET', submenuItem: { type: 'import' }},
        {activityName:null,submenuItem: {type: 'search'}}
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.clearCommonFilePopupDocuments();
            setTimeout(() => {
				this._utilityService.detectChanges(this._cdr);
				this.openFormModal();
			}, 1000);
			break;
          case "template":
            this._assetRegisterService.generateTemplate();
            break;
          case "export_to_excel":
            this._assetRegisterService.exportToExcel();
            break;
          case "search":
            AssetRegisterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "import":
            ImportItemStore.setTitle('import_asset_title');
            ImportItemStore.setImportFlag(true);
            break;
          case "refresh":
            SubMenuItemStore.searchText = '';
            AssetRegisterStore.searchText = '';
            AssetRegisterStore.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
            this.openFormModal();
            NoDataItemStore.unSetClickedNoDataItem();
          }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._assetRegisterService.importData(ImportItemStore.getFileDetails).subscribe(res => {
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        }, (error) => {
          if (error.status == 422) {
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if (error.status == 500 || error.status == 403) {
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.modalControl(item);
      }
    );
    RightSidebarLayoutStore.filterPageTag = 'asset_register';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
      'asset_category_ids',
      'asset_type_ids',
      'asset_sub_category_ids',
      'asset_investment_type_ids',
      'physical_condition_ranking_ids',
      'custodian_ids',
      'supplier_ids',
      'asset_status_ids',
      'asset_owner_ids',
      'is_criticality_performed',
      'is_isms',
      'asset_rating_ids',
      'asset_maintenance_category_ids',
      'asset_maintenance_type_ids',
      'asset_maintenance_schedule_frequency_ids',
      'process_ids'

		]);
    this.pageChange(1);

    this.getAssetSettings();
  }

  getAssetSettings(){
		this._assetManagementSettingsService.getItems().subscribe(res=>{
			this._utilityService.detectChanges(this._cdr)
		})
	}

  openFormModal() {

	this._router.navigateByUrl('asset-management/assets/add-asset');

}

editAsset(id) {
  AssetRegisterStore.setAssetId(id);
  AssetRegisterStore.editFlag = true;
  this._router.navigateByUrl('asset-management/assets/edit-asset');
}

clearCommonFilePopupDocuments() {
  fileUploadPopupStore.clearFilesToDisplay();
  fileUploadPopupStore.clearKHFiles();
  fileUploadPopupStore.clearSystemFiles();
  fileUploadPopupStore.clearUpdateFiles();
}

deleteTraining(status: boolean) {
  if (status && this.popupObject.id) {
    this._assetRegisterService.deleteAsset(this.popupObject.id).subscribe(
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


delete(id: number) {
  event.stopPropagation();
  this.popupObject.type = "";
  this.popupObject.id = id;
  this.popupObject.title = "Delete Asset?";
  this.popupObject.subtitle = "common_delete_subtitle";
  $(this.confirmationPopUp.nativeElement).modal("show");
}

closeConfirmationPopUp() {
  $(this.confirmationPopUp.nativeElement).modal("hide");
  this._utilityService.detectChanges(this._cdr);
}

modalControl(status: boolean) {
  switch (this.popupObject.type) {
    case "":
      this.deleteTraining(status);
      break;
  }
}

createImagePreview(type, token) {
  return this._humanCapitalService.getThumbnailPreview(type, token);
}

getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}

clearPopupObject() {
  this.popupObject.id = null;
  // this.popupObject.title = '';
  // this.popupObject.subtitle = '';
  // this.popupObject.type = '';
}

gotoDetailsPage(id) {
  AssetRegisterStore.assetId = id;
  this._router.navigateByUrl(`asset-management/assets/${id}`);
}

pageChange(newPage: number = null) {
  if (newPage) AssetRegisterStore.setCurrentPage(newPage);
  var additionalParams=''
  if (AssetDashboardStore.dashboardParam) {
    additionalParams = AssetDashboardStore.dashboardParam
  }
  this._assetRegisterService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
  setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  // this._assetRegisterService.getItems(false,AssetDashboardStore.assetDashboardParam ? '&'+AssetDashboardStore.assetDashboardParam : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
}

setAssetSort(type) {
  this._assetRegisterService.sortAssetList(type);
  this.pageChange();
}

  ngOnDestroy(){
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    AssetRegisterStore.searchText = null;
    SubMenuItemStore.searchText = '';
    AssetRegisterStore.unsetDocumentDetails();
    AssetRegisterStore.loaded = false;
    this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
    RightSidebarLayoutStore.showFilter = false;
    AssetDashboardStore.unsetDashboardParam();
  }
  
}
