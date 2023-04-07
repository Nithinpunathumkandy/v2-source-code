import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';

@Component({
  selector: 'app-asset-maintenances',
  templateUrl: './asset-maintenances.component.html',
  styleUrls: ['./asset-maintenances.component.scss']
})
export class AssetMaintenancesComponent implements OnInit {
  AssetRegisterStore = AssetRegisterStore;
  AssetMaintenanceStore = AssetMaintenanceStore;
  constructor(){
    
  }
  ngOnInit(){

  }

  ngOnDestroy() {
    AssetMaintenanceStore.unsetAssetMaintenanceDetails();

  }

}
