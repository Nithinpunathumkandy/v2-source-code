import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLogPaginationResponse, AnnualSummary } from 'src/app/core/models/ms-audit-management/ms-audit-annual-summary/ms-audit-annual-summary';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditProgramSummaryReportStore } from 'src/app/stores/ms-audit-management/audit-program-summary-report/audit-program-summary-report.store';
import { AnnualSummaryStore } from 'src/app/stores/ms-audit-management/ms-audit-annual-summary/ms-audit-annual-summary.store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';


@Injectable({
  providedIn: 'root'
})
export class AnnualSummaryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    generateSummary(){
      return this._http.post(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/annual-summary-reports`,null).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'generate_summary_message');
          return res;
        })
      );
    }

    updateSummary(reportId:number,updateData){
      return this._http.put(`/ms-audit-annual-summary-reports/${AuditProgramSummaryReportStore.selectedReportId}/content-updates/${reportId}`,updateData).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'update_summary_message');
          return res;
        })
      );
    }

    getSummary(): Observable<AnnualSummary> {
      return this._http.get<AnnualSummary>(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/annual-summary-reports/show`).pipe((
        map((res:AnnualSummary)=>{
          
          if(Array.isArray(res))
          AnnualSummaryStore.setAnnualSummary(res,true);
           else
          AnnualSummaryStore.setAnnualSummary(res,false);
          return res;
        })
      ))
    } 

    delete(reportId: number) {
      return this._http.delete(`/ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/annual-summary-reports/${reportId}`).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_annual_summary_message');
          
          // this.getItems().subscribe(resp=>{
          //   if(resp.from==null){
          //     AuditReportsStore.setCurrentPage(resp.current_page-1);
          //     this.getItems().subscribe();
          //   }
          // });
  
          return res;
        })
      );
    }

    getActivityLog(getAll: boolean = false,reportId:number, additionalParams?: string): Observable<ActivityLogPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AnnualSummaryStore.currentPage}`;
      }
      if (additionalParams) params += additionalParams;
    
      return this._http.get<ActivityLogPaginationResponse>(`ms-audit-programs/${MsAuditProgramsStore.msAuditProgramsId}/annual-summary-reports/${reportId}` + (params ? params : '')).pipe(
        map((res: ActivityLogPaginationResponse) => {
          AnnualSummaryStore.setActivityLogs(res);
          return res;
        })
      );
    }
}
