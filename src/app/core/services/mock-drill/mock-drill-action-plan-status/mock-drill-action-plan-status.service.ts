import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillActionPlanStatusPaginationResponse } from 'src/app/core/models/mock-drill/mock-action-plan-status/mock-action-plan-status';
import { MockDrillActionPlanStatusStore } from 'src/app/stores/mock-drill/mock-drill-action-plan-status/mock-drill-action-plan-status-store';
import { MockDrillActionPlanStore } from 'src/app/stores/mock-drill/mock-drill-action-plan/mock-drill-action-plan-store';

@Injectable({
  providedIn: 'root'
})
export class MockDrillActionPlanStatusService {

  constructor(private _http: HttpClient) { }

  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillActionPlanStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillActionPlanStatusStore.currentPage}`;
      if (MockDrillActionPlanStatusStore.orderBy) params += `&order_by=${MockDrillActionPlanStatusStore.orderItem}&order=${MockDrillActionPlanStatusStore.orderBy}`;
    }
    if (MockDrillActionPlanStatusStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillActionPlanStatusStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillActionPlanStatusPaginationResponse>('/mock-drill-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: MockDrillActionPlanStatusPaginationResponse) => {
        MockDrillActionPlanStatusStore.setMockDrillActionPlanStatus(res);
        return res;
      })
    );
  }

  sortMeetingActionPlanStatusList(type: string) {
    if (!MockDrillActionPlanStatusStore.orderBy) {
      MockDrillActionPlanStatusStore.orderBy = 'asc';
      MockDrillActionPlanStatusStore.orderItem = type;
    }
    else {
      if (MockDrillActionPlanStatusStore.orderItem == type) {
        if (MockDrillActionPlanStatusStore.orderBy == 'asc') MockDrillActionPlanStatusStore.orderBy = 'desc';
        else MockDrillActionPlanStatusStore.orderBy = 'asc'
      }
      else {
        MockDrillActionPlanStatusStore.orderBy = 'asc';
        MockDrillActionPlanStatusStore.orderItem = type;
      }
    }
  }
}
