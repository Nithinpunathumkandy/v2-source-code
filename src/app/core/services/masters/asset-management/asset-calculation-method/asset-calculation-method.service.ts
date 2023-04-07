import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetCalculationMethodMasterStore } from 'src/app/stores/masters/asset-management/asset-calculation-method';
import { AssetCalculationMethod, AssetCalculationMethodPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-calculation-method';

@Injectable({
  providedIn: 'root'
})
export class AssetCalculationMethodService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Asset Calculation Method List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetCalculationMethodService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetCalculationMethodPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${AssetCalculationMethodMasterStore.currentPage}`;
      if (AssetCalculationMethodMasterStore.orderBy) params += `&order=${AssetCalculationMethodMasterStore.orderBy}`;
      if (AssetCalculationMethodMasterStore.orderItem) params += `&order_by=${AssetCalculationMethodMasterStore.orderItem}`;
      if (AssetCalculationMethodMasterStore.searchText) params += `&q=${AssetCalculationMethodMasterStore.searchText}`;
      }
      if (AssetCalculationMethodMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetCalculationMethodMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AssetCalculationMethodPaginationResponse>('/asset-calculation-methods' + (params ? params : '')).pipe(
        map((res: AssetCalculationMethodPaginationResponse) => {
          AssetCalculationMethodMasterStore.setAssetCalculationMethod(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Asset Calculation Method Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof AssetCalculationMethodService
   */
    exportToExcel() {
      this._http.get('/asset-calculation-methods/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('asset_calculation_method')
          +".xlsx");
        }
      )
    }



    sortAssetCalculationMethodList(type:string, text:string) {
      if (!AssetCalculationMethodMasterStore.orderBy) {
        AssetCalculationMethodMasterStore.orderBy = 'asc';
        AssetCalculationMethodMasterStore.orderItem = type;
      }
      else{
        if (AssetCalculationMethodMasterStore.orderItem == type) {
          if(AssetCalculationMethodMasterStore.orderBy == 'asc') AssetCalculationMethodMasterStore.orderBy = 'desc';
          else AssetCalculationMethodMasterStore.orderBy = 'asc'
        }
        else{
          AssetCalculationMethodMasterStore.orderBy = 'asc';
          AssetCalculationMethodMasterStore.orderItem = type;
        }
      }
    }
}
