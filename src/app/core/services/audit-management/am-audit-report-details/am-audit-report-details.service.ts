import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditReportDetailsPaginationResponse, AmAuditReportPaginationResponse } from 'src/app/core/models/audit-management/am-audit-reports/am-audit-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditReportStore } from 'src/app/stores/audit-management/am-audit-report/am-audit-report-store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditReportDetailsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

    /**
     * @description
     * This method is used for getting Am Audit reports.
     *
     * @param {*} [param]
     * @returns this api will return a observalble
     * @memberof AssetReportDetailsService
     */
     getItems(getAll: boolean = false, riskCountObject: any, additionalParams): Observable<AmAuditReportPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AmAuditReportStore.currentPage}`;
        if (AmAuditReportStore.orderBy) params += `&order_by=${AmAuditReportStore.orderItem}&order=${AmAuditReportStore.orderBy}`;
  
      }
      if (additionalParams) params += additionalParams;
        return this._http.get<AmAuditReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
          map((res: AmAuditReportPaginationResponse) => {
            AmAuditReportStore.setAmAuditReportDetails(res);
            return res;
          })
        );
    }
  
  
    
     /**
     * @description
     * This method is used for getting am audit report item details.
     *
     * @param {number} id
     * @returns this api will return a observable
     * @memberof AssetReportDetailsService
     */
    getAmAuditItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<AmAuditReportDetailsPaginationResponse> {
      // let params = '';
      // params = `&page=${AmAuditReportStore.currentPage}`;
      // if(additionalParams) params += additionalParams;
      //   return this._http.get<AmAuditReportDetailsPaginationResponse>(`/reports?${riskCountListObject.amAuditItemId}=${id}${(params ? params : '')}`).pipe(
      //     map((res: AmAuditReportDetailsPaginationResponse) => {
      //       AmAuditReportStore.setAmAuditReportsCountDetails(res);
      //       return res;
      //     })
      //   );
      let params = '';
      params = `&page=${AmAuditReportStore.currentPage}`;
      if (additionalParams) params += additionalParams;
      if (riskCountListObject.reportType === "am_annual_plans") {
        return this._http.get<AmAuditReportDetailsPaginationResponse>(`/reports/am-annual-audit-plans?${riskCountListObject.amAuditItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: AmAuditReportDetailsPaginationResponse) => {
            AmAuditReportStore.setAmAuditReportsCountDetails(res);
            return res;
          })
        );
      }
      else if (riskCountListObject.reportType === "am_audits") {
        return this._http.get<AmAuditReportDetailsPaginationResponse>(`/reports/am-audits?${riskCountListObject.amAuditItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: AmAuditReportDetailsPaginationResponse) => {
            AmAuditReportStore.setAmAuditReportsCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.reportType === "am_audit_findings") {
        return this._http.get<AmAuditReportDetailsPaginationResponse>(`/reports/am-audit-findings?${riskCountListObject.amAuditItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: AmAuditReportDetailsPaginationResponse) => {
            AmAuditReportStore.setAmAuditReportsCountDetails(res);
            return res;
          })
        );
      }
    }
  
     /**
     * @description
     * this method is used for export am audit report item data
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
     * this method is used for am audit export data
     *
     * @param {*} [data]
     * @returns this api will return a observalble
     * @memberof AssetReportDetailsService
     */
    exportToExcelList(riskCountObject: any,additionalParams) {
      let params = '';
      params += additionalParams;
      let url='';
      if(riskCountObject.reportType=='am_annual_plans')
      url='am-annual-plans';
      else if(riskCountObject.reportType=='am_audits')
      url='am-audits';
      else
      url='am-audit-findings'
        this._http.get(`/${url}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
    }

    sortAmAuditReportList(type, text:string) {
      if (!AmAuditReportStore.orderBy) {
        AmAuditReportStore.orderBy = 'asc';
        AmAuditReportStore.orderItem = type;
      }
      else {
        if (AmAuditReportStore.orderItem == type) {
          if (AmAuditReportStore.orderBy == 'asc') AmAuditReportStore.orderBy = 'desc';
          else AmAuditReportStore.orderBy = 'asc'
        }
        else {
          AmAuditReportStore.orderBy = 'asc';
          AmAuditReportStore.orderItem = type;
        }
      }
    }
}
