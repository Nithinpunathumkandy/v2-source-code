import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditPlanWorkflowStore } from 'src/app/stores/ms-audit-management/audit-plan-workflow/audit-plan-workflow.store';
import { AuditWorkflowDetail, AuditWorkflowHistoryPaginationResponse } from 'src/app/core/models/ms-audit-management/audit-plan-workflow/audit-plan-workflow';

@Injectable({
  providedIn: 'root'
})
export class AuditPlanWorkflowService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(id): Observable<AuditWorkflowDetail> {
    return this._http.get<AuditWorkflowDetail>('/ms-audit-plans/'+id+'/workflow').pipe((
      map((res:AuditWorkflowDetail)=>{
        AuditPlanWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<AuditWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${AuditPlanWorkflowStore.currentPage}`;
    return this._http.get<AuditWorkflowHistoryPaginationResponse>('/ms-audit-plans/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: AuditWorkflowHistoryPaginationResponse) => {
        AuditPlanWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProject(id,item?) {
    return this._http.put('/ms-audit-plans/' + id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_plan_submitted');
        
        return res;
      })
    );
  }

  approveWorkflow(id,comment) {
    return this._http.put('/ms-audit-plans/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_plan_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertWorkflow(id,data) {
    return this._http.put('/ms-audit-plans/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_plan_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/ms-audit-plans/' + id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_plan_rejected');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  
}
