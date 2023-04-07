import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillProgramStatusMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-program-status-store';
import { MockDrillProgramStatusPaginationResponse } from 'src/app/core/models/masters/mock-drill/mock-drill-program-status';

@Injectable({
  providedIn: 'root'
})
export class MockDrillProgramStatusService {


  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  //  Sort Mock Drill List
  sortMockDrillStatusesList(type: string, text: string) {
    if (!MockDrillProgramStatusMasterStore.orderBy) {
      MockDrillProgramStatusMasterStore.orderBy = 'asc';
      MockDrillProgramStatusMasterStore.orderItem = type;
    }
    else {
      if (MockDrillProgramStatusMasterStore.orderItem == type) {
        if (MockDrillProgramStatusMasterStore.orderBy == 'asc') MockDrillProgramStatusMasterStore.orderBy = 'desc';
        else MockDrillProgramStatusMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillProgramStatusMasterStore.orderBy = 'asc';
        MockDrillProgramStatusMasterStore.orderItem = type;
      }
    }
  }

  // Get Mock Drill List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillProgramStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page= ${MockDrillProgramStatusMasterStore.currentPage}`;
      if (MockDrillProgramStatusMasterStore.orderBy) params += `&order_by=${MockDrillProgramStatusMasterStore.orderItem}&order=${MockDrillProgramStatusMasterStore.orderBy}`;
    }
    if (MockDrillProgramStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillProgramStatusMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillProgramStatusPaginationResponse>('/mock-drill-program-statuses' + (params ? params : '')).pipe(
      map((res: MockDrillProgramStatusPaginationResponse) => {
        MockDrillProgramStatusMasterStore.setMockDrillProgramStatus(res);
        return res;
      })
    );
  }

  // Export Mock Drill Status
  exportToExcel() {
    this._http.get('/mock-drill-program-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_program_status') + ".xlsx");
      }
    )
  }

  // Activate Mock Drill Using Id
  activate(id: number) {
    return this._http.put('/mock-drill-program-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Deactivate Mock Drill Using Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-program-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock Drill Types 
  shareData(data) {
    return this._http.post('/mock-drill-program-statuses/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

}
