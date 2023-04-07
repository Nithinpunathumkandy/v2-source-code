import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BCMReportDetailsPaginationResponse, BCMReportPaginationResponse } from 'src/app/core/models/bcm/bcm-report/bcm-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BCMReportStore } from 'src/app/stores/bcm/bcm-report/bcm-report-store';

@Injectable({
  providedIn: 'root'
})
export class BCMReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    ) { }
  
  
      /**
     * @description
     * This method is used for getting BCM reports.
     *
     * @param {*} [param]
     * @returns this api will return a observalble
     * @memberof BCMReportService
     */
    getItems(getAll: boolean = false,riskCountObject: any, additionalParams): Observable<BCMReportPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${BCMReportStore.currentPage}`;
        if (BCMReportStore.orderBy) params += `&order_by=${BCMReportStore.orderItem}&order=${BCMReportStore.orderBy}`;
  
      }
      if (additionalParams) params += additionalParams;
        return this._http.get<BCMReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
          map((res: BCMReportPaginationResponse) => {
            BCMReportStore.setBCMReportDetails(res);
            return res;
          })
        );
    }
  
  
    
     /**
     * @description
     * This method is used for getting bcm report item details.
     *
     * @param {number} id
     * @returns this api will return a observable
     * @memberof BCMReportService
     */
    getBCMItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<BCMReportDetailsPaginationResponse> {
      let params = '';
      params = `&page=${BCMReportStore.currentPage}`;
      if(additionalParams) params += additionalParams;
        return this._http.get<BCMReportDetailsPaginationResponse>(`/reports/bcm?${riskCountListObject.assetItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: BCMReportDetailsPaginationResponse) => {
            BCMReportStore.setBCMReportsCountDetails(res);
            return res;
          })
        );
    }
  
     /**
     * @description
     * this method is used for export bcm report item data
     *
     * @param {*} [data]
     * @returns this api will return a observalble
     * @memberof BCMReportService
     */
    exportToExcel(riskCountObject: any,additionalParams:any) {
      let params = '';
      params += additionalParams;
        this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        );
    }
  
     /**
     * @description
     * this method is used for bcm export data
     *
     * @param {*} [data]
     * @returns this api will return a observalble
     * @memberof BCMReportService
     */
    exportToExcelList(riskCountObject: any,additionalParams) {
      let params = '';
      params += additionalParams;
        this._http.get(`/bcm/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
    }

    sortBcmReport(type:string, text:string) {
      if (!BCMReportStore.orderBy) {
        BCMReportStore.orderBy = 'asc';
        BCMReportStore.orderItem = type;
      }
      else{
        if (BCMReportStore.orderItem == type) {
          if(BCMReportStore.orderBy == 'asc') BCMReportStore.orderBy = 'desc';
          else BCMReportStore.orderBy = 'asc'
        }
        else{
          BCMReportStore.orderBy = 'asc';
          BCMReportStore.orderItem = type;
        }
      }
    }
}
