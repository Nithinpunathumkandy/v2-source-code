import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RiskInfoWorkflowDetail,RiskWorkflowHistory, RiskWorkflowHistoryPaginationResponse } from 'src/app/core/models/risk-management/risks/risk-info-workflow';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskJourneyWorkflowStore } from 'src/app/stores/risk-management/risks/risk-journey-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class RiskJourneyWorkflowService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(id): Observable<RiskInfoWorkflowDetail> {
    return this._http.get<RiskInfoWorkflowDetail>('/risks/'+id+'/journey/workflow').pipe((
      map((res:RiskInfoWorkflowDetail)=>{
        RiskJourneyWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<RiskWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${RiskJourneyWorkflowStore.currentPage}`;
      if (RiskJourneyWorkflowStore.orderBy) params += `&order_by=impact_analysis.title&order=${RiskJourneyWorkflowStore.orderBy}`;
    
    
    
    return this._http.get<RiskWorkflowHistoryPaginationResponse>('/risks/'+id+'/journey/workflow-history' + (params ? params : '')).pipe(
      map((res: RiskWorkflowHistoryPaginationResponse) => {
        RiskJourneyWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  // getHistory(id): Observable<RiskWorkflowHistory> {
  //   return this._http.get<RiskWorkflowHistory>('/risks/'+id+'/workflow-history').pipe((
  //     map((res:RiskWorkflowHistory)=>{
  //       RiskJourneyWorkflowStore.setWorkflowHistory(res);
  //       return res;
  //     })
  //   ))
  // }

  submitRisk(id) {
    return this._http.put('/risks/' + id+'/journey/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_submitted_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  approveRisk(id,comment) {
    return this._http.put('/risks/' + id+'/journey/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertRisk(id,data) {
    return this._http.put('/risks/' + id+'/journey/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  reviewRisk(id) {
    return this._http.put('/risks/' + id+'/journey/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'risk_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
