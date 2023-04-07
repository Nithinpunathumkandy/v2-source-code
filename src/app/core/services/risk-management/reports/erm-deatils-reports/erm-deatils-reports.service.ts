import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { JsoObservationStore } from 'src/app/stores/jso/jso-observations/jso-observations-store';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { ErmDetailsReportsPaginationResponse, IndividualErmDetail } from 'src/app/core/models/risk-management/reports/ermDetailreport';
import { ErmDetailsStore } from 'src/app/stores/risk-management/reports/erm-details/erm-details-store';
@Injectable({
  providedIn: 'root'
})
export class ErmDetailsReportsService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService) { }


   /**
   * @description
   * This method is used for getting Erm Detail reports.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
  getItems(getAll: boolean = false, additionalParams?: string): Observable<ErmDetailsReportsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ErmDetailsStore.currentPage}`;
      if (ErmDetailsStore.orderBy) params += `&order=${ErmDetailsStore.orderBy}`;
      if (ErmDetailsStore.orderItem) params += `&order_by=${ErmDetailsStore.orderItem}`;
    }
    if(additionalParams) params += additionalParams;
    if (ErmDetailsStore.searchText) params += (params ? '&q=' : '?q=') + ErmDetailsStore.searchText;
    return this._http.get<ErmDetailsReportsPaginationResponse>('/detailed-erm-reports' + (params ? params : '')).pipe(
      map((res: ErmDetailsReportsPaginationResponse) => {
        ErmDetailsStore.setErmDetailReport(res);
        return res;
      })
    );
  }

   /**
   * @description
   * This method is used for getting All Erm Detail reports.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
  getItem(id): Observable<IndividualErmDetail> {
    return this._http.get<IndividualErmDetail>('/detailed-erm-reports/' + id).pipe(
      map((res: IndividualErmDetail) => {
        ErmDetailsStore.setIndividulaErmDetailReport(res)
        return res;
      })
    );
  }


   /**
   * @description
   * this method is used for creating Erm detail report
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
  saveItem(value) {
    return this._http.post('/detailed-erm-reports', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'erm_reports_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating Erm Detail Reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
   updateItem(id: number, item: IndividualErmDetail):Observable<any>{
    return this._http.put(`/detailed-erm-reports/${id}`, item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','updated_erm_detail_reports');
      return res;
    }))
  }

  /**
   * @description
   * this method is used for deleting Erm Detail reports
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
   deleteItem(id:number){
    return this._http.delete(`/detailed-erm-reports/${id}`).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','delete_erm_detail');
      this.getItems(false, null).subscribe();
      return res;
    }))
  }

  // getErmDetailRiskItem(id: number,ermRiskId: number): Observable<IndividualErmDetail> {
  //   return this._http.get<IndividualErmDetail>(`/detailed-erm-reports/${id}/risks/${ermRiskId}`).pipe(
  //     map((res: IndividualErmDetail) => {
  //       ErmDetailsStore.setErmDetailRiskReport(res)
  //       return res;
  //     })
  //   );
  // }

     /**
   * @description
   * this method is used for updating Erm Detail Risk based reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
      updateErmDetailRisk(id: number,ermRiskId: number, item):Observable<any>{
        return this._http.put(`/detailed-erm-reports/${id}/risks/${ermRiskId}`, item).pipe(map(res=>{
          this._utilityService.showSuccessMessage('success','updated_erm_detail_reports');
          // this.getErmDetailRiskItem(id,ermRiskId);
          return res;
        }))
      }

    /**
   * @description
   * this method is used for delete Erm Detail Risk based reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
    deleteErmDetailRisk(id: number,ermRiskId: number):Observable<any>{
              return this._http.delete(`/detailed-erm-reports/${id}/risks/${ermRiskId}`).pipe(map(res=>{
                this._utilityService.showSuccessMessage('success','deleted_erm_detail_reports');
                // this.getErmDetailRiskItem(id,ermRiskId);
                return res;
            }))
      }

   /**
   * @description
   * this method is used for updating Erm Detail Risk based reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
    updateErmDetailRiskTreatment(id: number,ermRiskTreatmentId: number, item):Observable<any>{
        return this._http.put(`/detailed-erm-reports/${id}/risk-treatments/${ermRiskTreatmentId}`, item).pipe(map(res=>{
            this._utilityService.showSuccessMessage('success','updated_erm_detail_reports');
              return res;
            }))
        }

   /**
   * @description
   * this method is used for deleting Erm Detail Treatment based reports
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
    deleteErmDetailRiskTreatment(id: number,ermRiskTreatmentId: number):Observable<any>{
      return this._http.delete(`/detailed-erm-reports/${id}/risk-treatments/${ermRiskTreatmentId}`).pipe(map(res=>{
          this._utilityService.showSuccessMessage('success','deleted_erm_treatment_reports');
            return res;
          }))
    }

   /**
   * @description
   * this method is used for Erm report export data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ErmDetailsReportsService
   */
    exportToPdf(id: number) {
      this._http.get(`/detailed-erm-reports/${id}/export`, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('detailed-erm-reports')
          +".pdf");
        }
      )
    }




  sortErmReportList(type, callList: boolean = true) {
    if (!ErmDetailsStore.orderBy) {
      ErmDetailsStore.orderBy = 'asc';
      ErmDetailsStore.orderItem = type;
    }
    else {
      if (ErmDetailsStore.orderItem == type) {
        if (ErmDetailsStore.orderBy == 'asc') ErmDetailsStore.orderBy = 'desc';
        else ErmDetailsStore.orderBy = 'asc'
      }
      else {
        ErmDetailsStore.orderBy = 'asc';
        ErmDetailsStore.orderItem = type;
      }
    }
  }

}
