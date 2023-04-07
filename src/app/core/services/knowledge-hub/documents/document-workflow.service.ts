import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import {documentWorkFlowStore} from 'src/app/stores/knowledge-hub/documents/documentWorkFlow.store'
import {DocumentWorkflow,WorkflowHistoryPagination} from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow'
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
@Injectable({
  providedIn: 'root'
})


export class DocumentWorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }
  
  
    
    getWorkflow(id): Observable<DocumentWorkflow[]> {
      return this._http
        .get<DocumentWorkflow[]>('/documents/' + id + '/workflow')
        .pipe(
          map((res: DocumentWorkflow[]) => {
            documentWorkFlowStore.setDocumentWorkflow(res);
            return res;
          })
        );
    }
  
    submittDocument() {
      return this._http.put('/documents/'+`${DocumentsStore.documentId}`+`/submit`,null).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_submitted');
        return res;
      }))
  
    }
  
    publishDocument(comment) {
      return this._http.put('/documents/'+`${DocumentsStore.documentId}`+`/publish`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_published');
        return res;
      }))
  
    }
  
    revertDocument(comment) {
      return this._http.put('/documents/'+`${DocumentsStore.documentId}`+`/revert`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_reverted');
        return res;
      }))
  
    }
  
    rejectDocument(comment) {
      return this._http.put('/documents/'+`${DocumentsStore.documentId}`+`/reject`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_rejected');
        return res;
      }))
  
    }
  
    approveDocument(comment) {
      return this._http.put('/documents/'+`${DocumentsStore.documentId}`+`/approve`,comment).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'document_approved');
        return res;
      }))
  
  }
  
  getWorkflowHistory(): Observable<WorkflowHistoryPagination> {
    return this._http
      .get<WorkflowHistoryPagination>('/documents/' + `${DocumentsStore.documentId}` + '/workflow-history')
      .pipe(
        map((res: WorkflowHistoryPagination) => { 
          documentWorkFlowStore.setWorkflowHistory(res);
          return res;
        })
      );
  }
  
  checkoutDocument() {
    return this._http.post('/documents/'+`${DocumentsStore.documentId}`+`/checkout`,null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_checked_out');
      return res;
    }))
  }

  checkinDocument(Document) {
    return this._http.put('/documents/'+`${DocumentsStore.documentId}`+`/checkin`,Document).pipe(map(res=>{
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
