import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcpWorkFlowDetails } from 'src/app/core/models/bcm/bcp/bcp';
import { WorkflowHistoryPagination } from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow';
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';

@Injectable({
  providedIn: 'root'
})
export class BcpChangeRequestService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  createChangeRequest(item,versionId): Observable<any> {
    return this._http.post('/bcp-version-contents/'+versionId+'/change-requests', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_change_request_created');
        return res;
      })
    );
  }

  updateCRItem(id:number, cr_id: number, item): Observable<any> {
    return this._http.put('/bcp-change-request/'+ cr_id+'/content/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_content_updated');
        return res;
      })
    );
  }

  saveCRItem(item,cr_id: number): Observable<any> {
    return this._http.post('/bcp-change-request/'+ cr_id+'/content', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_content_added');
        return res;
      })
    );
  }

  saveInitialCRItem(item,version_id: number): Observable<any> {
    return this._http.post('/bcp-change-request/'+ version_id+'/add-contents', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_content_added');
        return res;
      })
    );
  }

  delete(id: number, version_id: number) {
    return this._http.delete('/bcp-change-request/'+version_id+'/content/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_content_deleted');
        return res;
      })
    );
  }

  approveWorkflow(id, data){
    return this._http.put('/bcp-change-request/'+id+'/approve',data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_workflow_approved');
        // BcpStore.setBcpWorkflowHistory(res);
        return res;
      })
    );
  }

  revertWorkflow(id,data){
    return this._http.put('/bcp-change-request/'+id+'/revert',data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_workflow_reverted');
        return res;
      })
    );
  }

  submitForWorkflow(id: number){
    return this._http.put('/bcp-change-request/'+ id +'/submit',null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_workflow_submitted');
        return res;
      })
    );
  }

  cancelChangeRequest(id: number){
    return this._http.post('/bcp-change-request/'+ id +'/cancel',null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_cr_cancelled');
        return res;
      })
    );
  }

  getWorkflowDetails(id: number): Observable<BcpWorkFlowDetails[]>{
    return this._http.get<BcpWorkFlowDetails[]>('/bcp-change-request/' + id+'/workflow').pipe(
      map((res: BcpWorkFlowDetails[]) => {
        BcpStore.setBcpWorkflow(res);
        return res;
      })
    );
  }

  getWorkflowHistory(id: number): Observable <WorkflowHistoryPagination>{
    let params = '';
    params = `?page=${BcpStore.workflowHistoryPage}`;
    return this._http.get<WorkflowHistoryPagination>('/bcp-change-request/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: WorkflowHistoryPagination) => {
        BcpStore.setBcpWorkflowHistory(res);
        return res;
      })
    );
  }

}
