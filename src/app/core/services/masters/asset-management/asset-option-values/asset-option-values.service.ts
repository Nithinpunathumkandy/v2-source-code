import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetOptionValues, AssetOptionValuesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-option-values';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetOptionValuesMasterStore } from 'src/app/stores/masters/asset-management/asset-option-values-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetOptionValuesService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AssetOptionValuesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetOptionValuesMasterStore.currentPage}`;
      if (AssetOptionValuesMasterStore.orderBy) params += `&order_by=${AssetOptionValuesMasterStore.orderItem}&order=${AssetOptionValuesMasterStore.orderBy}`;
    }
    if(AssetOptionValuesMasterStore.searchText) params += (params ? '&q=' : '?q=')+AssetOptionValuesMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AssetOptionValuesPaginationResponse>('/asset-option-values' + (params ? params : '')).pipe(
      map((res: AssetOptionValuesPaginationResponse) => {
        AssetOptionValuesMasterStore.setAssetOptionValues(res);
        return res;
      })
    );
  }


  exportToExcel() {
    this._http.get('/asset-option-values/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_option_values')+".xlsx");
      }
    )
  }

  searchAssetOptionValues(params){
    return this.getItems(params ? params : '').pipe(
      map((res: AssetOptionValuesPaginationResponse) => {
        AssetOptionValuesMasterStore.setAssetOptionValues(res);
        return res;
      })
    );
  }

  sortAssetOptionValuesList(type:string, text:string) {
    if (!AssetOptionValuesMasterStore.orderBy) {
        AssetOptionValuesMasterStore.orderBy = 'asc';
        AssetOptionValuesMasterStore.orderItem = type;
    }
    else{
      if (AssetOptionValuesMasterStore.orderItem == type) {
        if(AssetOptionValuesMasterStore.orderBy == 'asc') AssetOptionValuesMasterStore.orderBy = 'desc';
        else AssetOptionValuesMasterStore.orderBy = 'asc'
      }
      else{
        AssetOptionValuesMasterStore.orderBy = 'asc';
        AssetOptionValuesMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
