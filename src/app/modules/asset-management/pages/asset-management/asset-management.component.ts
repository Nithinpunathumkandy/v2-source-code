import { Component, OnInit } from '@angular/core';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';

@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.scss']
})
export class AssetManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // AssetRegisterStore.currentAssetPage = null;
  }

}
