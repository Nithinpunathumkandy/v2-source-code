import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SlaContractWorkflowDetail, SlaContractWorkflowHistoryPaginationResponse } from 'src/app/core/models/compliance-management/compliance-workflow/sla-contract-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SlaContractWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/sla-contract-workflow.store';


@Injectable({
  providedIn: 'root'
})
export class SlaContractWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<SlaContractWorkflowDetail> {
    return this._http.get<SlaContractWorkflowDetail>('/sla-and-contracts/'+id+'/workflow').pipe((
      map((res:SlaContractWorkflowDetail)=>{
        SlaContractWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<SlaContractWorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${SlaContractWorkflowStore.currentPage}`;
      if (SlaContractWorkflowStore.orderBy) params += `order=${SlaContractWorkflowStore.orderBy}`;
    return this._http.get<SlaContractWorkflowHistoryPaginationResponse>('/sla-and-contracts/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: SlaContractWorkflowHistoryPaginationResponse) => {
        SlaContractWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitInvestigation(id) {
    return this._http.put('/sla-and-contracts/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sla_submitted');
        
        return res;
      })
    );
  }

  approveIncidentInvestigation(id,comment) {
    return this._http.put('/sla-and-contracts/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sla_approved');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertIncidentInvestigation(id,data) {
    return this._http.put('/sla-and-contracts/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'sla_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  reviewIncidentInvestigation(id) {
    return this._http.put('/sla-and-contracts/' + id+'/review',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('', 'sla_review');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
