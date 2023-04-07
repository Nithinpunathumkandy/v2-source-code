import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestAndExerciseStatusesPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-statuses';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseStatusesMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-statuses-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class TestAndExerciseStatusesService {

  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<TestAndExerciseStatusesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${TestAndExerciseStatusesMasterStore.currentPage}`;
      if (TestAndExerciseStatusesMasterStore.orderBy) params += `&order_by=${TestAndExerciseStatusesMasterStore.orderItem}&order=${TestAndExerciseStatusesMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (TestAndExerciseStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + TestAndExerciseStatusesMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<TestAndExerciseStatusesPaginationResponse>('/test-and-exercise-statuses' + (params ? params : '')).pipe(
      map((res: TestAndExerciseStatusesPaginationResponse) => {
        TestAndExerciseStatusesMasterStore.setTestAndExerciseStatuses(res);
        return res;
      })
    );
  }
  exportToExcel() {
    this._http.get('/test-and-exercise-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('test_and_exercise_statuses') + ".xlsx");
      }
    )
  }

  sortBcsStatus(type: string, text: string) {
    if (!TestAndExerciseStatusesMasterStore.orderBy) {
      TestAndExerciseStatusesMasterStore.orderBy = 'asc';
      TestAndExerciseStatusesMasterStore.orderItem = type;
    }
    else {
      if (TestAndExerciseStatusesMasterStore.orderItem == type) {
        if (TestAndExerciseStatusesMasterStore.orderBy == 'asc') TestAndExerciseStatusesMasterStore.orderBy = 'desc';
        else TestAndExerciseStatusesMasterStore.orderBy = 'asc'
      }
      else {
        TestAndExerciseStatusesMasterStore.orderBy = 'asc';
        TestAndExerciseStatusesMasterStore.orderItem = type;
      }
    }
  }
}
