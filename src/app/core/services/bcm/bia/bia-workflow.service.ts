import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaWorkflowDetail, BiaWorkflowHistoryPaginationResponse } from 'src/app/core/models/bcm/bia/bia-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiaWorkflowStore } from 'src/app/stores/bcm/bia/bia-workflow.store';
@Injectable({
  providedIn: 'root'
})
export class BiaWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<BiaWorkflowDetail> {
    return this._http.get<BiaWorkflowDetail>('/business-impact-analyses/'+id+'/workflow').pipe((
      map((res:BiaWorkflowDetail)=>{
        BiaWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<BiaWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${BiaWorkflowStore.currentPage}`;
    return this._http.get<BiaWorkflowHistoryPaginationResponse>('/business-impact-analyses/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: BiaWorkflowHistoryPaginationResponse) => {
        BiaWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitBia(id) {
    return this._http.put('/business-impact-analyses/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_submit');
        
        return res;
      })
    );
  }

  approveBia(id,comment) {
    return this._http.put('/business-impact-analyses/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_approve');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertBia(id,data) {
    return this._http.put('/business-impact-analyses/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bia_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  
}
