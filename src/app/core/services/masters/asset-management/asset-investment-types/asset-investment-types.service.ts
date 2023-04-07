import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AssetInvestmentTypes, AssetInvestmentTypesPaginationResponse } from 'src/app/core/models/masters/asset-management/asset-investment-types';
import { AssetInvestmentTypesMasterStore } from 'src/app/stores/masters/asset-management/asset-investment-types-store';

@Injectable({
  providedIn: 'root'
})
export class AssetInvestmentTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }


   /**
   * @description
   * This method is used for getting asset investment types List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetInvestmentTypes
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AssetInvestmentTypesPaginationResponse> {
		let params = '';
		if (!getAll) {
		params = `?page=${AssetInvestmentTypesMasterStore.currentPage}`;
		if (AssetInvestmentTypesMasterStore.orderBy) params += `&order=${AssetInvestmentTypesMasterStore.orderBy}`;
		if (AssetInvestmentTypesMasterStore.orderItem) params += `&order_by=${AssetInvestmentTypesMasterStore.orderItem}`;
		if (AssetInvestmentTypesMasterStore.searchText) params += `&q=${AssetInvestmentTypesMasterStore.searchText}`;
		}
		if (AssetInvestmentTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AssetInvestmentTypesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<AssetInvestmentTypesPaginationResponse>('/asset-investment-types' + (params ? params : '')).pipe(
			map((res: AssetInvestmentTypesPaginationResponse) => {
				AssetInvestmentTypesMasterStore.setAssetInvestmentTypes(res);
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for getting asset investment types List.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AssetInvestmentTypes
   */
    getAllItems(): Observable<AssetInvestmentTypes[]> {
      return this._http.get<AssetInvestmentTypes[]>('/asset-investment-types').pipe((
        map((res:AssetInvestmentTypes[])=>{
          AssetInvestmentTypesMasterStore.setAllAssetInvestmentTypes(res);
          return res;
        })
      ))
    }


    sortAssetInvestmentTypesList(type:string, text:string) {
      if (!AssetInvestmentTypesMasterStore.orderBy) {
        AssetInvestmentTypesMasterStore.orderBy = 'asc';
        AssetInvestmentTypesMasterStore.orderItem = type;
      }
      else{
        if (AssetInvestmentTypesMasterStore.orderItem == type) {
          if(AssetInvestmentTypesMasterStore.orderBy == 'asc') AssetInvestmentTypesMasterStore.orderBy = 'desc';
          else AssetInvestmentTypesMasterStore.orderBy = 'asc'
        }
        else{
          AssetInvestmentTypesMasterStore.orderBy = 'asc';
          AssetInvestmentTypesMasterStore.orderItem = type;
        }
      }
    }
}
