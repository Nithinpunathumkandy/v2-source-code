import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentCaWorkflowDetail } from 'src/app/core/models/incident-management/incident-workflow/incident-ca-workflow';
import { IncidentInfoWorkflowHistoryPaginationResponse } from 'src/app/core/models/incident-management/incident-workflow/incident-Info-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentCaWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-ca-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class IncidentCaWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<IncidentCaWorkflowDetail> {
    return this._http.get<IncidentCaWorkflowDetail>('/incident-corrective-actions/'+id+'/workflow').pipe((
      map((res:IncidentCaWorkflowDetail)=>{
        IncidentCaWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<IncidentInfoWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${IncidentCaWorkflowStore.currentPage}`;
      if (IncidentCaWorkflowStore.orderBy) params += `&order_by=impact_analysis.title&order=${IncidentCaWorkflowStore.orderBy}`;
    return this._http.get<IncidentInfoWorkflowHistoryPaginationResponse>('/incident-corrective-actions/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: IncidentInfoWorkflowHistoryPaginationResponse) => {
        IncidentCaWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitCA(id) {
    return this._http.put('/incident-corrective-actions/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ca_submit_workflow');
        
        return res;
      })
    );
  }

  approveIncidentCA(id,comment) {
    return this._http.put('/incident-corrective-actions/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ca_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertIncidentCA(id,data) {
    return this._http.put('/incident-corrective-actions/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ca_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewIncidentCA(id) {
    return this._http.put('/incident-corrective-actions/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'IncidentInvestigation_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
