import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyKpiDataTypesMasterStore } from 'src/app/stores/masters/strategy/strategy-kpi-data-types-store';
import { StrategyKpiDataTypes, StrategyKpiDataTypesPaginationResponse } from 'src/app/core/models/masters/strategy/strategy_kpi_data_types';

@Injectable({
  providedIn: 'root'
})
export class StrategyKpiDataTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting  strategy kpi data types List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof StrategyKpiDataTypesService
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StrategyKpiDataTypesPaginationResponse> {
		let params = '';
		if (!getAll) {
		params = `?page=${StrategyKpiDataTypesMasterStore.currentPage}`;
		if (StrategyKpiDataTypesMasterStore.orderBy) params += `&order=${StrategyKpiDataTypesMasterStore.orderBy}`;
		if (StrategyKpiDataTypesMasterStore.orderItem) params += `&order_by=${StrategyKpiDataTypesMasterStore.orderItem}`;
		if (StrategyKpiDataTypesMasterStore.searchText) params += `&q=${StrategyKpiDataTypesMasterStore.searchText}`;
		}
		if (StrategyKpiDataTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + StrategyKpiDataTypesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<StrategyKpiDataTypesPaginationResponse>('/strategy-kpi-data-types' + (params ? params : '')).pipe(
			map((res: StrategyKpiDataTypesPaginationResponse) => {
				StrategyKpiDataTypesMasterStore.setStrategyKpiDataTypes(res);
				return res;
			})
		);
	}

   /**
   * @description
   * This method is used for getting strategy kpi data types.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof StrategyKpiDataTypesService
   */
    getAllItems(): Observable<StrategyKpiDataTypes[]> {
      return this._http.get<StrategyKpiDataTypes[]>('/strategy-kpi-data-types').pipe((
        map((res:StrategyKpiDataTypes[])=>{
          StrategyKpiDataTypesMasterStore.setAllStrategyKpiDataTypes(res);
          return res;
        })
      ))
    }


   /**
   * @description
   * this method is used for export strategy kpi data types data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof StrategyKpiDataTypesService
   */
    exportToExcel() {
      this._http.get('/strategy-kpi-data-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_kpi_data_types')+".xlsx");
        }
      )
    }


    sortKpiTypesList(type:string, text:string) {
      if (!StrategyKpiDataTypesMasterStore.orderBy) {
        StrategyKpiDataTypesMasterStore.orderBy = 'asc';
        StrategyKpiDataTypesMasterStore.orderItem = type;
      }
      else{
        if (StrategyKpiDataTypesMasterStore.orderItem == type) {
          if(StrategyKpiDataTypesMasterStore.orderBy == 'asc') StrategyKpiDataTypesMasterStore.orderBy = 'desc';
          else StrategyKpiDataTypesMasterStore.orderBy = 'asc'
        }
        else{
          StrategyKpiDataTypesMasterStore.orderBy = 'asc';
          StrategyKpiDataTypesMasterStore.orderItem = type;
        }
      }
    }
}
