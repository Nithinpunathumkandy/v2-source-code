import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditPlanWorkflowDetail, AuditPlanWorkflowHistoryPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan-workflow";
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmCsaService } from '../am-csa/am-csa.service';
import { AmCSAWorkflowStore } from 'src/app/stores/audit-management/am-csa/am-csa-workflow.store';
import { AmCSAStore } from 'src/app/stores/audit-management/am-csa/am-csa.store';

@Injectable({
  providedIn: 'root'
})
export class AmCSAWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService,
    private _csaService:AmCsaService
  ) { }

  getItems(id, individual_audit_plan_id?): Observable<AuditPlanWorkflowDetail> {
    return this._http.get<AuditPlanWorkflowDetail>(`/am-audit-control-self-assessments/${id}/workflow`).pipe((
      map((res: AuditPlanWorkflowDetail) => {
        AmCSAWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id, individual_audit_plan_id?): Observable<AuditPlanWorkflowHistoryPaginationResponse> {
    let params = '';

    params = `?page=${AmCSAWorkflowStore.currentPage}`;
    if (AmCSAWorkflowStore.orderBy) params += `&order_by=${AmCSAWorkflowStore.orderItem}&order=${AmCSAWorkflowStore.orderBy}`;
    return this._http.get<AuditPlanWorkflowHistoryPaginationResponse>(`/am-audit-control-self-assessments/${id}/workflow-history`).pipe(
      map((res: AuditPlanWorkflowHistoryPaginationResponse) => {
        AmCSAWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitAuditPlan(id) {
    return this._http.put(`/am-audit-control-self-assessments/${id}/submit`, '').pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'csa_workflow_submitted_review');

        // this.getItems(id, individual_audit_plan_id).subscribe();
        this._csaService.getItem(AmCSAStore.csaId).subscribe();
        return res;
      })
    );
  }

  approveCSA(id, comment) {
    return this._http.put(`/am-audit-control-self-assessments/${id}/approve`, comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'csa_workflow_approved');
        // this.getItems(id, individual_audit_plan_id).subscribe();
        this._csaService.getItem(AmCSAStore.csaId).subscribe();
        return res;
      })
    );
  }

  revertCSA(id, data) {
    return this._http.put(`/am-audit-control-self-assessments/${id}/revert`,data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'csa_workflow_reverted');
        // this.getItems(id, individual_audit_plan_id).subscribe();
        this._csaService.getItem(AmCSAStore.csaId).subscribe();
        return res;
      })
    );
  }
}
