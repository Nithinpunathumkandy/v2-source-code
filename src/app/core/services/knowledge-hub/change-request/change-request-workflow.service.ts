import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DocumentWorkflow, WorkflowHistoryPagination } from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow'
import { documentWorkFlowStore } from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store'
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { ChangeRequestWorkflow, CRWorkflowHistoryPagination } from "src/app/core/models/knowledge-hub/change-request/change-request-workflow";
@Injectable({
  providedIn: 'root'
})
export class ChangeRequestWorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }
  
  
    getWorkflow(id): Observable<DocumentWorkflow[]> {
      return this._http
        .get<DocumentWorkflow[]>('/document-change-requests/' + id + '/workflow-list')
        .pipe(
          map((res: DocumentWorkflow[]) => {
            documentWorkFlowStore.setDocumentWorkflow(res);
            return res;
          })
        );
    }
    
    getWorkflowNew(id): Observable<ChangeRequestWorkflow[]> {
      return this._http
        .get<ChangeRequestWorkflow[]>('/document-change-requests/' + id + '/workflow-list')
        .pipe(
          map((res: ChangeRequestWorkflow[]) => {
            changeRequestStore.setChangeRequestWorkflow(res);
            return res;
          })
        );
    }
  
    submittDocument() {
      return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/submit`,null).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_submitted');
        return res;
      }))
  
    }
  
    publishDocument(comment) {
      return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/publish`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_published');
        return res;
      }))
  
    }
  
    revertDocument(comment) {
      return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/revert`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_reverted');
        return res;
      }))
  
    }
  
    rejectDocument(comment) {
      return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/reject`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_rejected');
        return res;
      }))
  
    }
  
    approveDocument(comment) {
      return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/approve`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_approved');
        return res;
      }))
  
  }
  
  getWorkflowHistory(): Observable<WorkflowHistoryPagination> {
    return this._http
      .get<WorkflowHistoryPagination>('/document-change-requests/' + `${changeRequestStore.documentId}` + '/workflow-history')
      .pipe(
        map((res: WorkflowHistoryPagination) => { 
          documentWorkFlowStore.setWorkflowHistory(res);
          return res;
        })
      );
  }

  getWorkflowHistoryNew(): Observable<CRWorkflowHistoryPagination> {
    return this._http
      .get<CRWorkflowHistoryPagination>('/document-change-requests/' + `${changeRequestStore.documentId}` + '/workflow-history')
      .pipe(
        map((res: CRWorkflowHistoryPagination) => { 
          //documentWorkFlowStore.setWorkflowHistory(res);
          changeRequestStore.setWorkflowHistory(res)
          return res;
        })
      );
  }
  
  checkoutDocument() {
    return this._http.post('/document-change-requests/'+`${changeRequestStore.documentId}`+`/checkout`,null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_checked_out');
      return res;
    }))
  }

  checkinDocument(Document) {
    return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/checkin`,Document).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_checked_in');
      return res;
    }))
  }

    // Version File (Single)
    setCheckinFile(imageDetails, url) {
      documentWorkFlowStore.setCheckinFile(imageDetails,url);
    }
  
    getCheckinFile() {
      return documentWorkFlowStore.getCheckinFile;
    }
}
