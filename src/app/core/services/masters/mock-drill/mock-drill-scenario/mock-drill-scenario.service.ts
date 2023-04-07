import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillScenarioPaginationResponse, MockDrillScenarioSingle } from 'src/app/core/models/masters/mock-drill/mock-drill-scenario';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillScenarioMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-scenario-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillScenarioService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  // Export MOck Drill Scenario
  exportToExcel() {
    this._http.get('/mock-drill-scenarios/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_scenario') + ".xlsx");
      }
    )
  }
  // Get Mock Drill Scenario List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillScenarioPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillScenarioMasterStore.currentPage}`;
      if (MockDrillScenarioMasterStore.orderBy) params += `&order_by=${MockDrillScenarioMasterStore.orderItem}&order=${MockDrillScenarioMasterStore.orderBy}`;
    }
    if (MockDrillScenarioMasterStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillScenarioMasterStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillScenarioPaginationResponse>('/mock-drill-scenarios' + (params ? params : '')).pipe(
      map((res: MockDrillScenarioPaginationResponse) => {
        MockDrillScenarioMasterStore.setMockDrillScenario(res);
        return res;
      })
    );
  }
  searchScenario(params) {
    return this._http.get<MockDrillScenarioPaginationResponse>('/mock-drill-scenarios' + (params ? params : '')).pipe(
      map((res: MockDrillScenarioPaginationResponse) => {
        MockDrillScenarioMasterStore.setMockDrillScenario(res);
        return res;
      })
    );
  }
  // Sort Mock Drill Scenario List
  sortMockDrillList(type: string, text: string) {
    if (!MockDrillScenarioMasterStore.orderBy) {
      MockDrillScenarioMasterStore.orderBy = 'asc';
      MockDrillScenarioMasterStore.orderItem = type;
    }
    else {
      if (MockDrillScenarioMasterStore.orderItem == type) {
        if (MockDrillScenarioMasterStore.orderBy == 'asc') MockDrillScenarioMasterStore.orderBy = 'desc';
        else MockDrillScenarioMasterStore.orderBy = 'asc'
      }
      else {
        MockDrillScenarioMasterStore.orderBy = 'asc';
        MockDrillScenarioMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }
  // Get Mock Drill Scenario By Id
  getItem(id: number): Observable<MockDrillScenarioSingle> {
    return this._http.get<MockDrillScenarioSingle>('/mock-drill-scenarios/' + id).pipe(
      map((res: MockDrillScenarioSingle) => {
        MockDrillScenarioMasterStore.setindividualMockDrillScenario(res)
        return res;
      })
    );
  }

  // Update Mock Drill Scenario
  updateItem(id, item: any): Observable<any> {
    return this._http.put('/mock-drill-scenarios/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  // Store Mock Drill Scenario 
  saveItem(item: any) {
    return this._http.post('/mock-drill-scenarios', item).pipe(
      map(res => {
        MockDrillScenarioMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  // Delete Mock Drill Scenario By Id
  delete(id: number) {
    return this._http.delete('/mock-drill-scenarios/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MockDrillScenarioMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }
  // Activate Mock Drill Scenario By Id
  activate(id: number) {
    return this._http.put('/mock-drill-scenarios/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Deactivate Mock Drill Scenario By Id
  deactivate(id: number) {
    return this._http.put('/mock-drill-scenarios/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  // Shatre Mock Drill Scenario 
  shareData(data) {
    return this._http.post('/mock-drill-scenarios/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }
  // Generate Mock Drill Scenario Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill-scenarios/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_scenario_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill Scenario 
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill-scenarios/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }
}
