import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { MockDrillTypesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-types-store';
import { MockDrillSingle, MockDrillTypesPaginationResponse } from 'src/app/core/models/masters/mock-drill/mock-drill-types';
@Injectable({
  providedIn: 'root'
})
export class MockDrillTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  // Export MOck Drill Types
  exportToExcel() {
    this._http.get('/mock-drill-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_types') + ".xlsx");
      }
    )
  }
  // Get Mock Drill Type List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillTypesMasterStore.currentPage}`;
      if (MockDrillTypesMasterStore.orderBy) params += `&order_by=${MockDrillTypesMasterStore.orderItem}&order=${MockDrillTypesMasterStore.orderBy}`;
    }
    if (MockDrillTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillTypesMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillTypesPaginationResponse>('/mock-drill-types' + (params ? params : '')).pipe(
      map((res: MockDrillTypesPaginationResponse) => {
        MockDrillTypesMasterStore.setMockDrillTypes(res);
        return res;
      })
    );
  }
  // Sort Mock Drill List
  sortMockDrillList(type: string, text: string) {
    if (!MockDrillTypesMasterStore.orderBy) {
      MockDrillTypesMasterStore.orderBy = 'asc';
      MockDrillTypesMasterStore.orderItem = type;
    }
    else {
      if (MockDrillTypesMasterStore.orderItem == type) {
        if (MockDrillTypesMasterStore.orderBy == 'asc') MockDrillTypesMasterStore.orderBy = 'desc';
        else MockDrillTypesMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillTypesMasterStore.orderBy = 'asc';
        MockDrillTypesMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }
  // Get Mock Drill Types By Id
  getItem(id: number): Observable<MockDrillSingle> {
    return this._http.get<MockDrillSingle>('/mock-drill-types/' + id).pipe(
      map((res: MockDrillSingle) => {
        MockDrillTypesMasterStore.setindividualMockDrill(res)
        return res;
      })
    );
  }
  // Update Mock Drill Types
  updateItem(id, item: any): Observable<any> {
    return this._http.put('/mock-drill-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Store Mock Drill Types 
  saveItem(item: any) {
    return this._http.post('/mock-drill-types', item).pipe(
      map(res => {
        MockDrillTypesMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  // Delete Mock Drill Types By Id
  delete(id: number) {
    return this._http.delete('/mock-drill-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MockDrillTypesMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }
  // Activate Mock Drill Types By Id
  activate(id: number) {
    return this._http.put('/mock-drill-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Deactivate Mock Drill Types By Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock Drill Types 
  shareData(data) {
    return this._http.post('/mock-drill-types/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }
  // Generate Mock Drill Types Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill Types 
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill-types/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

}
