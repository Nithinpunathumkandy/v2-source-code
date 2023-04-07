import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionPlanflowHistoryPaginationResponse } from 'src/app/core/models/strategy-management/action-plan-workflow.model';
import { KpiflowDetail } from 'src/app/core/models/strategy-management/kpi-workflow.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ActionPlanWorkflowStore } from 'src/app/stores/strategy-management/action-plan-workflow.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ActionPlanWorkflowService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(id): Observable<KpiflowDetail> {
    return this._http.get<KpiflowDetail>('/strategy-initiative-action-plans/'+ActionPlansStore.selectedActionPlanId+'/review-frequency/'+id+'/review').pipe((
      map((res:KpiflowDetail)=>{
        ActionPlanWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<ActionPlanflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${ActionPlanWorkflowStore.currentPage}`;
    return this._http.get<ActionPlanflowHistoryPaginationResponse>('/strategy-initiative-action-plans/'+ActionPlansStore.selectedActionPlanId+'/review-frequency/'+id+'/review-history' + (params ? params : '')).pipe(
      map((res: ActionPlanflowHistoryPaginationResponse) => {
        ActionPlanWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProject(id,item?) {
    return this._http.put('/strategy-initiative-action-plans/'+ActionPlansStore.selectedActionPlanId+'/review-frequency/'+id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Action plan review  submitted successfuly');
        
        return res;
      })
    );
  }

  approveProject(id,comment) {
    return this._http.put('/strategy-initiative-action-plans/'+ActionPlansStore.selectedActionPlanId+'/review-frequency/'+id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Action plan review approved successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertProject(id,data) {
    return this._http.put('/strategy-initiative-action-plans/'+ActionPlansStore.selectedActionPlanId+'/review-frequency/'+id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Action plan review reverted successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/strategy-initiative-action-plans/'+ActionPlansStore.selectedActionPlanId+'/review-frequency/'+id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Action plan review rejected successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
