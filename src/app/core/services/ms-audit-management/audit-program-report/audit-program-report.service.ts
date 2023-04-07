import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActivityLogs, AuditReport, ActivityLogPaginationResponse } from "src/app/core/models/ms-audit-management/audit-program-report/audit-program-report";
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { AuditProgramReportStore } from 'src/app/stores/ms-audit-management/audit-program-report/audit-program-report.store';

@Injectable({
  providedIn: 'root'
})
export class AuditProgramReportService {
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  
    generateReport(){
      return this._http.post(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports`,null).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'generate_report_message');
          return res;
        })
      );
    }
    
    updateReport(updateData){
      return this._http.put(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/${AuditProgramReportStore.reportId}`,updateData).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'update_audit_report_message');
          return res;
        })
      );
    }

    getReport(): Observable<AuditReport> {
      return this._http.get<AuditReport>(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/show`).pipe((
        map((res:AuditReport)=>{
          
          if(Array.isArray(res))
          AuditProgramReportStore.setAuditReport(res,true);
           else
          AuditProgramReportStore.setAuditReport(res,false);
          return res;
        })
      ))
    } 

    delete(reportId: number) {
      return this._http.delete(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/${reportId}`).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_annual_summary_message');
          return res;
        })
      );
    }

    getActivityLog(getAll: boolean = false,reportId:number, additionalParams?: string): Observable<ActivityLogPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditProgramReportStore.currentPage}`;
      }
      if (additionalParams) params += additionalParams;
    
      return this._http.get<ActivityLogPaginationResponse>(`ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/${reportId}` + (params ? params : '')).pipe(
        map((res: ActivityLogPaginationResponse) => {
          AuditProgramReportStore.setActivityLogs(res);
          return res;
        })
      );
    }

    saveReportAgenda(saveParams){
      return this._http.post(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/${AuditProgramReportStore.reportId}/agendas`,saveParams).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_report_agenda_message');
          return res;
        })
      );
    }
    updateReportAgenda(agendaId,saveParams){
      return this._http.put(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/${AuditProgramReportStore.reportId}/agendas/${agendaId}`,saveParams).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'update_report_agenda_message');
          return res;
        })
      );
    }

    deleteReportAgenda(agendaId){
      return this._http.delete(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/reports/${AuditProgramReportStore.reportId}/agendas/${agendaId}`).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'delete_report_agenda_message');
          return res;
        })
      );
    }
}
