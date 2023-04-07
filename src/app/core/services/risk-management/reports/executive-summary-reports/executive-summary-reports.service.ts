import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { ExecutiveReportsPaginationResponse, executiveSummaryReportDetail, IndividualExecutiveDetail } from 'src/app/core/models/risk-management/reports/executive-summary-report';
import { ExecutiveReportStore } from 'src/app/stores/risk-management/reports/executive-summary/executive-summary-store';
@Injectable({
  providedIn: 'root'
})
export class ExecutiveSummaryReportsService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService) { }


   /**
   * @description
   * This method is used for getting Executive Summary reports.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  getItems(getAll: boolean = false, additionalParams?: string): Observable<ExecutiveReportsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ExecutiveReportStore.currentPage}`;
      if (ExecutiveReportStore.orderBy) params += `&order=${ExecutiveReportStore.orderBy}`;
      if (ExecutiveReportStore.orderItem) params += `&order_by=${ExecutiveReportStore.orderItem}`;
    }
    if(additionalParams) params += additionalParams;
    if (ExecutiveReportStore.searchText) params += (params ? '&q=' : '?q=') + ExecutiveReportStore.searchText;
    return this._http.get<ExecutiveReportsPaginationResponse>('/executive-summary-reports' + (params ? params : '')).pipe(
      map((res: ExecutiveReportsPaginationResponse) => {
        ExecutiveReportStore.setExecutiveSummaryReport(res);
        return res;
      })
    );
  }

   /**
   * @description
   * This method is used for getting All item Executive Summary reports.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  getItem(id): Observable<IndividualExecutiveDetail> {
    return this._http.get<IndividualExecutiveDetail>('/executive-summary-reports/' + id).pipe(
      map((res: IndividualExecutiveDetail) => {
        ExecutiveReportStore.setIndividulaExecutiveSummaryReport(res)
        return res;
      })
    );
  }


   /**
   * @description
   * this method is used for creating Executive Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  saveItem(value) {
    return this._http.post('/executive-summary-reports', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'executive _summary_reports_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating Executive Summary reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
   updateItem(id: number, item: IndividualExecutiveDetail):Observable<any>{
    return this._http.put(`/executive-summary-reports/${id}`, item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','updated_executive_summary_reports');
      return res;
    }))
  }
   /**
   * @description
   * this method is used for deleting Executive Summary reports
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  deleteItem(id:number){
    return this._http.delete(`/executive-summary-reports/${id}`).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','executive_item_deleted');
      this.getItems(false, null).subscribe();
      return res;
    }))
  }

   /**
   * @description
   * this method is used for creating Executive item Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  saveExecutiveItem(id: number, value){
    return this._http.post(`/executive-summary-reports/${id}/details`,value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'executive _summary_reports_added');
        return res;
      })
    )
  }

   /**
   * @description
   * this method is used for updating Executive item Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  updateExecutiveItem(id: number,executiveId: number, item: executiveSummaryReportDetail):Observable<any>{
    return this._http.put(`/executive-summary-reports/${id}/details/${executiveId}`, item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','updated_executive_summary_reports');
      return res;
    }))
  }

   /**
   * @description
   * this method is used for deleting Executive item Summary reports
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
  deleteExecutiveItem(id:number, executiveId: number){
    return this._http.delete(`/executive-summary-reports/${id}/details/${executiveId}`).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','executive_item_deleted');
      this.getItem(id).subscribe();
      return res;
    }))
  }

   /**
   * @description
   * this method is used for Executive Report export data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ExecutiveSummaryReportsService
   */
      exportToPdf(id: number) {
        this._http.get(`/executive-summary-reports/${id}/export`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('executive-summary-reports')
            +".pdf");
          }
        )
      }


  sortExecutiveReportList(type, callList: boolean = true) {
    if (!ExecutiveReportStore.orderBy) {
      ExecutiveReportStore.orderBy = 'asc';
      ExecutiveReportStore.orderItem = type;
    }
    else {
      if (ExecutiveReportStore.orderItem == type) {
        if (ExecutiveReportStore.orderBy == 'asc') ExecutiveReportStore.orderBy = 'desc';
        else ExecutiveReportStore.orderBy = 'asc'
      }
      else {
        ExecutiveReportStore.orderBy = 'asc';
        ExecutiveReportStore.orderItem = type;
      }
    }
  }

}
