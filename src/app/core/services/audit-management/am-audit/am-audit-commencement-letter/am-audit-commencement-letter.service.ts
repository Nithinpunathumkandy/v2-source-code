import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmCommencementLetter } from 'src/app/core/models/audit-management/am-audit/am-commencement-letter';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditCommencementLetterStore } from 'src/app/stores/audit-management/am-audit/am-audit-commencement-letter.store';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditCommencementLetterService {
  
  constructor(private _http:HttpClient,private _utilityService:UtilityService) { }

  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmCommencementLetter[]> {
    let params = '';
  

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      }

      return this._http.get<AmCommencementLetter[]>('/am-audit/'+AmAuditsStore.auditId+'/commencement-letters' + (params ? params : '')).pipe(
        map((res: AmCommencementLetter[]) => {
          AmAuditCommencementLetterStore.setCommencementLetter(res);
          return res;
        })
      );
    
  
  }

  
  getItem(id: number): Observable<AmCommencementLetter> {
    return this._http.get<AmCommencementLetter>('/am-audit/'+AmAuditsStore.auditId+'/commencement-letters/' + id).pipe(
      map((res: AmCommencementLetter) => {
        AmAuditCommencementLetterStore.setIndividualCommencementLetter(res);
        return res;
      })
    );
  }

  updateItem(id:number, letterSettings): Observable<any> {
    return this._http.put('/am-audit/'+AmAuditsStore.auditId+'/commencement-letters/'+ id, letterSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_commencement_letter_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  sendEmail(id: number) {
    return this._http.get('/am-audit/'+AmAuditsStore.auditId+'/commencement-letters/' + id+ '/send-email').pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'am_audit_commencement_letter_email_success');
        return res;
      })
    );
  }

}
