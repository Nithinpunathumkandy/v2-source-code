import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import {RiskTreatment,RiskTreatmentPaginationResponse,IndividualRiskTreatment,RiskSummary, HistoryData} from 'src/app/core/models/risk-management/risks/risk-treatment';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { BcmRiskTreatmentStore } from 'src/app/stores/bcm/risk-assessment/bc-risk-treatment.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BcmRiskTreatmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }


  getItems(getAll: boolean = false, additionalParams?: string,riskId:boolean=true): Observable<RiskTreatmentPaginationResponse> {
    let params = '';
    if(riskId){
      params=`?risk_ids=${BcmRiskAssessmentStore.selectedId}`;
    }
    if (!getAll) {
      // params = params+`&page=${RisksStore.currentPage}`;
      params = (params=='')?params+`?page=${BcmRiskTreatmentStore.currentPage}`:params+`&page=${BcmRiskTreatmentStore.currentPage}`;
      if (BcmRiskTreatmentStore.orderBy) params += `&order=${BcmRiskTreatmentStore.orderBy}`;
      if (BcmRiskTreatmentStore.orderItem) params += `&order_by=${BcmRiskTreatmentStore.orderItem}`;
      if (BcmRiskTreatmentStore.searchText) params += `&q=${BcmRiskTreatmentStore.searchText}`;
      // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskTreatmentPaginationResponse>('/bcm-risk-treatments'+(params?params:'')).pipe(
      map((res: RiskTreatmentPaginationResponse) => {
        BcmRiskTreatmentStore.setTreatmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItem(id: number,params?:string): Observable<IndividualRiskTreatment> {
    return this._http.get<IndividualRiskTreatment>('/bcm-risk-treatments/'+id+(params?params:'')).pipe(
      map((res: IndividualRiskTreatment) => {
        BcmRiskTreatmentStore.setIndividualRiskTreatment(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getUpdateData(id: number): Observable<HistoryData> {
    let params='';
    params = (params=='')?params+`?page=${BcmRiskTreatmentStore.historyCurrentPage}`:params+`&page=${BcmRiskTreatmentStore.historyCurrentPage}`;
    params=params+'&order_by=created_at&order=desc&limit=5';
    return this._http.get<HistoryData>('/bcm-risk-treatments/'+id+'/updates'+(params?params:'')).pipe(
      map((res: HistoryData) => {
        BcmRiskTreatmentStore.setTreatmentUpdateData(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateTreatmentStatus(id,updateData): Observable<any> {
    return this._http.post('/bcm-risk-treatments/'+id+'/updates', updateData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');
        this.getItems(false,'',true).subscribe(res=>{
          this.getItem(id,'?risk_id='+BcmRiskAssessmentStore.selectedId).subscribe();
          // this._utilityService.detectChanges(this._cdr)
        })
        

        return res;
      })
    );
  }

  updateItem(id,saveData): Observable<any> {
    return this._http.put('/bcm-risk-treatments/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }
  saveItem(saveData): Observable<any> {
    return this._http.post('/bcm-risk-treatments', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveControlPlan(saveData): Observable<any> {
    return this._http.put('/risks/' + BcmRiskAssessmentStore.selectedId + '/control-plan', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_control_plan_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  delete(id: number) {
    // const httpOptions = {
    //   headers: new HttpHeaders({ 'custom-header': 'true' })
    // };
    return this._http.delete('/bcm-risk-treatments/' + id ).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getSummary(params?): Observable<RiskSummary> {
    return this._http.get<RiskSummary>('/bcm-risk-treatments/summary'+(params?params:'')).pipe(
      map((res: RiskSummary) => {
        BcmRiskTreatmentStore.setSummaryDetails(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  // closeTreatment(){
    closeTreatment(id): Observable<any> {
      return this._http.put('/bcm-risk-treatments/'+id+'/close', id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_closed');
  
          this.getItem(id,'?risk_id='+BcmRiskAssessmentStore.selectedId).subscribe();
  
          return res;
        })
      );
    // }
  }

  closeRisk(id): Observable<any> {
    return this._http.put('/bcm-risks/'+id+'/close', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_closed');

        this.getItems().subscribe();

        return res;
      })
    );
  // }
}

  setImageDetails(imageDetails,url,type){
    BcmRiskTreatmentStore.setDocumentImageDetails(imageDetails,url,type);
  }

  setSelectedImageDetails(imageDetails,type){
    BcmRiskTreatmentStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return BcmRiskTreatmentStore.getDocumentDetails;
  }

  sortRiskTreatmentList(type, callList: boolean = true) {
    if (!BcmRiskTreatmentStore.orderBy) {
      BcmRiskTreatmentStore.orderBy = 'asc';
      BcmRiskTreatmentStore.orderItem = type;
    }
    else {
      if (BcmRiskTreatmentStore.orderItem == type) {
        if (BcmRiskTreatmentStore.orderBy == 'asc') BcmRiskTreatmentStore.orderBy = 'desc';
        else BcmRiskTreatmentStore.orderBy = 'asc'
      }
      else {
        BcmRiskTreatmentStore.orderBy = 'asc';
        BcmRiskTreatmentStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'',false).subscribe();
  }

  generateTemplate() {
    this._http.get('/bcm-risk-treatments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risks_treatment_template') + ".xlsx");
      }
    )
  }

  exportToExcel(params?) {
    this._http.get('/bcm-risk-treatments/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risks_treatment') + ".xlsx");
      }
    )
  }
}
