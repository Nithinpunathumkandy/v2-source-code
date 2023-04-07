import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FindingCorrectiveActionStatusesMasterStore } from 'src/app/stores/masters/internal-audit/finding-corrective-action-statuses.store';
import { FindingCorrectiveActionStatusesPaginationResponse } from 'src/app/core/models/masters/internal-audit/finding-corrective-action-statuses';

@Injectable({
  providedIn: 'root'
})
export class FindingCorrectiveActionStatusesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Finding Corrective Action Statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof FindingCorrectiveActionStatusesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<FindingCorrectiveActionStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${FindingCorrectiveActionStatusesMasterStore.currentPage}`;
      if (FindingCorrectiveActionStatusesMasterStore.orderBy) params += `&order=${FindingCorrectiveActionStatusesMasterStore.orderBy}`;
      if (FindingCorrectiveActionStatusesMasterStore.orderItem) params += `&order_by=${FindingCorrectiveActionStatusesMasterStore.orderItem}`;
      if (FindingCorrectiveActionStatusesMasterStore.searchText) params += `&q=${FindingCorrectiveActionStatusesMasterStore.searchText}`;
      }
      if (FindingCorrectiveActionStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + FindingCorrectiveActionStatusesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<FindingCorrectiveActionStatusesPaginationResponse>('/finding-corrective-action-statuses' + (params ? params : '')).pipe(
        map((res: FindingCorrectiveActionStatusesPaginationResponse) => {
          FindingCorrectiveActionStatusesMasterStore.setFindingCorrectiveActionStatuses(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Finding Corrective Action Statuses Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof FindingCorrectiveActionStatusesService
   */
    exportToExcel() {
      this._http.get('/finding-corrective-action-statuses', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding_corrective_action_statuses')
          +".xlsx");
        }
      )
    }



    sortFindingCorrectiveActionStatuses(type:string, text:string) {
      if (!FindingCorrectiveActionStatusesMasterStore.orderBy) {
        FindingCorrectiveActionStatusesMasterStore.orderBy = 'desc';
        FindingCorrectiveActionStatusesMasterStore.orderItem = type;
      }
      else{
        if (FindingCorrectiveActionStatusesMasterStore.orderItem == type) {
          if(FindingCorrectiveActionStatusesMasterStore.orderBy == 'desc') FindingCorrectiveActionStatusesMasterStore.orderBy = 'asc';
          else FindingCorrectiveActionStatusesMasterStore.orderBy = 'desc'
        }
        else{
          FindingCorrectiveActionStatusesMasterStore.orderBy = 'desc';
          FindingCorrectiveActionStatusesMasterStore.orderItem = type;
        }
      }
    }
}
