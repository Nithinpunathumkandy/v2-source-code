import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaScaleCategoryPaginationResponse } from 'src/app/core/models/masters/bcm/bia-scale-category';
import { ProcessOperationFrequency, ProcessOperationFrequencyPaginationResponse } from 'src/app/core/models/masters/bcm/process-operation-frequency';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaScaleCategoryMasterStore } from 'src/app/stores/masters/bcm/bia-scale-category.master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class BiaScaleCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting Bia Scale Category List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof BiaScaleCategoryService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BiaScaleCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
		params = `?page=${BiaScaleCategoryMasterStore.currentPage}`;
		if (BiaScaleCategoryMasterStore.orderBy) params += `&order=${BiaScaleCategoryMasterStore.orderBy}`;
		if (BiaScaleCategoryMasterStore.orderItem) params += `&order_by=${BiaScaleCategoryMasterStore.orderItem}`;
		if (BiaScaleCategoryMasterStore.searchText) params += `&q=${BiaScaleCategoryMasterStore.searchText}`;
		}
		if (BiaScaleCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + BiaScaleCategoryMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<ProcessOperationFrequencyPaginationResponse>('/bia-scale-categories' + (params ? params : '')).pipe(
			map((res: ProcessOperationFrequencyPaginationResponse) => {
				BiaScaleCategoryMasterStore.setBiaScaleCategory(res);
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for getting item Bia Scale Category
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof BiaScaleCategoryService
   */
  getItem(id: number): Observable<ProcessOperationFrequency> {
		return this._http.get<ProcessOperationFrequency>('/bia-scale-categories/' + id).pipe(
			map((res: ProcessOperationFrequency) => {
				BiaScaleCategoryMasterStore.updateBiaScaleCategory(res)
				return res;
			})
		);
	}

  
	sortBiaScaleCategoryList(type: string, text: string) {
		if (!BiaScaleCategoryMasterStore.orderBy) {
			BiaScaleCategoryMasterStore.orderBy = 'asc';
			BiaScaleCategoryMasterStore.orderItem = type;
		}
		else {
			if (BiaScaleCategoryMasterStore.orderItem == type) {
				if (BiaScaleCategoryMasterStore.orderBy == 'asc') BiaScaleCategoryMasterStore.orderBy = 'desc';
				else BiaScaleCategoryMasterStore.orderBy = 'asc'
			}
			else {
				BiaScaleCategoryMasterStore.orderBy = 'asc';
				BiaScaleCategoryMasterStore.orderItem = type;
			}
		}
	}
}
