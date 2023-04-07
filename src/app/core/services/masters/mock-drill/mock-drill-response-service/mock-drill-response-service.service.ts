import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillResponseServicePaginationResponse, MockDrillSingle } from 'src/app/core/models/masters/mock-drill/mock-drill-response-service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillResponseServiceMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-response-service-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillResponseServiceService {


  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  // Export MOck Drill Response Service
  exportToExcel() {
    this._http.get('/mock-drill-response-services/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_response_service') + ".xlsx");
      }
    )
  }
  // Get Mock Drill Response Service List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillResponseServicePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillResponseServiceMasterStore.currentPage}`;
      if (MockDrillResponseServiceMasterStore.orderBy) params += `&order_by=${MockDrillResponseServiceMasterStore.orderItem}&order=${MockDrillResponseServiceMasterStore.orderBy}`;
    }
    if (MockDrillResponseServiceMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillResponseServiceMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillResponseServicePaginationResponse>('/mock-drill-response-services' + (params ? params : '')).pipe(
      map((res: MockDrillResponseServicePaginationResponse) => {
        MockDrillResponseServiceMasterStore.setMockDrillResponseService(res);
        return res;
      })
    );
  }
  // Sort Mock Drill List
  sortMockDrillList(type: string, text: string) {
    if (!MockDrillResponseServiceMasterStore.orderBy) {
      MockDrillResponseServiceMasterStore.orderBy = 'asc';
      MockDrillResponseServiceMasterStore.orderItem = type;
    }
    else {
      if (MockDrillResponseServiceMasterStore.orderItem == type) {
        if (MockDrillResponseServiceMasterStore.orderBy == 'asc') MockDrillResponseServiceMasterStore.orderBy = 'desc';
        else MockDrillResponseServiceMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillResponseServiceMasterStore.orderBy = 'asc';
        MockDrillResponseServiceMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }
  // Get Mock Drill Response Service By Id
  getItem(id: number): Observable<MockDrillSingle> {
    return this._http.get<MockDrillSingle>('/mock-drill-response-services/' + id).pipe(
      map((res: MockDrillSingle) => {
        MockDrillResponseServiceMasterStore.setindividualMockDrill(res)
        return res;
      })
    );
  }
  // Update Mock Drill Response Service
  updateItem(id, item: any): Observable<any> {
    return this._http.put('/mock-drill-response-services/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Store Mock Drill Response Service 
  saveItem(item: any) {
    return this._http.post('/mock-drill-response-services', item).pipe(
      map(res => {
        MockDrillResponseServiceMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  // Delete Mock Drill Response Service By Id
  delete(id: number) {
    return this._http.delete('/mock-drill-response-services/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MockDrillResponseServiceMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }
  // Activate Mock Drill Response Service By Id
  activate(id: number) {
    return this._http.put('/mock-drill-response-services/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Deactivate Mock Drill Response Service By Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-response-services/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock Drill Response Service 
  shareData(data) {
    return this._http.post('/mock-drill-response-services/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }
  // Generate Mock Drill Response Service Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill-response-services/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_response_service_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill Response Service 
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill-response-services/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

}
