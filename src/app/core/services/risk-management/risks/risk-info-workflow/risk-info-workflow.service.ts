import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RiskInfoWorkflowDetail,RiskWorkflowHistory, RiskWorkflowHistoryPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-info-workflow';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskInfoWorkflowStore } from 'src/app/stores/risk-management/risks/risk-info-workflow.store';
@Injectable({
  providedIn: 'root'
})
export class RiskInfoWorkflowService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(id): Observable<RiskInfoWorkflowDetail> {
    return this._http.get<RiskInfoWorkflowDetail>('/risks/'+id+'/workflow').pipe((
      map((res:RiskInfoWorkflowDetail)=>{
        RiskInfoWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<RiskWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${RiskInfoWorkflowStore.currentPage}`;
      if (RiskInfoWorkflowStore.orderBy) params += `&order_by=impact_analysis.title&order=${RiskInfoWorkflowStore.orderBy}`;
    
    
    
    return this._http.get<RiskWorkflowHistoryPaginationResponse>('/risks/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: RiskWorkflowHistoryPaginationResponse) => {
        RiskInfoWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  // getHistory(id): Observable<RiskWorkflowHistory> {
  //   return this._http.get<RiskWorkflowHistory>('/risks/'+id+'/workflow-history').pipe((
  //     map((res:RiskWorkflowHistory)=>{
  //       RiskInfoWorkflowStore.setWorkflowHistory(res);
  //       return res;
  //     })
  //   ))
  // }

  submitRisk(id) {
    return this._http.put('/risks/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_submitted_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  approveRisk(id,comment) {
    return this._http.put('/risks/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertRisk(id,data) {
    return this._http.put('/risks/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewRisk(id) {
    return this._http.put('/risks/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'risk_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

}
