import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditDocument, AmAuditDocumentPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-audit-document';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditDocumentStore } from 'src/app/stores/audit-management/am-audit/am-audit-document.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditDocumentService {

  
  
  constructor(private _http:HttpClient,private _utilityService:UtilityService) { }
  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmAuditDocumentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditDocumentStore.currentPage}`;
      if (AmAuditDocumentStore.orderBy) params += `&order=${AmAuditDocumentStore.orderBy}`;
      if (AmAuditDocumentStore.orderItem) params += `&order_by=${AmAuditDocumentStore.orderItem}`;
      if (AmAuditDocumentStore.searchText) params += `&q=${AmAuditDocumentStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
     }

      return this._http.get<AmAuditDocumentPaginationResponse>('/am-audits/'+AmAuditsStore.auditId+'/documents'+ (params ? params : '')).pipe(
        map((res: AmAuditDocumentPaginationResponse) => {
          AmAuditDocumentStore.setAuditDocuments(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmAuditDocument> {
    return this._http.get<AmAuditDocument>('/am-audits/'+AmAuditsStore.auditId+'/documents/' + id).pipe(
      map((res: AmAuditDocument) => {
        AmAuditDocumentStore.setIndividualDocumentDetails(res);
         return res;
      })
    );
  }

  updateItem(request_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-audits/'+AmAuditsStore.auditId+'/documents/'+ request_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_document_updated');
        
        this.getItems().subscribe();
        return res;
      })
    );
  }

  
  saveItem(audit): Observable<any> {
    return this._http.post('/am-audits/'+AmAuditsStore.auditId+'/documents', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_document_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audits/'+AmAuditsStore.auditId+'/documents/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_document_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  
	setDocumentDetails(imageDetails, url) {
		AmAuditDocumentStore.setDocumentDetails(imageDetails, url);
	}
}
