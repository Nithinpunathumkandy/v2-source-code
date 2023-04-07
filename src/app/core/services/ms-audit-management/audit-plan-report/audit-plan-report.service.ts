import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditPlanReportStore } from 'src/app/stores/ms-audit-management/ms-audit-plan-report/ms-audit-plan-report.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditPlanReportService {
  MsAuditPlansStore=MsAuditPlansStore;
  AuditPlanReportStore=AuditPlanReportStore;
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    generateReport(){
      return this._http.post(`/ms-audit-plan-reports/${MsAuditPlansStore.msAuditPlansId}`,null).pipe(
        map((res:any )=> {
          //this._utilityService.showSuccessMessage('success', 'generate_report_message');
          return res;
        })
      );
    }

    getReport(): Observable<any> {
      return this._http.get<any>(`/ms-audit-plan-reports/${MsAuditPlansStore.msAuditPlansId}/show`).pipe((
        map((res:any)=>{
          AuditPlanReportStore.setAuditPlanReport(res,true);
        })
      ))
    } 

    delete(reportId: number) {
      return this._http.delete(`/ms-audit-plan-reports/${reportId}`).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_audit_plan_successfully');
          return res;
        })
      );
    }

    exportToPdf(id) {
     
      this._http.get('/ms-audit-plan-reports/'+id+'/export-pdf', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "Audit-plan-report.pdf");
        }
      )
    }
}
