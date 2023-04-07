import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AggregationTypesPaginationResponse } from 'src/app/core/models/masters/strategy/aggregation-types';
import { AggregationTypesMasterStore } from 'src/app/stores/masters/strategy/aggregation-types.store';

@Injectable({
  providedIn: 'root'
})
export class AggregationTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Aggregation types List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AggregationTypesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AggregationTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${AggregationTypesMasterStore.currentPage}`;
      if (AggregationTypesMasterStore.orderBy) params += `&order=${AggregationTypesMasterStore.orderBy}`;
      if (AggregationTypesMasterStore.orderItem) params += `&order_by=${AggregationTypesMasterStore.orderItem}`;
      if (AggregationTypesMasterStore.searchText) params += `&q=${AggregationTypesMasterStore.searchText}`;
      }
      if (AggregationTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AggregationTypesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AggregationTypesPaginationResponse>('/aggregation-types' + (params ? params : '')).pipe(
        map((res: AggregationTypesPaginationResponse) => {
          AggregationTypesMasterStore.setAggregationTypes(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Aggregation types Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof AggregationTypesService
   */
    exportToExcel() {
      this._http.get('/aggregation-types', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('aggregation-types')
          +".xlsx");
        }
      )
    }



    sortAggregationTypesList(type:string, text:string) {
      if (!AggregationTypesMasterStore.orderBy) {
        AggregationTypesMasterStore.orderBy = 'asc';
        AggregationTypesMasterStore.orderItem = type;
      }
      else{
        if (AggregationTypesMasterStore.orderItem == type) {
          if(AggregationTypesMasterStore.orderBy == 'asc') AggregationTypesMasterStore.orderBy = 'desc';
          else AggregationTypesMasterStore.orderBy = 'asc'
        }
        else{
          AggregationTypesMasterStore.orderBy = 'asc';
          AggregationTypesMasterStore.orderItem = type;
        }
      }
    }
}
