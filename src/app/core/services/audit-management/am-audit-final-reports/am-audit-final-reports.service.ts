import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmFinalReport } from 'src/app/core/models/audit-management/am-audit-field-work/am-audit-final-reports';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmFinalReportStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-final-report-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';


@Injectable({
  providedIn: 'root'
})
export class AmAuditFinalReportsService {

 
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

     
  getItems(audit_id,additionalParams?: string): Observable<AmFinalReport> {
    let params = '';
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_fieldwork_finding' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);     
      return this._http.get<AmFinalReport>('/am-audits/'+audit_id+'/final-reports'+ (params ? params : '')).pipe(
        map((res: AmFinalReport) => {
          AmFinalReportStore.setReports(res);
          return res;
        })
      );
    
  
  }

  saveItem(audit_id): Observable<any> {
    return this._http.post('/am-audits/'+audit_id+'/final-reports', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_final_report_added');
       
          this.getItems(audit_id).subscribe();
        
        
        return res;
      })
    );
  }
  updateItem(audit_id,report_id,id,data): Observable<any> {
    return this._http.put('/am-audits/'+audit_id+'/final-reports/'+report_id+'/contents/'+ id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_final_report_updated');
       
          this.getItems(audit_id).subscribe();
        
        
        return res;
      })
    );
  }

  delete(audit_id,report_id,id: number) {
    return this._http.delete('/am-audits/'+audit_id+'/final-reports/'+report_id+'/contents/'+ id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_final_content_deleted');
        this.getItems(audit_id).subscribe();
        return res;
      })
    );
  }

  deleteReport(audit_id) {
    return this._http.delete('/am-audits/'+audit_id+'/final-reports').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_final_report_deleted');
        this.getItems(audit_id).subscribe();
        return res;
      })
    );
  }

  export(id){
    return this._http.get(`/am-audit-final-reports/${id}/export`,{ responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        this._utilityService.downloadFile(res,'Final-report.pdf');
        return res;
      })
    );
  }

}
