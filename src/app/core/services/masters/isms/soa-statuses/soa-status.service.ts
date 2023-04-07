import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SoaStatusPaginationResponse } from 'src/app/core/models/masters/isms/soa_statuses';
import { SoaStatusMasterStore } from 'src/app/stores/masters/isms/soa-statuses-store';

@Injectable({
  providedIn: 'root'
})
export class SoaStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting soa status List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof SoaStatusService
   */
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<SoaStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${SoaStatusMasterStore.currentPage}`;
        if (SoaStatusMasterStore.orderBy) params += `&order_by=${SoaStatusMasterStore.orderItem}&order=${SoaStatusMasterStore.orderBy}`;
      }
      if(SoaStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+SoaStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<SoaStatusPaginationResponse>('/soa-statuses' + (params ? params : '')).pipe(
        map((res: SoaStatusPaginationResponse) => {
          SoaStatusMasterStore.setSoaStatus(res);
          return res;
        })
      );
    }


   /**
   * @description
   * This method is used for activate the soa status
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof SoaStatusService
   */
    activate(id: number) {
      return this._http.put('/soa-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'soa_statuses_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
   /**
   * @description
   * This method is used for deactivate the soa status
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof SoaStatusService
   */
    deactivate(id: number) {
      return this._http.put('/soa-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'soa_statuses_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

   /**
   * @description
   * this method is used for export soa status data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof SoaStatusService
   */
    exportToExcel() {
      this._http.get('/soa-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('soa_statuses')+".xlsx");
        }
      )
    }


    sortSoaStatusList(type:string, text:string) {
      if (!SoaStatusMasterStore.orderBy) {
        SoaStatusMasterStore.orderBy = 'asc';
        SoaStatusMasterStore.orderItem = type;
      }
      else{
        if (SoaStatusMasterStore.orderItem == type) {
          if(SoaStatusMasterStore.orderBy == 'asc') SoaStatusMasterStore.orderBy = 'desc';
          else SoaStatusMasterStore.orderBy = 'asc'
        }
        else{
          SoaStatusMasterStore.orderBy = 'asc';
          SoaStatusMasterStore.orderItem = type;
        }
      }
    }
}
