import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UnsafeActionStatusMasterStore } from 'src/app/stores/masters/jso/unsafe-action-status-store';
import { UnsafeActionStatus, UnsafeActionStatusPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-status';

@Injectable({
  providedIn: 'root'
})
export class UnsafeActionStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

  /**
   * @description
   * This method is used for getting Unsafe Status List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof UnsafeActionStatusService
   */
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<UnsafeActionStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${UnsafeActionStatusMasterStore.currentPage}`;
        if (UnsafeActionStatusMasterStore.orderBy) params += `&order_by=${UnsafeActionStatusMasterStore.orderItem}&order=${UnsafeActionStatusMasterStore.orderBy}`;
      }
      if(UnsafeActionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+UnsafeActionStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<UnsafeActionStatusPaginationResponse>('/unsafe-action-statuses' + (params ? params : '')).pipe(
        map((res: UnsafeActionStatusPaginationResponse) => {
          UnsafeActionStatusMasterStore.setUnsafeActionStatus(res);
          return res;
        })
      );
    }

   /**
   * @description
   * this method is used for get All Unsafe Status
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof UnsafeActionStatusService
   */
    getAllItems(): Observable<UnsafeActionStatus[]> {
      return this._http.get<UnsafeActionStatus[]>('/unsafe-action-statuses').pipe((
        map((res:UnsafeActionStatus[])=>{
          UnsafeActionStatusMasterStore.setAllUnsafeActionStatus(res);
          return res;
        })
      ))
    }

   /**
   * @description
   * this method is used for export Unsafe Status data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof UnsafeActionStatusService
   */
    exportToExcel() {
      this._http.get('/unsafe-action-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_statuses')+".xlsx");
        }
      )
    }

   /**
   * @description
   * this method is used for share Unsafe Status data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof UnsafeActionStatusService
   */
    shareData(data){
      return this._http.post('/unsafe-action-statuses/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','share_success');
          return res;
        })
      )
    }

    sortUnsafeActionStatusList(type:string, text:string) {
      if (!UnsafeActionStatusMasterStore.orderBy) {
        UnsafeActionStatusMasterStore.orderBy = 'asc';
        UnsafeActionStatusMasterStore.orderItem = type;
      }
      else{
        if (UnsafeActionStatusMasterStore.orderItem == type) {
          if(UnsafeActionStatusMasterStore.orderBy == 'asc') UnsafeActionStatusMasterStore.orderBy = 'desc';
          else UnsafeActionStatusMasterStore.orderBy = 'asc'
        }
        else{
          UnsafeActionStatusMasterStore.orderBy = 'asc';
          UnsafeActionStatusMasterStore.orderItem = type;
        }
      }
    }
}
