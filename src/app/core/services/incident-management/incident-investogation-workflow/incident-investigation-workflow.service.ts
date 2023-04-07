import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentInvestigationWorkflowDetail, IncidentInvestigationWorkflowHistoryPaginationResponse } from 'src/app/core/models/incident-management/incident-workflow/incident-investigation-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-investigation-workflow.store';
import { IncidentWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-workflow-store';

@Injectable({
  providedIn: 'root'
})
export class IncidentInvestigationWorkflowService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

    getItems(id): Observable<IncidentInvestigationWorkflowDetail> {
      return this._http.get<IncidentInvestigationWorkflowDetail>('/incident-investigations/'+id+'/workflow').pipe((
        map((res:IncidentInvestigationWorkflowDetail)=>{
          IncidentInvestigationWorkflowStore.setWorkflowDetails(res);
          return res;
        })
      ))
    }

    getHistory(id): Observable<IncidentInvestigationWorkflowHistoryPaginationResponse> {
      let params = '';
      
        params = `?page=${IncidentInvestigationWorkflowStore.currentPage}`;
        if (IncidentInvestigationWorkflowStore.orderBy) params += `&order=${IncidentInvestigationWorkflowStore.orderBy}`;
      return this._http.get<IncidentInvestigationWorkflowHistoryPaginationResponse>('/incident-investigations/'+id+'/workflow-history' + (params ? params : '')).pipe(
        map((res: IncidentInvestigationWorkflowHistoryPaginationResponse) => {
          IncidentInvestigationWorkflowStore.setWorkflowHistory(res);
          return res;
        })
      );
    }

    submitInvestigation(id) {
      return this._http.put('/incident-investigations/' + id+'/submit',id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_ivestigation_submit');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }

    approveIncidentInvestigation(id,comment) {
      return this._http.put('/incident-investigations/' + id+'/approve',comment).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_invetigation_approved');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }
  
    revertIncidentInvestigation(id,data) {
      return this._http.put('/incident-investigations/' + id+'/revert',data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_invetigation_reverted');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }
    reviewIncidentInvestigation(id) {
      return this._http.put('/incident-investigations/' + id+'/review',id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_investigation_review');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }
}
