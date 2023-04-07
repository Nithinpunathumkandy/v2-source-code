
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillEvacuationRolePaginationResponse, MockDrillEvacuationRoleSingle } from 'src/app/core/models/masters/mock-drill/mock-drill-evacuation-role';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillEvacuationRoleMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-evacuation-role-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillEvacuationRoleService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  // Export MOck Drill Evacuation Role
  exportToExcel() {
    this._http.get('/mock-drill-evacuation-roles/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_evacuation_role') + ".xlsx");
      }
    )
  }
  // Get Mock Drill Evacuation Role List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillEvacuationRolePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillEvacuationRoleMasterStore.currentPage}`;
      if (MockDrillEvacuationRoleMasterStore.orderBy) params += `&order_by=${MockDrillEvacuationRoleMasterStore.orderItem}&order=${MockDrillEvacuationRoleMasterStore.orderBy}`;
    }
    if (MockDrillEvacuationRoleMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillEvacuationRoleMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillEvacuationRolePaginationResponse>('/mock-drill-evacuation-roles' + (params ? params : '')).pipe(
      map((res: MockDrillEvacuationRolePaginationResponse) => {
        MockDrillEvacuationRoleMasterStore.setMockDrillEvacuationRole(res);
        return res;
      })
    );
  }
  searchRole(params) {
    return this._http.get<MockDrillEvacuationRolePaginationResponse>('/mock-drill-evacuation-roles' + (params ? params : '')).pipe(
      map((res: MockDrillEvacuationRolePaginationResponse) => {
        MockDrillEvacuationRoleMasterStore.setMockDrillEvacuationRole(res);
        return res;
      })
    );
  }
  // Sort Mock Drill Evacuation Role List
  sortMockDrillList(type: string, text: string) {
    if (!MockDrillEvacuationRoleMasterStore.orderBy) {
      MockDrillEvacuationRoleMasterStore.orderBy = 'asc';
      MockDrillEvacuationRoleMasterStore.orderItem = type;
    }
    else {
      if (MockDrillEvacuationRoleMasterStore.orderItem == type) {
        if (MockDrillEvacuationRoleMasterStore.orderBy == 'asc') MockDrillEvacuationRoleMasterStore.orderBy = 'desc';
        else MockDrillEvacuationRoleMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillEvacuationRoleMasterStore.orderBy = 'asc';
        MockDrillEvacuationRoleMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }
  // Get Mock Drill Evacuation Role By Id
  getItem(id: number): Observable<MockDrillEvacuationRoleSingle> {
    return this._http.get<MockDrillEvacuationRoleSingle>('/mock-drill-evacuation-roles/' + id).pipe(
      map((res: MockDrillEvacuationRoleSingle) => {
        MockDrillEvacuationRoleMasterStore.setindividualMockDrillEvacuationRole(res)
        return res;
      })
    );
  }
  // Update Mock Drill Evacuation Role
  updateItem(id, item: any): Observable<any> {
    return this._http.put('/mock-drill-evacuation-roles/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Store Mock Drill Evacuation Role 
  saveItem(item: any) {
    return this._http.post('/mock-drill-evacuation-roles', item).pipe(
      map(res => {
        MockDrillEvacuationRoleMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  // Delete Mock Drill Evacuation Role By Id
  delete(id: number) {
    return this._http.delete('/mock-drill-evacuation-roles/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MockDrillEvacuationRoleMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }
  // Activate Mock Drill Evacuation Role By Id
  activate(id: number) {
    return this._http.put('/mock-drill-evacuation-roles/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Deactivate Mock Drill Evacuation Role By Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-evacuation-roles/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock Drill Evacuation Role 
  shareData(data) {
    return this._http.post('/mock-drill-evacuation-roles/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }
  // Generate Mock Drill Evacuation Role Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill-evacuation-roles/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_evacuation_role_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill Evacuation Role 
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill-evacuation-roles/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }
}


