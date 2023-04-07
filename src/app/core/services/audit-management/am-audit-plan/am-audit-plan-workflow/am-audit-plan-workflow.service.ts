import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditPlanWorkflowDetail, AuditPlanWorkflowHistoryPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan-workflow";
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditPlanWorkflowService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }
   getItems(id): Observable<AuditPlanWorkflowDetail> {
    return this._http.get<AuditPlanWorkflowDetail>('/am-annual-plans/'+id+'/workflow').pipe((
      map((res:AuditPlanWorkflowDetail)=>{
        AmAuditPlanWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<AuditPlanWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${AmAuditPlanWorkflowStore.currentPage}`;
      if (AmAuditPlanWorkflowStore.orderBy) params += `&order_by=${AmAuditPlanWorkflowStore.orderItem}&order=${AmAuditPlanWorkflowStore.orderBy}`;
    
    
    
    return this._http.get<AuditPlanWorkflowHistoryPaginationResponse>('/am-annual-plans/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: AuditPlanWorkflowHistoryPaginationResponse) => {
        AmAuditPlanWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }


  submitAuditPlan(id) {
    return this._http.put('/am-annual-plans/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_submitted_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  approveAuditPlan(id,comment) {
    return this._http.put('/am-annual-plans/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertAuditPlan(id,data) {
    return this._http.put('/am-annual-plans/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewAuditPlan(id) {
    return this._http.put('/am-annual-plans/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'audit_plan_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
