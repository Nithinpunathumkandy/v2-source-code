import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmDraftReport } from 'src/app/core/models/audit-management/am-audit-field-work/am-audit-draft-reports';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmDraftReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-draft-report-store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditDraftReportsService {

 
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

     
  getItems(audit_id,additionalParams?: string): Observable<AmDraftReport> {
    let params = '';
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmDraftReport>('/am-audits/'+audit_id+'/draft-reports'+ (params ? params : '')).pipe(
        map((res: AmDraftReport) => {
          AmDraftReportStore.setReports(res);
          return res;
        })
      );
    
  
  }

  saveItem(audit_id): Observable<any> {
    return this._http.post('/am-audits/'+audit_id+'/draft-reports', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_draft_report_added');
       
          this.getItems(audit_id).subscribe();
        
        
        return res;
      })
    );
  }
  updateItem(audit_id,report_id,id,data): Observable<any> {
    return this._http.put('/am-audits/'+audit_id+'/draft-reports/'+report_id+'/contents/'+ id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_draft_report_updated');
       
          this.getItems(audit_id).subscribe();
        
        
        return res;
      })
    );
  }

  delete(audit_id,report_id,id: number) {
    return this._http.delete('/am-audits/'+audit_id+'/draft-reports/'+report_id+'/contents/'+ id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_draft_content_deleted');
        this.getItems(audit_id).subscribe();
        return res;
      })
    );
  }

  deleteReport(audit_id) {
    return this._http.delete('/am-audits/'+audit_id+'/draft-reports').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_draft_report_deleted');
        this.getItems(audit_id).subscribe();
        return res;
      })
    );
  }

  export(id){
    return this._http.get(`/am-audit-draft-reports/${id}/export`,{ responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        this._utilityService.downloadFile(res,'Draft-report.pdf');
        return res;
      })
    );
  }

}
