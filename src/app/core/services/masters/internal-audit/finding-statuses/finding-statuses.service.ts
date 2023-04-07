import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FindingStatusesMasterStore } from 'src/app/stores/masters/internal-audit/finding-statuses';
import { FindingStatusesPaginationResponse } from 'src/app/core/models/masters/internal-audit/finding-statuses';

@Injectable({
  providedIn: 'root'
})
export class FindingStatusesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Finding Statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof FindingStatusesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<FindingStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${FindingStatusesMasterStore.currentPage}`;
      if (FindingStatusesMasterStore.orderBy) params += `&order=${FindingStatusesMasterStore.orderBy}`;
      if (FindingStatusesMasterStore.orderItem) params += `&order_by=${FindingStatusesMasterStore.orderItem}`;
      if (FindingStatusesMasterStore.searchText) params += `&q=${FindingStatusesMasterStore.searchText}`;
      }
      if (FindingStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + FindingStatusesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<FindingStatusesPaginationResponse>('/finding-statuses' + (params ? params : '')).pipe(
        map((res: FindingStatusesPaginationResponse) => {
          FindingStatusesMasterStore.setFindingStatuses(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Finding Statuses Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof FindingStatusesService
   */
    exportToExcel() {
      this._http.get('/finding-statuses', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding_statuses')
          +".xlsx");
        }
      )
    }



    sortFindingStatuses(type:string, text:string) {
      if (!FindingStatusesMasterStore.orderBy) {
        FindingStatusesMasterStore.orderBy = 'desc';
        FindingStatusesMasterStore.orderItem = type;
      }
      else{
        if (FindingStatusesMasterStore.orderItem == type) {
          if(FindingStatusesMasterStore.orderBy == 'desc') FindingStatusesMasterStore.orderBy = 'asc';
          else FindingStatusesMasterStore.orderBy = 'desc'
        }
        else{
          FindingStatusesMasterStore.orderBy = 'desc';
          FindingStatusesMasterStore.orderItem = type;
        }
      }
    }
}
