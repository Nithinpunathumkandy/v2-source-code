import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { IndividualQuickRiskDetail, QuickRiskReportDetail, QuickRiskReportsPaginationResponse } from 'src/app/core/models/risk-management/reports/quick-risk-assesment-report';
import { QuickRiskAssessmentReportStore } from 'src/app/stores/risk-management/reports/quick-risk-assessment-report/quick-risk-assessment-report-store';
@Injectable({
  providedIn: 'root'
})
export class QuickRiskAssessmentReportsService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService) { }


   /**
   * @description
   * This method is used for getting Quick Risk Summary reports.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  getItems(getAll: boolean = false, additionalParams?: string): Observable<QuickRiskReportsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${QuickRiskAssessmentReportStore.currentPage}`;
      if (QuickRiskAssessmentReportStore.orderBy) params += `&order=${QuickRiskAssessmentReportStore.orderBy}`;
      if (QuickRiskAssessmentReportStore.orderItem) params += `&order_by=${QuickRiskAssessmentReportStore.orderItem}`;
    }
    if(additionalParams) params += additionalParams;
    if (QuickRiskAssessmentReportStore.searchText) params += (params ? '&q=' : '?q=') + QuickRiskAssessmentReportStore.searchText;
    return this._http.get<QuickRiskReportsPaginationResponse>('/quick-risk-assessment-reports' + (params ? params : '')).pipe(
      map((res: QuickRiskReportsPaginationResponse) => {
        QuickRiskAssessmentReportStore.setQuickRiskReport(res);
        return res;
      })
    );
  }

   /**
   * @description
   * This method is used for getting All item Quick Risk Summary reports.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  getItem(id): Observable<IndividualQuickRiskDetail> {
    return this._http.get<IndividualQuickRiskDetail>('/quick-risk-assessment-reports/' + id).pipe(
      map((res: IndividualQuickRiskDetail) => {
        QuickRiskAssessmentReportStore.setIndividualQuickAssessmentReport(res)
        return res;
      })
    );
  }


   /**
   * @description
   * this method is used for creating Quick Risk Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  saveItem(value) {
    return this._http.post('/quick-risk-assessment-reports', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'quick_risk_assessment_reports_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

    /**
   * @description
   * this method is used for updating Quick Risk Summary reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
     updateItem(id: number, item: IndividualQuickRiskDetail):Observable<any>{
      return this._http.put(`/quick-risk-assessment-reports/${id}`, item).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success','updated_quick_risk_reports');
        return res;
      }))
    }

    /**
   * @description
   * this method is used for deleting Quick Risk Summary reports
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  deleteItem(id:number){
    return this._http.delete(`/quick-risk-assessment-reports/${id}`).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','quick_risk_item_deleted');
      this.getItems(false, null).subscribe();
      return res;
    }))
  }

   /**
   * @description
   * this method is used for creating Quick Risk item Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  saveQuickRisktem(id: number, value){
    return this._http.post(`/quick-risk-assessment-reports/${id}/details`,value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'new_quick_risk_reports_item_added');
        return res;
      })
    )
  }

   /**
   * @description
   * this method is used for updating Quick Risk item Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  updateQuickRiskItem(id: number,quickRiskId: number, item: QuickRiskReportDetail):Observable<any>{
    return this._http.put(`/quick-risk-assessment-reports/${id}/items/${quickRiskId}`, item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','updated_quick_risk_reports');
      return res;
    }))
  }

   /**
   * @description
   * this method is used for deleting Quick Risk item Summary reports
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  deleteQuickRiskItem(id:number, quickRiskId: number){
    return this._http.delete(`/quick-risk-assessment-reports/${id}/details/${quickRiskId}`).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','quick_risk_item_deleted');
      this.getItem(id).subscribe();
      return res;
    }))
  }


   /**
   * @description
   * this method is used for creating Quick Risk Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    saveQuickRiskSummaryItem(id: number, value){
      return this._http.post(`/quick-risk-assessment-reports/${id}/risks`,value).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('success', 'quick_risk_summary_added');
          return res;
        })
      )
    }

   /**
   * @description
   * this method is used for updating Quick Risk Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
  updateQuickRiskSummaryItem(id: number,quickRiskId: number, item: QuickRiskReportDetail):Observable<any>{
    return this._http.put(`/quick-risk-assessment-reports/${id}/risks/${quickRiskId}`, item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','quick_risk_summary_updated');
      return res;
    }))
  }

   /**
   * @description
   * this method is used for delete Quick Risk Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    deleteQuickRiskSummaryItem(id: number,quickRiskId: number):Observable<any>{
            return this._http.delete(`/quick-risk-assessment-reports/${id}/risks/${quickRiskId}`).pipe(map(res=>{
              this._utilityService.showSuccessMessage('success','quick_risk_summary_deleted');
              return res;
            }))
    }

    /**
   * @description
   * this method is used for update Quick Risk Observation Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
      updateQuickRiskObservationItem(id: number, summaryId: number,obervationId, value){
        return this._http.put(`/quick-risk-assessment-reports/${id}/risks/${summaryId}/observations/${obervationId}`,value).pipe(
          map((res) => {
            this._utilityService.showSuccessMessage('success', 'quick_risk_observation_updated');
            return res;
          })
        )
      }


    /**
   * @description
   * this method is used for creating Quick Risk Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    saveQuickRiskObservationItem(id: number, summaryId: number, value){
        return this._http.post(`/quick-risk-assessment-reports/${id}/risks/${summaryId}/observations`,value).pipe(
                map((res) => {
                  this._utilityService.showSuccessMessage('success', 'quick_risk_observation_added');
                  return res;
                })
              )
        }

    /**
   * @description
   * this method is used for delete Quick Risk Observation Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
      deleteQuickRiskObservationItem(id: number, summaryId: number,obervationId){
        return this._http.delete(`/quick-risk-assessment-reports/${id}/risks/${summaryId}/observations/${obervationId}`).pipe(
          map((res) => {
            this._utilityService.showSuccessMessage('success', 'quick_risk_observation_deleted');
            return res;
          })
        )
      }


   /**
   * @description
   * this method is used for creating Quick Risk Summary Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    saveQuickRiskTreatmentItem(id: number, summaryId: number, value){
          return this._http.post(`/quick-risk-assessment-reports/${id}/risks/${summaryId}/treatments`,value).pipe(
                map((res) => {
                  this._utilityService.showSuccessMessage('success', 'quick_risk_mitigation_plan_added');
                  return res;
                })
              )
    }

    
   /**
   * @description
   * this method is used for updating Quick Risk Treatment Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    udpdateQuickRiskTreatmentItem(id: number, summaryId: number,treatmentId: number, value){
      return this._http.put(`/quick-risk-assessment-reports/${id}/risks/${summaryId}/treatments/${treatmentId}`,value).pipe(
            map((res) => {
              this._utilityService.showSuccessMessage('success', 'quick_risk_mitigation_plan_updated');
              return res;
            })
          )
        }

   /**
   * @description
   * this method is used for delete Quick Risk Treatment Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    deleteQuickRiskTreatmentItem(id: number, summaryId: number,treatmentId){
        return this._http.delete(`/quick-risk-assessment-reports/${id}/risks/${summaryId}/treatments/${treatmentId}`).pipe(
          map((res) => {
            this._utilityService.showSuccessMessage('success', 'quick_risk_mitigation_plan_deleted');
            return res;
          })
        )
      }


   /**
   * @description
   * this method is used for Executive Report export data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof QuickRiskAssessmentReportsService
   */
    exportToPdf(id: number) {
            this._http.get(`/quick-risk-assessment-reports/${id}/export`, { responseType: 'blob' as 'json' }).subscribe(
              (response: any) => {
                this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('quick-risk-assessment-reports')
                +".pdf");
              }
            )
      }

  sortQuickReportList(type, callList: boolean = true) {
    if (!QuickRiskAssessmentReportStore.orderBy) {
      QuickRiskAssessmentReportStore.orderBy = 'asc';
      QuickRiskAssessmentReportStore.orderItem = type;
    }
    else {
      if (QuickRiskAssessmentReportStore.orderItem == type) {
        if (QuickRiskAssessmentReportStore.orderBy == 'asc') QuickRiskAssessmentReportStore.orderBy = 'desc';
        else QuickRiskAssessmentReportStore.orderBy = 'asc'
      }
      else {
        QuickRiskAssessmentReportStore.orderBy = 'asc';
        QuickRiskAssessmentReportStore.orderItem = type;
      }
    }
  }

}
