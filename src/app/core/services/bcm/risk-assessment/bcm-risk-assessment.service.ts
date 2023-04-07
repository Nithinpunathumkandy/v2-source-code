import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { BcmRiskAnalysis, BcmRiskAssessmentDetails, BcmRiskAssessmentPaginationResponse } from 'src/app/core/models/bcm/risk-assessment/risk-assessment';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BcmRiskTreatmentStore } from 'src/app/stores/bcm/risk-assessment/bc-risk-treatment.store';
import { RiskTreatmentPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-treatment';
import { ContextChart } from 'src/app/core/models/risk-management/risks/risks';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class BcmRiskAssessmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BcmRiskAssessmentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BcmRiskAssessmentStore.currentPage}`;
      if (BcmRiskAssessmentStore.orderBy) params += `&order=${BcmRiskAssessmentStore.orderBy}`;
      if (BcmRiskAssessmentStore.orderItem) params += `&order_by=${BcmRiskAssessmentStore.orderItem}`;
    }
    if (BcmRiskAssessmentStore.searchText) params = (params == '') ? params + `?q=${BcmRiskAssessmentStore.searchText}` : params + `&q=${BcmRiskAssessmentStore.searchText}`;
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (status) params += (params ? '&' : '?')+'status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_risk'&& RightSidebarLayoutStore.filtersAsQueryString){
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    }
    return this._http.get<BcmRiskAssessmentPaginationResponse>('/bcm-risks' + (params ? params : '')).pipe(
      map((res: BcmRiskAssessmentPaginationResponse) => {
        BcmRiskAssessmentStore.setBcmRiskResponse(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<BcmRiskAssessmentDetails>{
    return this._http.get<BcmRiskAssessmentDetails>('/bcm-risks/' + id).pipe(
      map((res: BcmRiskAssessmentDetails) => {
        res.is_analysis_performed = typeof(res.is_analysis_performed)=='string'?parseInt(res.is_analysis_performed):res.is_analysis_performed;
        res.is_residual_analysis_performed = typeof(res.is_residual_analysis_performed)=='string'?parseInt(res.is_residual_analysis_performed):res.is_residual_analysis_performed; 
        BcmRiskAssessmentStore.setBcmRiskDetails(res);
        return res;
      })
    );
  }

  getContextChart(id: number): Observable<ContextChart> {
    return this._http.get<ContextChart>('/bcm-risks/' + id+'/analyses/charts').pipe(
      map((res: ContextChart) => {
        if(res&&res.risk_analysis){
          BcmRiskAssessmentStore.setContextChartDetails(res);
        }
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateRiskInfo(category_id:number, category): Observable<any> {
    return this._http.put('/bcm-risks/'+ category_id, category).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_updated');
        this.getItem(BcmRiskAssessmentStore.selectedId).subscribe();
        return res;
      })
    );
  }

  saveRiskInfo(item): Observable<any> {
    return this._http.post('/bcm-risks', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_save');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveRiskMapping(id,item): Observable<any> {
    return this._http.post('/bcm-risk-mappings/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_mapping_created');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  getRiskAssessment(id: number): Observable<BcmRiskAnalysis>{
    return this._http.get<BcmRiskAnalysis>('/bcm-risks/'+id+'/analyses').pipe(
      map((res: BcmRiskAnalysis) => {
        BcmRiskAssessmentStore.setBcmRiskAnalysis(res);
        return res;
      })
    );
  }

  saveRiskAssessment(id,item): Observable<any> {
    return this._http.post('/bcm-risks/'+id+'/analyses', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_assessment_saved');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  getRiskTreatment(id: number): Observable<RiskTreatmentPaginationResponse>{
    return this._http.get<RiskTreatmentPaginationResponse>('/bcm-risk-treatments?risk_ids'+id).pipe(
      map((res: RiskTreatmentPaginationResponse) => {
        BcmRiskTreatmentStore.setTreatmentDetails(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/bcm-risks/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_deleted');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/bcm-risks/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_activated');
        this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/bcm-risks/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_deactivated');
        this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/bcm-risks/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_assessment')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (BcmRiskAssessmentStore.orderBy) params += `?order=${BcmRiskAssessmentStore.orderBy}`;
    if (BcmRiskAssessmentStore.orderItem) params += `&order_by=${BcmRiskAssessmentStore.orderItem}`;
    // if (BcmRiskAssessmentStore.searchText) params += `&q=${BcmRiskAssessmentStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_risk' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/bcm-risks/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_assessment')+".xlsx");
      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/bcm-risks/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','bcp_imported');
        return res;
      })
    )
  }

  shareData(data) {
    return this._http.post('/bcm-risks/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bcm_risk_shared');
        return res;
      })
    )
  }

  sortBcpList(type:string) {
    if (!BcmRiskAssessmentStore.orderBy) {
      BcmRiskAssessmentStore.orderBy = 'asc';
      BcmRiskAssessmentStore.orderItem = type;
    }
    else{
      if (BcmRiskAssessmentStore.orderItem == type) {
        if(BcmRiskAssessmentStore.orderBy == 'asc') BcmRiskAssessmentStore.orderBy = 'desc';
        else BcmRiskAssessmentStore.orderBy = 'asc'
      }
      else{
        BcmRiskAssessmentStore.orderBy = 'asc';
        BcmRiskAssessmentStore.orderItem = type;
      }
    }
  }
}
