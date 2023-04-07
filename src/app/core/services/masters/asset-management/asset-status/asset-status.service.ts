import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetStatusPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetStatusStore } from 'src/app/stores/masters/asset-management/asset-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AssetStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetStatusStore.currentPage}`;
      if (AssetStatusStore.orderBy) params += `&order_by=${AssetStatusStore.orderItem}&order=${AssetStatusStore.orderBy}`;
    }
    if(AssetStatusStore.searchText) params += (params ? '&q=' : '?q=')+AssetStatusStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AssetStatusPaginationResponse>('/asset-statuses' + (params ? params : '')).pipe(
      map((res: AssetStatusPaginationResponse) => {
        AssetStatusStore.setAssetStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/asset-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_status')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/asset-statuses/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/asset-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_status_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/asset-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'asset_status_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortAssetStatusList(type:string, text:string) {
    if (!AssetStatusStore.orderBy) {
      AssetStatusStore.orderBy = 'asc';
      AssetStatusStore.orderItem = type;
    }
    else{
      if (AssetStatusStore.orderItem == type) {
        if(AssetStatusStore.orderBy == 'asc') AssetStatusStore.orderBy = 'desc';
        else AssetStatusStore.orderBy = 'asc'
      }
      else{
        AssetStatusStore.orderBy = 'asc';
        AssetStatusStore.orderItem = type;
      }
    }
  }
}
