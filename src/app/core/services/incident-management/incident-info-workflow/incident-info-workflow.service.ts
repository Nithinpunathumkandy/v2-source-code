import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentInfoWorkflowDetail, IncidentInfoWorkflowHistoryPaginationResponse } from 'src/app/core/models/incident-management/incident-workflow/incident-Info-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInfoWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-info-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class IncidentInfoWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<IncidentInfoWorkflowDetail> {
    return this._http.get<IncidentInfoWorkflowDetail>('/incidents/'+id+'/workflow').pipe((
      map((res:IncidentInfoWorkflowDetail)=>{
        IncidentInfoWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<IncidentInfoWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${IncidentInfoWorkflowStore.currentPage}`;
      if (IncidentInfoWorkflowStore.orderBy) params += `&order_by=impact_analysis.title&order=${IncidentInfoWorkflowStore.orderBy}`;
    return this._http.get<IncidentInfoWorkflowHistoryPaginationResponse>('/incidents/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: IncidentInfoWorkflowHistoryPaginationResponse) => {
        IncidentInfoWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitInvestigation(id) {
    return this._http.put('/incidents/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_submitted_review');
        
        return res;
      })
    );
  }

  approveIncidentInvestigation(id,comment) {
    return this._http.put('/incidents/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertIncidentInvestigation(id,data) {
    return this._http.put('/incidents/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewIncidentInvestigation(id) {
    return this._http.put('/incidents/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'incident_investigation_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
