
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetRegisterService } from 'src/app/core/services/asset-management/asset-register/asset-register.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssetMatrixStore } from 'src/app/stores/asset-management/asset-matrix/asset-matrix-store';
import { AssetCriticalityStore } from 'src/app/stores/asset-management/asset-register/asset-criticality-store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { AssetManagementSettingsService } from 'src/app/core/services/settings/organization_settings/asset-management-settings/asset-management-settings.service';


@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss']
})
export class AssetDetailsComponent implements OnInit {

  AppStore = AppStore;
  AssetRegisterStore = AssetRegisterStore;
  AssetMaintenanceStore = AssetMaintenanceStore;
  OrganizationModulesStore = OrganizationModulesStore;
  constructor(
    private _activatedRouter: ActivatedRoute,
    private _assetRegisterService: AssetRegisterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _assetManagementSettingsService:AssetManagementSettingsService
  ) { }

  ngOnInit(): void {
    this.getAssetSettings();
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this._utilityService.detectChanges(this._cdr);

    let id: number;
    this._activatedRouter.params.subscribe(params => {
      id = +params['id']; 
     AssetRegisterStore.assetId = id;
     this.getAssetRegister(id);
    });
  }

  getAssetSettings(){
		this._assetManagementSettingsService.getItems().subscribe(res=>{
			this._utilityService.detectChanges(this._cdr)
		})
	}

  
  getAssetRegister(id){
    if(AssetRegisterStore.currentAssetPage!='maintenance-main' && id)
    this._assetRegisterService.getItem(id).subscribe(()=> this._utilityService.detectChanges(this._cdr)
    );
  }

  ngOnDestroy(){
  AssetRegisterStore.unsetIndiviudalAssetDetails();
  AssetCriticalityStore.unsetAssetCriticalityDetails();
  AssetMatrixStore.unsetAssetMatrixDetails();
  BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}
