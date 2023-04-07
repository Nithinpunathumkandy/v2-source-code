import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditDoc } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/ms-document';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditDocStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-details/ms-document-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getItems(): Observable<MsAuditDoc[]> {
   
    return this._http.get<MsAuditDoc[]>(`/ms-audits/${MsAuditStore.msAuditId}/documents`).pipe(
      map((res: MsAuditDoc[]) => {
        MsAuditDocStore.setMsAuditDoc(res);
        return res;
      })
    );
  }

  delete(msAuditId: number, documentId: number){
    return this._http.delete(`/ms-audits/${msAuditId}/documents/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_document_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }
 

  saveData(msAuditId: number,item: any) {
    return this._http.post(`/ms-audits/${msAuditId}/documents`, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_document_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }


  
}
