import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExercisesWorkflowDetail, TestAndExercisesWorkflowHistoryPaginationResponse } from 'src/app/core/models/bcm/test-and-exercise/test-and-exercise-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExercisesWorkflowStore } from 'src/app/stores/bcm/test-exercise/test-and-exercises-workflow.store';
@Injectable({
  providedIn: 'root'
})
export class TestAndExercisesWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<TestAndExercisesWorkflowDetail> {
    return this._http.get<TestAndExercisesWorkflowDetail>('/test-and-exercises/'+id+'/workflow').pipe((
      map((res:TestAndExercisesWorkflowDetail)=>{
        TestAndExercisesWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<TestAndExercisesWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${TestAndExercisesWorkflowStore.currentPage}`;
    return this._http.get<TestAndExercisesWorkflowHistoryPaginationResponse>('/test-and-exercises/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: TestAndExercisesWorkflowHistoryPaginationResponse) => {
        TestAndExercisesWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitTestAndExercise(id) {
    return this._http.put('/test-and-exercises/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_submit');
        
        return res;
      })
    );
  }

  approveTestAndExercise(id,comment) {
    return this._http.put('/test-and-exercises/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_approve');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertTestAndExercise(id,data) {
    return this._http.put('/test-and-exercises/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'test_and_exercise_reverted');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  
}
