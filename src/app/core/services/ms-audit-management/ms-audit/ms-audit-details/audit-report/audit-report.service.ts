import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { ActivityLogPaginationResponse, AuditReport } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-report';
import { AuditReportStore } from 'src/app/stores/ms-audit-management/ms-audit-report/ms-audit-report.store';

@Injectable({
  providedIn: 'root'
})
export class AuditReportService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  
    generateReport(){
      return this._http.post(`/ms-audits/${MsAuditStore.msAuditId}/reports`,null).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'generate_report_message');
          return res;
        })
      );
    }

    updateReport(updateData){
      return this._http.put(`/ms-audits/${MsAuditStore.msAuditId}/reports/${AuditReportStore.reportId}`,updateData).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'update_audit_report_message');
          return res;
        })
      );
    }

    getReport(): Observable<AuditReport> {
      return this._http.get<AuditReport>(`/ms-audits/${MsAuditStore.msAuditId}/reports/show`).pipe((
        map((res:AuditReport)=>{
          
          if(Array.isArray(res))
          AuditReportStore.setAuditReport(res,true);
           else
          AuditReportStore.setAuditReport(res,false);
          return res;
        })
      ))
    } 

    delete(reportId: number) {
      return this._http.delete(`/ms-audits/${MsAuditStore.msAuditId}/reports/${reportId}`).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'successfully_deleted_audit_report');
          return res;
        })
      );
    }

    getActivityLog(getAll: boolean = false,reportId:number, additionalParams?: string): Observable<ActivityLogPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditReportStore.currentPage}`;
      }
      if (additionalParams) params += additionalParams;
    
      return this._http.get<ActivityLogPaginationResponse>(`ms-audits/${MsAuditStore.msAuditId}/reports/${reportId}` + (params ? params : '')).pipe(
        map((res: ActivityLogPaginationResponse) => {
          AuditReportStore.setActivityLogs(res);
          return res;
        })
      );
    }

    saveReportAgenda(saveParams){
      return this._http.post(`/ms-audits/${MsAuditStore.msAuditId}/reports/${AuditReportStore.reportId}/agendas`,saveParams).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_report_agenda_message');
          return res;
        })
      );
    }
    updateReportAgenda(agendaId,saveParams){
      return this._http.put(`/ms-audits/${MsAuditStore.msAuditId}/reports/${AuditReportStore.reportId}/agendas/${agendaId}`,saveParams).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'update_report_agenda_message');
          return res;
        })
      );
    }

    deleteReportAgenda(agendaId){
      return this._http.delete(`/ms-audits/${MsAuditStore.msAuditId}/reports/${AuditReportStore.reportId}/agendas/${agendaId}`).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'delete_report_agenda_message');
          return res;
        })
      );
    }

    exportToPdf(id) {
     
      this._http.get('/ms-audits/'+id+'/reports/export-pdf', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "Audit-report.pdf");
        }
      )
    }
}
