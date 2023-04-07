import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetReportDetailsPaginationResponse, AssetReportPaginationResponse } from 'src/app/core/models/asset-management/asset-report/asset-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssetReportStore } from 'src/app/stores/asset-management/asset-report/asset-report-store';

@Injectable({
  providedIn: 'root'
})
export class AssetReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    ) { }
  
  
      /**
     * @description
     * This method is used for getting Asset reports.
     *
     * @param {*} [param]
     * @returns this api will return a observalble
     * @memberof AssetReportDetailsService
     */
    getItems(getAll: boolean = false, riskCountObject: any, additionalParams): Observable<AssetReportPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AssetReportStore.currentPage}`;
        if (AssetReportStore.orderBy) params += `&order_by=${AssetReportStore.orderItem}&order=${AssetReportStore.orderBy}`;
  
      }
      if (additionalParams) params += additionalParams;
        return this._http.get<AssetReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
          map((res: AssetReportPaginationResponse) => {
            AssetReportStore.setAssetReportDetails(res);
            return res;
          })
        );
    }
  
  
    
     /**
     * @description
     * This method is used for getting asset report item details.
     *
     * @param {number} id
     * @returns this api will return a observable
     * @memberof AssetReportDetailsService
     */
    getAssetItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<AssetReportDetailsPaginationResponse> {
      let params = '';
      params = `&page=${AssetReportStore.currentPage}`;
      if(additionalParams) params += additionalParams;
        return this._http.get<AssetReportDetailsPaginationResponse>(`/assets?${riskCountListObject.assetItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: AssetReportDetailsPaginationResponse) => {
            AssetReportStore.setAssetReportsCountDetails(res);
            return res;
          })
        );
    }
  
     /**
     * @description
     * this method is used for export asset report item data
     *
     * @param {*} [data]
     * @returns this api will return a observalble
     * @memberof AssetReportDetailsService
     */
    exportToExcel(riskCountObject: any,additionalParams) {
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
     * this method is used for asset export data
     *
     * @param {*} [data]
     * @returns this api will return a observalble
     * @memberof AssetReportDetailsService
     */
    exportToExcelList(riskCountObject: any,additionalParams) {
      let params = '';
      params += additionalParams;
        this._http.get(`/assets/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
    }

    sortAssetReportList(type, text:string) {
      if (!AssetReportStore.orderBy) {
        AssetReportStore.orderBy = 'asc';
        AssetReportStore.orderItem = type;
      }
      else {
        if (AssetReportStore.orderItem == type) {
          if (AssetReportStore.orderBy == 'asc') AssetReportStore.orderBy = 'desc';
          else AssetReportStore.orderBy = 'asc'
        }
        else {
          AssetReportStore.orderBy = 'asc';
          AssetReportStore.orderItem = type;
        }
      }
    }
}
