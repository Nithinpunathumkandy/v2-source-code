import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NonComformityReportDetailsPaginationResponse, NonComformityReportPaginationResponse } from 'src/app/core/models/non-conformity/non-conformity-report/non-conformity-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NonComformityReportStore } from 'src/app/stores/non-conformity/non-conformity-report/non-conformity-report-store';

@Injectable({
  providedIn: 'root'
})
export class NonComformityReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    ) { }
  
  
      /**
     * @description
     * This method is used for getting non comformity reports.
     *
     * @param {*} [param]
     * @returns this api will return a observalble
     * @memberof NonComformityReportService
     */
       getItems(riskCountObject: any, additionalParams): Observable<NonComformityReportPaginationResponse> {
        let params = '';
        if (additionalParams) params += additionalParams;
          return this._http.get<NonComformityReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
            map((res: NonComformityReportPaginationResponse) => {
              NonComformityReportStore.setNonComformityReportDetails(res);
              return res;
            })
          );
      }
  
  /**
   * @description
   * This method is used for getting Non Comformity report item details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof NonComformityReportDetailsService
   */
	getNonComformityItemsDetails(id: string, nonConformityCountListObject: any, additionalParams: string): Observable<NonComformityReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${NonComformityReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
    if (nonConformityCountListObject.reportUniqueKey === "finding")
			return this._http.get<NonComformityReportDetailsPaginationResponse>(`/reports/noc-findings?${nonConformityCountListObject.nonComformityItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: NonComformityReportDetailsPaginationResponse) => {
					NonComformityReportStore.setNonComformityReportsCountDetails(res);
					return res;
				})
			);
      else
      return this._http.get<NonComformityReportDetailsPaginationResponse>(`/reports/noc-finding-corrective-actions?${nonConformityCountListObject.nonComformityItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: NonComformityReportDetailsPaginationResponse) => {
					NonComformityReportStore.setNonComformityReportsCountDetails(res);
					return res;
				})
			);
	}
    
     
  
     /**
     * @description
     * this method is used for export non conformity report item data
     *
     * @param {*} [data]
     * @returns this api will return a observalble
     * @memberof NonComformityReportService
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
   * this method is used for Non Comformity export data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof NonComformityReportService
   */
	exportToExcelList(nonConformityCountListObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
    if (nonConformityCountListObject.reportUniqueKey === "finding")
			this._http.get(`/noc-findings/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(nonConformityCountListObject.title)+'.xlsx');
				}
			)
      else
      this._http.get(`/noc-finding-corrective-actions/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(nonConformityCountListObject.title)+'.xlsx');
				}
			)
	}  
    
    
}
