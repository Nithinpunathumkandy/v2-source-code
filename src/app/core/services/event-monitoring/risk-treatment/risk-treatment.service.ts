import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { EventRiskTreatmentStore } from 'src/app/stores/event-monitoring/risk-register/risk-treatment.store';
import { RiskTreatmentPaginationResponse,IndividualRiskTreatment,HistoryData,RiskSummary } from 'src/app/core/models/event-monitoring/risk-register/risk-treatments';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';

@Injectable({
  providedIn: 'root'
})
export class RiskTreatmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }


  getItems(getAll: boolean = false, additionalParams?: string,riskId:boolean=true): Observable<RiskTreatmentPaginationResponse> {
    let params = '';
    if(riskId){
      params=`?risk_ids=${RiskRegisterStore.RiskRegisterId}`;
    }
    if (!getAll) {
      // params = params+`&page=${RisksStore.currentPage}`;
      params = (params=='')?params+`?page=${EventRiskTreatmentStore.currentPage}`:params+`&page=${EventRiskTreatmentStore.currentPage}`;
      if (EventRiskTreatmentStore.orderBy) params += `&order=${EventRiskTreatmentStore.orderBy}`;
      if (EventRiskTreatmentStore.orderItem) params += `&order_by=${EventRiskTreatmentStore.orderItem}`;
      if (EventRiskTreatmentStore.searchText) params += `&q=${EventRiskTreatmentStore.searchText}`;
      // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskTreatmentPaginationResponse>('/event-risk-treatments'+(params?params:'')).pipe(
      map((res: RiskTreatmentPaginationResponse) => {
        EventRiskTreatmentStore.setTreatmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItem(id: number,params?:string): Observable<IndividualRiskTreatment> {
    return this._http.get<IndividualRiskTreatment>('/event-risk-treatments/'+id+(params?params:'')).pipe(
      map((res: IndividualRiskTreatment) => {
        EventRiskTreatmentStore.setIndividualRiskTreatment(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  getUpdateData(id: number): Observable<HistoryData> {
    let params='';
    params = (params=='')?params+`?page=${EventRiskTreatmentStore.historyCurrentPage}`:params+`&page=${EventRiskTreatmentStore.historyCurrentPage}`;
    params=params+'&order_by=created_at&order=desc&limit=5';
    return this._http.get<HistoryData>('/event-risk-treatments/'+id+'/updates'+(params?params:'')).pipe(
      map((res: HistoryData) => {
        EventRiskTreatmentStore.setTreatmentUpdateData(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateTreatmentStatus(id,updateData): Observable<any> {
    return this._http.post('/event-risk-treatments/'+id+'/updates', updateData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');
        this.getItems(false,'',true).subscribe(res=>{
          this.getItem(id,'?risk_id='+RiskRegisterStore.RiskRegisterId).subscribe();
          // this._utilityService.detectChanges(this._cdr)
        })
        

        return res;
      })
    );
  }

  updateItem(id,saveData): Observable<any> {
    return this._http.put('/event-risk-treatments/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }
  saveItem(saveData): Observable<any> {
    return this._http.post('/event-risk-treatments', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveControlPlan(saveData): Observable<any> {
    return this._http.put('/risks/' + RiskRegisterStore.RiskRegisterId + '/control-plan', saveData).pipe(
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
    return this._http.delete('/event-risk-treatments/' + id ).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_treatment_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getSummary(params?): Observable<RiskSummary> {
    return this._http.get<RiskSummary>('/event-risk-treatments/summary'+(params?params:'')).pipe(
      map((res: RiskSummary) => {
        EventRiskTreatmentStore.setSummaryDetails(res);
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  // closeTreatment(){
    closeTreatment(id): Observable<any> {
      return this._http.put('/event-risk-treatments/'+id+'/close', id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_closed');
  
          this.getItem(id,'?risk_id='+RiskRegisterStore.RiskRegisterId).subscribe();
  
          return res;
        })
      );
    // }
  }

  closeRisk(id): Observable<any> {
    return this._http.put('/event-risks/'+id+'/close', id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_closed');

        this.getItems().subscribe();

        return res;
      })
    );
  // }
}

  setImageDetails(imageDetails,url,type){
    EventRiskTreatmentStore.setDocumentImageDetails(imageDetails,url,type);
  }

  setSelectedImageDetails(imageDetails,type){
    EventRiskTreatmentStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return EventRiskTreatmentStore.getDocumentDetails;
  }

  sortRiskTreatmentList(type, callList: boolean = true) {
    if (!EventRiskTreatmentStore.orderBy) {
      EventRiskTreatmentStore.orderBy = 'asc';
      EventRiskTreatmentStore.orderItem = type;
    }
    else {
      if (EventRiskTreatmentStore.orderItem == type) {
        if (EventRiskTreatmentStore.orderBy == 'asc') EventRiskTreatmentStore.orderBy = 'desc';
        else EventRiskTreatmentStore.orderBy = 'asc'
      }
      else {
        EventRiskTreatmentStore.orderBy = 'asc';
        EventRiskTreatmentStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'',false).subscribe();
  }

  generateTemplate() {
    this._http.get('/event-risk-treatments/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risks_treatment_template') + ".xlsx");
      }
    )
  }

  exportToExcel(params?) {
    this._http.get('/event-risk-treatments/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risks_treatment') + ".xlsx");
      }
    )
  }
}

