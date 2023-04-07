import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RiskInfoWorkflowDetail,RiskWorkflowHistory, RiskWorkflowHistoryPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-info-workflow';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskInfoWorkflowStore } from 'src/app/stores/isms/isms-risks/isms-risk-info-workflow.store';
// import { IsmsRiskInfoWorkflowStore } from 'src/app/stores/risk-management/isms-risks/risk-info-workflow.store';
@Injectable({
  providedIn: 'root'
})
export class IsmsRiskInfoWorkflowService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(id): Observable<RiskInfoWorkflowDetail> {
    return this._http.get<RiskInfoWorkflowDetail>('/isms-risks/'+id+'/workflow').pipe((
      map((res:RiskInfoWorkflowDetail)=>{
        IsmsRiskInfoWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<RiskWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${IsmsRiskInfoWorkflowStore.currentPage}`;
      if (IsmsRiskInfoWorkflowStore.orderBy) params += `&order_by=impact_analysis.title&order=${IsmsRiskInfoWorkflowStore.orderBy}`;
    
    
    
    return this._http.get<RiskWorkflowHistoryPaginationResponse>('/isms-risks/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: RiskWorkflowHistoryPaginationResponse) => {
        IsmsRiskInfoWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  // getHistory(id): Observable<RiskWorkflowHistory> {
  //   return this._http.get<RiskWorkflowHistory>('/isms-risks/'+id+'/workflow-history').pipe((
  //     map((res:RiskWorkflowHistory)=>{
  //       IsmsRiskInfoWorkflowStore.setWorkflowHistory(res);
  //       return res;
  //     })
  //   ))
  // }

  submitRisk(id) {
    return this._http.put('/isms-risks/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_submitted_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  approveRisk(id,comment) {
    return this._http.put('/isms-risks/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertRisk(id,data) {
    return this._http.put('/isms-risks/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewRisk(id) {
    return this._http.put('/isms-risks/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'risk_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

}
