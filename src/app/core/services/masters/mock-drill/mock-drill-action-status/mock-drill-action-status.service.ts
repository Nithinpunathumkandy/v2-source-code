import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillActionStatusPaginationResponse } from 'src/app/core/models/masters/mock-drill/mock-drill-action-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillActionStatusMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-action-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillActionStatusService {


  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  //  Sort Mock Drill List
  sortMockDrillStatusesList(type: string, text: string) {
    if (!MockDrillActionStatusMasterStore.orderBy) {
      MockDrillActionStatusMasterStore.orderBy = 'asc';
      MockDrillActionStatusMasterStore.orderItem = type;
    }
    else {
      if (MockDrillActionStatusMasterStore.orderItem == type) {
        if (MockDrillActionStatusMasterStore.orderBy == 'asc') MockDrillActionStatusMasterStore.orderBy = 'desc';
        else MockDrillActionStatusMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillActionStatusMasterStore.orderBy = 'asc';
        MockDrillActionStatusMasterStore.orderItem = type;
      }
    }
  }

  // Get Mock Drill List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillActionStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page= ${MockDrillActionStatusMasterStore.currentPage}`;
      if (MockDrillActionStatusMasterStore.orderBy) params += `&order_by=${MockDrillActionStatusMasterStore.orderItem}&order=${MockDrillActionStatusMasterStore.orderBy}`;
    }
    if (MockDrillActionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillActionStatusMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillActionStatusPaginationResponse>('/mock-drill-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: MockDrillActionStatusPaginationResponse) => {
        MockDrillActionStatusMasterStore.setMockDrillActionStatus(res);
        return res;
      })
    );
  }
  // Export Mock Drill Status
  exportToExcel() {
    this._http.get('/mock-drill-action-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_action_plan_status') + ".xlsx");
      }
    )
  }

 
}
