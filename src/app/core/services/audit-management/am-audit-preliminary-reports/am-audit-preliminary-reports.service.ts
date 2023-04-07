import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmPreliminaryReport } from 'src/app/core/models/audit-management/am-audit-field-work/am-audit-preliminary-reports';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmPreliminaryReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-preliminary-report-store';
@Injectable({
  providedIn: 'root'
})
export class AmAuditPreliminaryReportsService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

     
  getItems(audit_id,additionalParams?: string): Observable<AmPreliminaryReport> {
    let params = '';
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
      return this._http.get<AmPreliminaryReport>('/am-audits/'+audit_id+'/preliminary-reports'+ (params ? params : '')).pipe(
        map((res: AmPreliminaryReport) => {
          AmPreliminaryReportStore.setReports(res);
          return res;
        })
      );
    
  
  }

  saveItem(audit_id): Observable<any> {
    return this._http.post('/am-audits/'+audit_id+'/preliminary-reports', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_preliminary_report_added');
       
          this.getItems(audit_id).subscribe();
        
        
        return res;
      })
    );
  }
  updateItem(audit_id,report_id,id,data): Observable<any> {
    return this._http.put('/am-audits/'+audit_id+'/preliminary-reports/'+report_id+'/contents/'+ id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_preliminary_report_updated');
       
          this.getItems(audit_id).subscribe();
        
        
        return res;
      })
    );
  }

  delete(audit_id,report_id,id: number) {
    return this._http.delete('/am-audits/'+audit_id+'/preliminary-reports/'+report_id+'/contents/'+ id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_preliminary_content_deleted');
        this.getItems(audit_id).subscribe();
        return res;
      })
    );
  }

  deleteReport(audit_id) {
    return this._http.delete('/am-audits/'+audit_id+'/preliminary-reports').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_preliminary_report_deleted');
        this.getItems(audit_id).subscribe();
        return res;
      })
    );
  }

  export(id){
    return this._http.get(`/am-audit-preliminary-reports/${id}/export`,{ responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        this._utilityService.downloadFile(res,'Preliminary-report.pdf');
        return res;
      })
    );
  }
}
