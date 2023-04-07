import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillChecksPaginationResponse, MockDrillChecksSingle } from 'src/app/core/models/masters/mock-drill/mock-drill-checks';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillChecksMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-checks-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class MockDrillChecksService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  // Export MOck Drill Checks
  exportToExcel() {
    this._http.get(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/export`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_checks') + ".xlsx");
      }
    )
  }

  // Get Mock Drill Checks List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillChecksPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillChecksMasterStore.currentPage}`;
      if (MockDrillChecksMasterStore.orderBy) params += `&order_by=${MockDrillChecksMasterStore.orderItem}&order=${MockDrillChecksMasterStore.orderBy}`;
    }
    if (MockDrillChecksMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillChecksMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillChecksPaginationResponse>(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks` + (params ? params : '')).pipe(
      map((res: MockDrillChecksPaginationResponse) => {
        MockDrillChecksMasterStore.setMockDrillResponseService(res);
        return res;
      })
    );
  }
  // Get Mock DrillChecks By Id
  getItem(id: number): Observable<MockDrillChecksSingle> {
    return this._http.get<MockDrillChecksSingle>(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/` + id).pipe(
      map((res: MockDrillChecksSingle) => {
        MockDrillChecksMasterStore.setindividualMockDrill(res)
        return res;
      })
    );
  }
  // Sort Mock Drill Checks
  sortMockDrillChecks(type: string, text: string) {
    if (!MockDrillChecksMasterStore.orderBy) {
      MockDrillChecksMasterStore.orderBy = 'asc';
      MockDrillChecksMasterStore.orderItem = type;
    }
    else {
      if (MockDrillChecksMasterStore.orderItem == type) {
        if (MockDrillChecksMasterStore.orderBy == 'asc') MockDrillChecksMasterStore.orderBy = 'desc';
        else MockDrillChecksMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillChecksMasterStore.orderBy = 'asc';
        MockDrillChecksMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }
  // Update Mock Drill Response Checks
  updateItem(id, item: any): Observable<any> {
    return this._http.put(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/` + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_checks_updated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Store Mock Drill Response Checks 
  saveItem(item: any) {
    return this._http.post(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks`, item).pipe(
      map(res => {
        MockDrillChecksMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'mock_drill_checks_created');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  // Delete Mock DrillChecks By Id
  delete(id: number) {
    return this._http.delete(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/` + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_checks_deleted');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MockDrillChecksMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }
  // Activate Mock DrillChecks By Id
  activate(id: number) {
    return this._http.put(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/` + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_checks_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Deactivate Mock DrillChecks By Id
  deactivate(id: number) {
    return this._http.put(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/` + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_checks_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock DrillChecks 
  shareData(data) {
    return this._http.post(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/share`, data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }
  // Generate Mock DrillChecks Template For User Reference
  generateTemplate() {
    this._http.get(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/template`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_response_service_template') + ".xlsx");
      }
    )
  }
  // Import Mock DrillChecks 
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post(`/mock-drill-response-services/${MockDrillChecksMasterStore.response_service_check_id}/checks/import`, data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_checks_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }
}
