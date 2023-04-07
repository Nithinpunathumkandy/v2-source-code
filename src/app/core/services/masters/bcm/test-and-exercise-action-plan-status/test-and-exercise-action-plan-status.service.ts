import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExerciseActionPlanStatusPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-action-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseActionPlanStatusMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-action-plan-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseActionPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<TestAndExerciseActionPlanStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${TestAndExerciseActionPlanStatusMasterStore.currentPage}`;
      if (TestAndExerciseActionPlanStatusMasterStore.orderBy) params += `&order_by=${TestAndExerciseActionPlanStatusMasterStore.orderItem}&order=${TestAndExerciseActionPlanStatusMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (TestAndExerciseActionPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + TestAndExerciseActionPlanStatusMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<TestAndExerciseActionPlanStatusPaginationResponse>('/test-and-exercise-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: TestAndExerciseActionPlanStatusPaginationResponse) => {
        TestAndExerciseActionPlanStatusMasterStore.setTestAndExerciseActionPlanStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/test-and-exercise-action-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_action_plan_status') + ".xlsx");
      }
    )
  }

  activate(id: number) {
		return this._http.put('/test-and-exercise-action-plan-statuses/'+id+'/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_action_plan_status_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  deactivate(id: number) {
		return this._http.put('/test-and-exercise-action-plan-statuses/'+id+'/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'test_and_exercise_action_plan_status_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  sortTestAndExerciseActionPlanStatus(type: string, text: string) {
    if (!TestAndExerciseActionPlanStatusMasterStore.orderBy) {
      TestAndExerciseActionPlanStatusMasterStore.orderBy = 'asc';
      TestAndExerciseActionPlanStatusMasterStore.orderItem = type;
    }
    else {
      if (TestAndExerciseActionPlanStatusMasterStore.orderItem == type) {
        if (TestAndExerciseActionPlanStatusMasterStore.orderBy == 'asc') TestAndExerciseActionPlanStatusMasterStore.orderBy = 'desc';
        else TestAndExerciseActionPlanStatusMasterStore.orderBy = 'asc'
      }
      else {
        TestAndExerciseActionPlanStatusMasterStore.orderBy = 'asc';
        TestAndExerciseActionPlanStatusMasterStore.orderItem = type;
      }
    }
  }
}