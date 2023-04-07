import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillScopesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-scopes-store';
import { MockDrillScopesPaginationResponse } from 'src/app/core/models/masters/mock-drill/mock-drill-scopes';

@Injectable({
  providedIn: 'root'
})
export class MockDrillScopesService {


  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  //  Sort Mock Drill List
  sortMockDrillStatusesList(type: string, text: string) {
    if (!MockDrillScopesMasterStore.orderBy) {
      MockDrillScopesMasterStore.orderBy = 'asc';
      MockDrillScopesMasterStore.orderItem = type;
    }
    else {
      if (MockDrillScopesMasterStore.orderItem == type) {
        if (MockDrillScopesMasterStore.orderBy == 'asc') MockDrillScopesMasterStore.orderBy = 'desc';
        else MockDrillScopesMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillScopesMasterStore.orderBy = 'asc';
        MockDrillScopesMasterStore.orderItem = type;
      }
    }
  }

  // Get Mock Drill List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillScopesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page= ${MockDrillScopesMasterStore.currentPage}`;
      if (MockDrillScopesMasterStore.orderBy) params += `&order_by=${MockDrillScopesMasterStore.orderItem}&order=${MockDrillScopesMasterStore.orderBy}`;
    }
    if (MockDrillScopesMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillScopesMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillScopesPaginationResponse>('/mock-drill-scopes' + (params ? params : '')).pipe(
      map((res: MockDrillScopesPaginationResponse) => {
        MockDrillScopesMasterStore.setMockDrillScopes(res);
        return res;
      })
    );
  }

  // Export Mock Drill Status
  exportToExcel() {
    this._http.get('/mock-drill-scopes/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_scopes') + ".xlsx");
      }
    )
  }

  // Activate Mock Drill Using Id
  activate(id: number) {
    return this._http.put('/mock-drill-scopes/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Deactivate Mock Drill Using Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-scopes/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock Drill Types 
  shareData(data) {
    return this._http.post('/mock-drill-scopes/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

}
