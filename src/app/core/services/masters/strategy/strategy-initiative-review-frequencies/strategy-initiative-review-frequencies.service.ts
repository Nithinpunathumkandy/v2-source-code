import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

import { StrategyInitiativeReviewFrequency, StrategyInitiativeReviewFrequencyPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-initiative-review-frequencies';
import { StrategyInitiativeReviewFrequencyMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-review-frequencies-store';

@Injectable({
  providedIn: 'root'
})
export class StrategyInitiativeReviewFrequencyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Strategy Initiative Review Frequency List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof StrategyInitiativeReviewFrequencyService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StrategyInitiativeReviewFrequencyPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${StrategyInitiativeReviewFrequencyMasterStore.currentPage}`;
      if (StrategyInitiativeReviewFrequencyMasterStore.orderBy) params += `&order=${StrategyInitiativeReviewFrequencyMasterStore.orderBy}`;
      if (StrategyInitiativeReviewFrequencyMasterStore.orderItem) params += `&order_by=${StrategyInitiativeReviewFrequencyMasterStore.orderItem}`;
      if (StrategyInitiativeReviewFrequencyMasterStore.searchText) params += `&q=${StrategyInitiativeReviewFrequencyMasterStore.searchText}`;
      }
      if (StrategyInitiativeReviewFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=') + StrategyInitiativeReviewFrequencyMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<StrategyInitiativeReviewFrequencyPaginationResponse>('/strategy-review-frequencies' + (params ? params : '')).pipe(
        map((res: StrategyInitiativeReviewFrequencyPaginationResponse) => {
          StrategyInitiativeReviewFrequencyMasterStore.setStrategyInitiativeReviewFrequency(res);
          return res;
        })
      );
    }

   /**
   * @description
   * This method is used for getting All Strategy Initiative Review Frequency List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof StrategyInitiativeReviewFrequencyService
   */
    getAllItems(): Observable<StrategyInitiativeReviewFrequency[]> {
      return this._http.get<StrategyInitiativeReviewFrequency[]>('/strategy-review-frequencies').pipe((
        map((res:StrategyInitiativeReviewFrequency[])=>{
          StrategyInitiativeReviewFrequencyMasterStore.setAllStrategyInitiativeReviewFrequency(res);
          return res;
        })
      ))
    }

   /**
   * @description
   * This method is used for activate the Strategy Initiative Review Frequencys
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof StrategyInitiativeReviewFrequencyService
   */
    activate(id: number) {
      return this._http.put('/strategy-review-frequencies/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_initiative_review_frequencies_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
   /**
   * @description
   * This method is used for deactivate the Strategy Initiative Review Frequency
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof StrategyInitiativeReviewFrequencyService
   */
    deactivate(id: number) {
      return this._http.put('/strategy-review-frequencies/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_initiative_review_frequencies_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

   /**
   * @description
   * this method is used for export Strategy Initiative Review Frequency data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof StrategyInitiativeReviewFrequencyService
   */
    exportToExcel() {
      this._http.get('/strategy-review-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sstrategy_initiative_review_frequencies')
          +".xlsx");
        }
      )
    }



    sortStrategyInitiativeReviewFrequencyList(type:string, text:string) {
      if (!StrategyInitiativeReviewFrequencyMasterStore.orderBy) {
        StrategyInitiativeReviewFrequencyMasterStore.orderBy = 'asc';
        StrategyInitiativeReviewFrequencyMasterStore.orderItem = type;
      }
      else{
        if (StrategyInitiativeReviewFrequencyMasterStore.orderItem == type) {
          if(StrategyInitiativeReviewFrequencyMasterStore.orderBy == 'asc') StrategyInitiativeReviewFrequencyMasterStore.orderBy = 'desc';
          else StrategyInitiativeReviewFrequencyMasterStore.orderBy = 'asc'
        }
        else{
          StrategyInitiativeReviewFrequencyMasterStore.orderBy = 'asc';
          StrategyInitiativeReviewFrequencyMasterStore.orderItem = type;
        }
      }
    }
}
