import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditPlanWorkflowDetail, AuditPlanWorkflowHistoryPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan-workflow";
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmFinalReportWorkflowStore } from 'src/app/stores/audit-management/am-audit-field-work/am-final-report-workflow.store';
// import { AmAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';
import { AmAuditFieldWorkStore } from 'src/app/stores/audit-management/am-audit-field-work/am-audit-field-work.store';
import { AmAuditFieldWorkService } from '../../am-audit-field-work.service';
// import { AmAuditFieldWorkService } from '../am-audit-field-work.service';

@Injectable({
  providedIn: 'root'
})
export class AmFinalWorkflowService {

 
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _auditFieldworkSevice:AmAuditFieldWorkService) { }
    getItems(id): Observable<AuditPlanWorkflowDetail> {
      return this._http.get<AuditPlanWorkflowDetail>('/am-audit-final-reports/'+id+'/workflow').pipe((
        map((res:AuditPlanWorkflowDetail)=>{
          AmFinalReportWorkflowStore.setWorkflowDetails(res);
          return res;
        })
      ))
    }
  
    getHistory(id): Observable<AuditPlanWorkflowHistoryPaginationResponse> {
      let params = '';
      
        params = `?page=${AmFinalReportWorkflowStore.currentPage}`;
        if (AmFinalReportWorkflowStore.orderBy) params += `&order_by=${AmFinalReportWorkflowStore.orderItem}&order=${AmFinalReportWorkflowStore.orderBy}`;
      
      
      
      return this._http.get<AuditPlanWorkflowHistoryPaginationResponse>('/am-audit-final-reports/'+id+'/workflow-history' + (params ? params : '')).pipe(
        map((res: AuditPlanWorkflowHistoryPaginationResponse) => {
          AmFinalReportWorkflowStore.setWorkflowHistory(res);
          return res;
        })
      );
    }
  
  
    submitReport(id) {
      return this._http.put('/am-audit-final-reports/' + id+'/submit',id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'am_report_submitted_review');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }
  
    approveReport(id,comment) {
      return this._http.put('/am-audit-final-reports/' + id+'/approve',comment).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'am_report_approved');
          this.getItems(id).subscribe();
          if(AmAuditFieldWorkStore.auditFieldWorkId)
          this._auditFieldworkSevice.getItem(AmAuditFieldWorkStore.auditFieldWorkId).subscribe();
          return res;
        })
      );
    }
  
    revertReport(id,data) {
      return this._http.put('/am-audit-final-reports/' + id+'/revert',data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'am_report_reverted');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }
    reviewReport(id) {
      return this._http.put('/am-audit-final-reports/' + id+'/review',id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('', 'report_review');
          this.getItems(id).subscribe();
          return res;
        })
      );
    }
}
