import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import {RiskTreatmentPaginationResponse,IndividualRiskTreatment,RiskSummary, HistoryData} from 'src/app/core/models/hira/hira-register/hira-treatment';
import { RiskTreatmentStore } from 'src/app/stores/hira/hira/hira-treatment.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class HiraTreatmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }
  
    getItems(getAll: boolean = false, additionalParams?: string,riskId:boolean=true): Observable<RiskTreatmentPaginationResponse> {
      let params = '';
      if(riskId){
        params=`?risk_ids=${RisksStore.riskId}`;
      }
      if (!getAll) {
        // params = params+`&page=${RisksStore.currentPage}`;
        params = (params=='')?params+`?page=${RiskTreatmentStore.currentPage}`:params+`&page=${RiskTreatmentStore.currentPage}`;
        if (RiskTreatmentStore.orderBy) params += `&order=${RiskTreatmentStore.orderBy}`;
        if (RiskTreatmentStore.orderItem) params += `&order_by=${RiskTreatmentStore.orderItem}`;
        if (RiskTreatmentStore.searchText) params += `&q=${RiskTreatmentStore.searchText}`;
        // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
      }
  
      if(additionalParams){
        params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
        // else params += `?${additionalParams}`;
      }
      if(RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<RiskTreatmentPaginationResponse>('/risk-treatments'+(params?params:'')).pipe(
        map((res: RiskTreatmentPaginationResponse) => {
          RiskTreatmentStore.setTreatmentDetails(res);
          // ImpactStore.updateImpact(res)
          return res;
        })
      );
    }
  
    getItem(id: number,params?:string): Observable<IndividualRiskTreatment> {
      return this._http.get<IndividualRiskTreatment>('/risk-treatments/'+id+(params?params:'')).pipe(
        map((res: IndividualRiskTreatment) => {
          RiskTreatmentStore.setIndividualRiskTreatment(res);
          // RisksStore.updateRisk(res)
          return res;
        })
      );
    }
  
    getUpdateData(id: number): Observable<HistoryData> {
      let params='';
      params = (params=='')?params+`?page=${RiskTreatmentStore.historyCurrentPage}`:params+`&page=${RiskTreatmentStore.historyCurrentPage}`;
      params=params+'&order_by=created_at&order=desc&limit=5';
      return this._http.get<HistoryData>('/risk-treatments/'+id+'/updates'+(params?params:'')).pipe(
        map((res: HistoryData) => {
          RiskTreatmentStore.setTreatmentUpdateData(res);
          // RisksStore.updateRisk(res)
          return res;
        })
      );
    }
  
    updateTreatmentStatus(id,updateData): Observable<any> {
      return this._http.post('/risk-treatments/'+id+'/updates', updateData).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');
          this.getItems(false,'',true).subscribe(res=>{
            this.getUpdateData(id).subscribe();
            this.getItem(id,'?risk_id='+RisksStore.riskId).subscribe();
            // this._utilityService.detectChanges(this._cdr)
          })
          
  
          return res;
        })
      );
    }
  
    updateItem(id,saveData): Observable<any> {
      return this._http.put('/risk-treatments/'+id, saveData).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');
  
          this.getItems().subscribe();
  
          return res;
        })
      );
    }
    saveItem(saveData): Observable<any> {
      return this._http.post('/risk-treatments', saveData).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_updated');
  
          this.getItems().subscribe();
  
          return res;
        })
      );
    }
  
    saveControlPlan(saveData): Observable<any> {
      return this._http.put('/risks/' + RisksStore.riskId + '/control-plan', saveData).pipe(
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
      return this._http.delete('/risk-treatments/' + id ).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_treatment_deleted');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    getSummary(params?): Observable<RiskSummary> {
      return this._http.get<RiskSummary>('/risk-treatments/summary'+(params?params:'')).pipe(
        map((res: RiskSummary) => {
          RiskTreatmentStore.setSummaryDetails(res);
          // RisksStore.updateRisk(res)
          return res;
        })
      );
    }
  
    // closeTreatment(){
      closeTreatment(id): Observable<any> {
        return this._http.put('/risk-treatments/'+id+'/close', id).pipe(
          map(res => {
            this._utilityService.showSuccessMessage('success', 'risk_treatment_closed');
    
            this.getItem(id,'?risk_id='+RisksStore.riskId).subscribe();
            this.getSummary('?risk_id='+RisksStore.riskId).subscribe();
            return res;
          })
        );
      // }
    }
  
    setImageDetails(imageDetails,url,type){
      RiskTreatmentStore.setDocumentImageDetails(imageDetails,url,type);
    }
  
    setSelectedImageDetails(imageDetails,type){
      RiskTreatmentStore.setSelectedImageDetails(imageDetails);
    }
  
    getDocuments(){
      return RiskTreatmentStore.getDocumentDetails;
    }
  
    sortRiskTreatmentList(type, callList: boolean = true) {
      if (!RiskTreatmentStore.orderBy) {
        RiskTreatmentStore.orderBy = 'asc';
        RiskTreatmentStore.orderItem = type;
      }
      else {
        if (RiskTreatmentStore.orderItem == type) {
          if (RiskTreatmentStore.orderBy == 'asc') RiskTreatmentStore.orderBy = 'desc';
          else RiskTreatmentStore.orderBy = 'asc'
        }
        else {
          RiskTreatmentStore.orderBy = 'asc';
          RiskTreatmentStore.orderItem = type;
        }
      }
      if (callList)
        this.getItems(false,'',false).subscribe();
    }
  
    generateTemplate() {
      this._http.get('/risk-treatments/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,  this._helperService.translateToUserLanguage('risks-treatment-template')+".xlsx");
        }
      )
    }
  
    importData(data){  
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-treatments/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('successfully','risk_imported');
          return res;
        })
      )
    }
  
    exportToExcel(params?) {
      if(RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
     
      this._http.get('/risk-treatments/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,  this._helperService.translateToUserLanguage('risks-treatment')+".xlsx");
        }
      )
    }

}
