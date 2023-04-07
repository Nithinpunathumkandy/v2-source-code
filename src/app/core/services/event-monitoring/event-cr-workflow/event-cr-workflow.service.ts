import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventChangeRequestWorkflowStore } from 'src/app/stores/event-monitoring/events/event-cr-workflow-store';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class EventCrWorkflowService {

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  approveWorkflow(id, data){
    return this._http.put('/event-change-requests/'+id+'/approve',data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'event_cr_workflow_approved');
        return res;
      })
    );
  }

  revertWorkflow(id,data){
    return this._http.put('/event-change-requests/'+id+'/revert',data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'event_cr_workflow_reverted');
        return res;
      })
    );
  }

  rejectWorkflow(id,data){
    return this._http.put('/event-change-requests/'+id+'/reject',data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'event_cr_workflow_rejected');
        return res;
      })
    );
  }

  submitForWorkflow(id: number){
    return this._http.put('/event-change-requests/'+ id +'/submit',null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_cr_workflow_submitted');
        return res;
      })
    );
  }

  cancelChangeRequest(id: number){
    return this._http.post('/event-change-requests/'+ id +'/cancel',null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_cr_cancelled');
        return res;
      })
    );
  }

  getWorkflowDetails(id: number): Observable<any[]>{
    return this._http.get<any[]>('/event-change-requests/' + id+'/workflow').pipe(
      map((res: any[]) => {
        EventChangeRequestWorkflowStore.setEventChangeRequestWorkflow(res);
        return res;
      })
    );
  }

  getWorkflowHistory(id: number): Observable <any>{
    let params = '';
    params = `?page=${EventChangeRequestWorkflowStore.workflowHistoryPage}`;
    return this._http.get<any>('/event-change-requests/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: any) => {
        EventChangeRequestWorkflowStore.setChangeRequestWorkflowHistory(res);
        return res;
      })
    );
  }
}
