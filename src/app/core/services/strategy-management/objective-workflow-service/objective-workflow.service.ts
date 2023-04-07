import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { ObjectiveWorkflowHistoryPaginationResponse, ObjectiveWorkflowDetail } from 'src/app/core/models/strategy-management/objective-workflow.model';
import { ObjectiveWorkflowStore } from 'src/app/stores/strategy-management/objective-workflow.store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';


@Injectable({
  providedIn: 'root'
})
export class ObjectiveWorkflowService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(id): Observable<ObjectiveWorkflowDetail> {
    return this._http.get<ObjectiveWorkflowDetail>('/strategy-profile-objective/'+ObjectiveScoreStore.selectedobjectiveId+'/review-frequency/'+id+'/review').pipe((
      map((res:ObjectiveWorkflowDetail)=>{
        ObjectiveWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<ObjectiveWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${ObjectiveWorkflowStore.currentPage}`;
    return this._http.get<ObjectiveWorkflowHistoryPaginationResponse>('/strategy-profile-objective/'+ObjectiveScoreStore.selectedobjectiveId+'/review-frequency/'+id+'/review-history' + (params ? params : '')).pipe(
      map((res: ObjectiveWorkflowHistoryPaginationResponse) => {
        ObjectiveWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProject(id,item?) {
    return this._http.put('/strategy-profile-objective/'+ObjectiveScoreStore.selectedobjectiveId+'/review-frequency/'+ id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Objective review  submitted successfuly');
        
        return res;
      })
    );
  }

  approveProject(id,comment) {
    return this._http.put('/strategy-profile-objective/'+ObjectiveScoreStore.selectedobjectiveId+'/review-frequency/'+id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Objective review approved successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertProject(id,data) {
    return this._http.put('/strategy-profile-objective/'+ObjectiveScoreStore.selectedobjectiveId+'/review-frequency/'+id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Objective review reverted successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/strategy-profile-objective/'+ObjectiveScoreStore.selectedobjectiveId+'/review-frequency/'+id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Objective review rejected successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  
}
