import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { MockDrillStatusMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-status-store';
import { MockDrillStatusPaginationResponse, MockDrillStatusSingle } from 'src/app/core/models/masters/mock-drill/mock-drill-status';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MockDrillStatusService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  //  Sort Mock Drill List
  sortMockDrillStatusesList(type: string, text: string) {
    if (!MockDrillStatusMasterStore.orderBy) {
      MockDrillStatusMasterStore.orderBy = 'asc';
      MockDrillStatusMasterStore.orderItem = type;
    }
    else {
      if (MockDrillStatusMasterStore.orderItem == type) {
        if (MockDrillStatusMasterStore.orderBy == 'asc') MockDrillStatusMasterStore.orderBy = 'desc';
        else MockDrillStatusMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillStatusMasterStore.orderBy = 'asc';
        MockDrillStatusMasterStore.orderItem = type;
      }
    }
  }

  // Get Mock Drill List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page= ${MockDrillStatusMasterStore.currentPage}`;
      if (MockDrillStatusMasterStore.orderBy) params += `&order_by=${MockDrillStatusMasterStore.orderItem}&order=${MockDrillStatusMasterStore.orderBy}`;
    }
    if (MockDrillStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillStatusMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillStatusPaginationResponse>('/mock-drill-statuses' + (params ? params : '')).pipe(
      map((res: MockDrillStatusPaginationResponse) => {
        MockDrillStatusMasterStore.setMockDrillStatus(res);
        return res;
      })
    );
  }
  // Export Mock Drill Status
  exportToExcel() {
    this._http.get('/mock-drill-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_status') + ".xlsx");
      }
    )
  }

  // Activate Mock Drill Using Id
  activate(id: number) {
    return this._http.put('/mock-drill-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Deactivate Mock Drill Using Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
}
