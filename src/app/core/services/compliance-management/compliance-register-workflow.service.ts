import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceRegisterWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/compliance-register-workflow.store';
import { ComplianceRegisterWorkflowDetail, ComplianceRegisterWorkflowHistoryPaginationResponse } from '../../models/compliance-management/compliance-workflow/compliance-register-workflow';

@Injectable({
  providedIn: 'root'
})
export class ComplianceRegisterWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<ComplianceRegisterWorkflowDetail> {
    return this._http.get<ComplianceRegisterWorkflowDetail>('/compliance/'+id+'/workflow').pipe((
      map((res:ComplianceRegisterWorkflowDetail)=>{
        ComplianceRegisterWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<ComplianceRegisterWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${ComplianceRegisterWorkflowStore.currentPage}`;
      // if (ComplianceRegisterWorkflowStore.orderBy) params += `&order_by=impact_analysis.title&order=${ComplianceRegisterWorkflowStore.orderBy}`;
    return this._http.get<ComplianceRegisterWorkflowHistoryPaginationResponse>('/compliance/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: ComplianceRegisterWorkflowHistoryPaginationResponse) => {
        ComplianceRegisterWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitInvestigation(id) {
    return this._http.put('/compliance/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_register_submitted');
        
        return res;
      })
    );
  }

  approveIncidentInvestigation(id,comment) {
    return this._http.put('/compliance/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_register_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertIncidentInvestigation(id,data) {
    return this._http.put('/compliance/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_register_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewIncidentInvestigation(id) {
    return this._http.put('/compliance/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'compliance_register_reviewed');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
