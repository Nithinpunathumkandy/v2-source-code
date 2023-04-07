import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetCriticality } from 'src/app/core/models/asset-management/asset-register/asset-criticality';
import { AssetRegisterStore } from 'src/app/stores/asset-management/asset-register/asset-register-store';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AssetCriticalityStore } from 'src/app/stores/asset-management/asset-register/asset-criticality-store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class AssetCriticalityService {

  constructor(private _http: HttpClient,
    private _utilityService:UtilityService) { }

  
  getItem(): Observable<AssetCriticality> {
    return this._http.get<AssetCriticality>('/assets/'+AssetRegisterStore.assetId+'/criticalities').pipe(
      map((res: AssetCriticality) => {
        AssetCriticalityStore.setAssetCriticality(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(saveData): Observable<any> {
    return this._http.post('/assets/'+AssetRegisterStore.assetId+'/criticalities', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_criticality_updated');

        this.getItem().subscribe();

        return res;
      })
    );
  }
}
