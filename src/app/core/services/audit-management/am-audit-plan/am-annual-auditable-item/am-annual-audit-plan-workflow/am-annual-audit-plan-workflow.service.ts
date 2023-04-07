import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditPlanWorkflowDetail, AuditPlanWorkflowHistoryPaginationResponse } from "src/app/core/models/audit-management/am-audit-plan/am-audit-plan-workflow";
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAnnualAuditPlanWorkflowStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan-workflow.store';
import { AmAuditPlanService } from '../../am-audit-plan.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAnnualAuditPlanService } from '../am-annual-audit-plan.service';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';

@Injectable({
  providedIn: 'root'
})
export class AmAnnualAuditPlanWorkflowService {
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _individualAuditPlanService:AmAnnualAuditPlanService) { }
   getItems(id,individual_audit_plan_id): Observable<AuditPlanWorkflowDetail> {
    return this._http.get<AuditPlanWorkflowDetail>('/am-annual-plans/'+id+'/individual-audit-plans/'+individual_audit_plan_id+'/workflow').pipe((
      map((res:AuditPlanWorkflowDetail)=>{
        AmAnnualAuditPlanWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id,individual_audit_plan_id): Observable<AuditPlanWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${AmAnnualAuditPlanWorkflowStore.currentPage}`;
      if (AmAnnualAuditPlanWorkflowStore.orderBy) params += `&order_by=${AmAnnualAuditPlanWorkflowStore.orderItem}&order=${AmAnnualAuditPlanWorkflowStore.orderBy}`;
    
    
    
    return this._http.get<AuditPlanWorkflowHistoryPaginationResponse>('/am-annual-plans/'+id+'/individual-audit-plans/'+individual_audit_plan_id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: AuditPlanWorkflowHistoryPaginationResponse) => {
        AmAnnualAuditPlanWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitAuditPlan(id,individual_audit_plan_id) {
    return this._http.put('/am-annual-plans/' + id+'/individual-audit-plans/'+individual_audit_plan_id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_annual_audit_plan_submitted_review');

        this.getItems(id,individual_audit_plan_id).subscribe();
        this._individualAuditPlanService.getItem(AmAnnualAuditPlansStore?.individualAnnualAuditPlanDetails?.id).subscribe();
        return res;
      })
    );
  }

  approveAuditPlan(id,individual_audit_plan_id,comment) {
    return this._http.put('/am-annual-plans/' + id+'/individual-audit-plans/'+individual_audit_plan_id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_annual_audit_plan_approved');
        this.getItems(id,individual_audit_plan_id).subscribe();
        this._individualAuditPlanService.getItem(AmAnnualAuditPlansStore?.individualAnnualAuditPlanDetails?.id).subscribe();
        return res;
      })
    );
  }

  revertAuditPlan(id,individual_audit_plan_id,data) {
    return this._http.put('/am-annual-plans/' + id+'/individual-audit-plans/'+individual_audit_plan_id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_annual_audit_plan_reverted');
        this.getItems(id,individual_audit_plan_id).subscribe();
        this._individualAuditPlanService.getItem(AmAnnualAuditPlansStore?.individualAnnualAuditPlanDetails?.id).subscribe();
        return res;
      })
    );
  }

}
