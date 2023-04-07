import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import {RiskTreatment,RiskTreatmentPaginationResponse,IndividualRiskTreatment,RiskSummary, HistoryData} from 'src/app/core/models/risk-management/risks/risk-treatment';
// import { IsmsRiskTreatmentStore } from 'src/app/stores/risk-management/risks/risk-treatment.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import { IsmsRiskTreatmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-treatment.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskTreatmentService {

  
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }


  getItems(getAll: boolean = false, additionalParams?: string,riskId:boolean=true): Observable<RiskTreatmentPaginationResponse> {
    let params = '';
    if(riskId){
      params=`?risk_ids=${IsmsRisksStore.riskId}`;
    }
    if (!getAll) {
      // params = params+`&page=${IsmsRisksStore.currentPage}`;
      params = (params=='')?params+`?page=${IsmsRiskTreatmentStore.currentPage}`:params+`&page=${IsmsRiskTreatmentStore.currentPage}`;
      if (IsmsRiskTreatmentStore.orderBy) params += `&order=${IsmsRiskTreatmentStore.orderBy}`;
      if (IsmsRiskTreatmentStore.orderItem) params += `&order_by=${IsmsRiskTreatmentStore.orderItem}`;
      if (IsmsRiskTreatmentStore.searchText) params += `&q=${IsmsRiskTreatmentStore.searchText}`;
      // if (IsmsRisksStore.orderBy) params += `&order_by=risks.title&order=${IsmsRisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskTreatmentPaginationResponse>('/isms-risk-treatments'+(params?params:'')).pipe(
      map((res: RiskTreatmentPaginationResponse) => {
        IsmsRiskTreatmentStore.setTreatmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItem(id: number,params?:string): Observable<IndividualRiskTreatment> {
    return this._http.get<IndividualRiskTreatment>('/isms-risk-treatments/'+id+(params?params:'')).pipe(
      map((res: IndividualRiskTreatment) => {
        IsmsRiskTreatmentStore.setIndividualRiskTreatment(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getUpdateData(id: number): Observable<HistoryData> {
    let params='';
    params = (params=='')?params+`?page=${IsmsRiskTreatmentStore.historyCurrentPage}`:params+`&page=${IsmsRiskTreatmentStore.historyCurrentPage}`;
    params=params+'&order_by=created_at&order=desc&limit=5';
    return this._http.get<HistoryData>('/isms-risk-treatments/'+id+'/updates'+(params?params:'')).pipe(
      map((res: HistoryData) => {
        IsmsRiskTreatmentStore.setTreatmentUpdateData(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateTreatmentStatus(id,updateData): Observable<any> {
    return this._http.post('/isms-risk-treatments/'+id+'/updates', updateData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');
        this.getItems(false,'',true).subscribe(res=>{
          this.getUpdateData(id).subscribe();
          this.getItem(id,'?risk_id='+IsmsRisksStore.riskId).subscribe();
          // this._utilityService.detectChanges(this._cdr)
        })
        

        return res;
      })
    );
  }

  updateItem(id,saveData): Observable<any> {
    return this._http.put('/isms-risk-treatments/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }
  saveItem(saveData): Observable<any> {
    return this._http.post('/isms-risk-treatments', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveControlPlan(saveData): Observable<any> {
    return this._http.put('/isms-risks/' + IsmsRisksStore.riskId + '/control-plan', saveData).pipe(
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
    return this._http.delete('/isms-risk-treatments/' + id ).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getSummary(params?): Observable<RiskSummary> {
    return this._http.get<RiskSummary>('/isms-risk-treatments/summary'+(params?params:'')).pipe(
      map((res: RiskSummary) => {
        IsmsRiskTreatmentStore.setSummaryDetails(res);
        // IsmsRisksStore.updateRisk(res)
        return res;
      })
    );
  }

  // closeTreatment(){
    closeTreatment(id): Observable<any> {
      return this._http.put('/isms-risk-treatments/'+id+'/close', id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_closed');
  
          this.getItem(id,'?risk_id='+IsmsRisksStore.riskId).subscribe();
          this.getSummary('?risk_id='+IsmsRisksStore.riskId).subscribe();
          return res;
        })
      );
    // }
  }

  setImageDetails(imageDetails,url,type){
    IsmsRiskTreatmentStore.setDocumentImageDetails(imageDetails,url,type);
  }

  setSelectedImageDetails(imageDetails,type){
    IsmsRiskTreatmentStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return IsmsRiskTreatmentStore.getDocumentDetails;
  }

  sortRiskTreatmentList(type, callList: boolean = true) {
    if (!IsmsRiskTreatmentStore.orderBy) {
      IsmsRiskTreatmentStore.orderBy = 'asc';
      IsmsRiskTreatmentStore.orderItem = type;
    }
    else {
      if (IsmsRiskTreatmentStore.orderItem == type) {
        if (IsmsRiskTreatmentStore.orderBy == 'asc') IsmsRiskTreatmentStore.orderBy = 'desc';
        else IsmsRiskTreatmentStore.orderBy = 'asc'
      }
      else {
        IsmsRiskTreatmentStore.orderBy = 'asc';
        IsmsRiskTreatmentStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'',false).subscribe();
  }

  generateTemplate() {
    this._http.get('/isms-risk-treatments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_treatment_template')+".xlsx");     
      }
    )
  }

  exportToExcel(params?) {
    this._http.get('/isms-risk-treatments/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_treatments')+".xlsx");     

      }
    )
  }

}
