import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetRatings, AssetRatingsPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-ratings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetRatingsMasterStore } from 'src/app/stores/masters/asset-management/asset-ratings-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AssetRatingsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AssetRatingsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AssetRatingsMasterStore.currentPage}`;
      if (AssetRatingsMasterStore.orderBy) params += `&order_by=${AssetRatingsMasterStore.orderItem}&order=${AssetRatingsMasterStore.orderBy}`;
    }
    if(AssetRatingsMasterStore.searchText) params += (params ? '&q=' : '?q=')+AssetRatingsMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AssetRatingsPaginationResponse>('/asset-ratings' + (params ? params : '')).pipe(
      map((res: AssetRatingsPaginationResponse) => {
        AssetRatingsMasterStore.setAssetRatings(res);
        return res;
      })
    );
  }


  exportToExcel() {
    this._http.get('/asset-ratings/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_ratings')+".xlsx");
      }
    )
  }


  searchAssetRatings(params){
    return this.getItems(params ? params : '').pipe(
      map((res: AssetRatingsPaginationResponse) => {
        AssetRatingsMasterStore.setAssetRatings(res);
        return res;
      })
    );
  }

  sortAssetRatingsList(type:string, text:string) {
    if (!AssetRatingsMasterStore.orderBy) {
        AssetRatingsMasterStore.orderBy = 'asc';
        AssetRatingsMasterStore.orderItem = type;
    }
    else{
      if (AssetRatingsMasterStore.orderItem == type) {
        if(AssetRatingsMasterStore.orderBy == 'asc') AssetRatingsMasterStore.orderBy = 'desc';
        else AssetRatingsMasterStore.orderBy = 'asc'
      }
      else{
        AssetRatingsMasterStore.orderBy = 'asc';
        AssetRatingsMasterStore.orderItem = type;
      }
    }
   
  }
}
