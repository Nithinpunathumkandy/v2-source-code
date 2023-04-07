import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { IndividualMockDrill, MockDrillPaginationResponse } from 'src/app/core/models/mock-drill/mock-drill/mock-drill';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class MockDrillService {

  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }


  // Get Mock Drill Scenario List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillStore.currentPage}`;
      if (MockDrillStore.orderBy) params += `&order_by=${MockDrillStore.orderItem}&order=${MockDrillStore.orderBy}`;
    }
    if (MockDrillStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    if (RightSidebarLayoutStore.filterPageTag == 'mock_drills' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MockDrillPaginationResponse>('/mock-drill/mock-drills' + (params ? params : '')).pipe(
      map((res: MockDrillPaginationResponse) => {
        MockDrillStore.setMockDrill(res);
        return res;
      })
    );
  }

  getItem(id): Observable<IndividualMockDrill> {
    return this._http.get<IndividualMockDrill>('/mock-drill/mock-drills/' + id).pipe(
      map((res: IndividualMockDrill) => {
        MockDrillStore.setIndividualMockDrill(res)
        return res;
      })
    );
  }

  sortMockDrillList(type) {
    if (!MockDrillStore.orderBy) {
      MockDrillStore.orderBy = 'asc';
      MockDrillStore.orderItem = type;
    }
    else {
      if (MockDrillStore.orderItem == type) {
        if (MockDrillStore.orderBy == 'asc') MockDrillStore.orderBy = 'desc';
        else MockDrillStore.orderBy = 'asc'
      }
      else {
        MockDrillStore.orderBy = 'asc';
        MockDrillStore.orderItem = type;
      }
    }
  }

  saveItem(value) {
    return this._http.post('/mock-drill/mock-drills', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/mock-drill/mock-drills/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_deleted');
        this.getItems(false, null).subscribe(resp => {
          if (resp.from == null) {
            MockDrillStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false).subscribe();
          }
        });
        return res;
      })
    );
  }

  updateItem(id, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drills/' + id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_updated');

        this.getItems(false, null).subscribe();

        return res;
      })
    );
  }
  // Generate Mock Drill  Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill/mock-drills/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill  
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill/mock-drills/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }
  // Export Mock Drill 
  exportToExcel() {
    this._http.get('/mock-drill/mock-drills/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill') + ".xlsx");
      }
    )
  }
  // Export Mock Drill  PDF
  exportToPdf(id) {
    this._http.get('/mock-drill/mock-drill-reports/' + id + '/export-pdf', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill') + ".pdf");
      }
    )
  }
  // Shatre Mock Drill Types 
  shareData(data) {
    return this._http.post('/mock-drill/mock-drills/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }
  // Save Mock Drill info
  saveMockDrillInfo(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drills', saveData).pipe(
      map((res) => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_info_created');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }
  // Update Mock Drill info
  updateMockDrillInfo(id, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drills/' + id, saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_info_updated');
        return res;
      })
    );
  }
  // Save Mock Drill Checks
  saveMockDrillChecks(id, saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drills/' + id + '/checks', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_checks_created');
        return res;
      })
    );
  }
  // Update Mock Drill Checks
  updateMockDrillChecks(id, checksId, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drills/' + id + '/checks/' + checksId, saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_checks_updated');
        return res;
      })
    );
  }
  // Get Mock Drill Checks
  getMockDrillChecks(id): Observable<any> {
    return this._http.get('/mock-drill/mock-drills/' + id + '/checks').pipe(
      map(res => {
        return (res as any)?.data;
      })
    );
  }
  // Save Mock Drill Observation
  saveMockDrillObservation(id, saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drills/' + id + '/observations', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_observation_saved');
        return res;
      })
    );
  }
  // Update Mock Drill Observation
  updateMockDrillObservation(id, observationId, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drills/' + id + '/observations/' + observationId, saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_observation_updated');
        return res;
      })
    );
  }
  // Get Mock Drill Observation
  getMockDrillObservation(id, observationId): Observable<any> {
    return this._http.get('/mock-drill/mock-drills/' + id + '/observations/' + observationId).pipe(
      map(res => {
        var val: any = res;
        MockDrillStore.setMockDrillObservations(val.mock_drill_observation_members);
        return res;
      })
    );
  }
  // Save Mock Drill Participants
  saveMockDrillParticipants(id, saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drills/' + id + '/participants', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_participants_saved');
        return res;
      })
    );
  }
  // Get Mock Drill Participants
  getMockDrillParticipants(id): Observable<any> {
    return this._http.get('/mock-drill/mock-drills/' + id + '/participants').pipe(
      map(res => {
        return (res as any)?.data;
      })
    );
  }
  // Update Mock Drill Participants
  updateMockDrillParticipants(id, infoid, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drills/' + id + '/participants/' + infoid, saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('success', 'mock_drill_participants_updated');
        return res;
      })
    );
  }
  // Review Mock Drill 
  reviewMockDrill(type: string, saveData) {
    return this._http.put('/mock-drill/mock-drills/' + MockDrillStore.mock_drill_id + '/' + type, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_' + type);
        return res;
      })
    );
  }
  // Get Mock Drill History
  getMockDrilHistory(): Observable<any> {
    MockDrillStore.mockdrill_history_loaded = true;
    return this._http.get<any>('/mock-drill/mock-drills/' + MockDrillStore.mock_drill_id + '/workflow-history').pipe(
      map((res: any) => {
        MockDrillStore.setMockDrillHistory(res.data)
        MockDrillStore.mockdrill_history_loaded = false;
        return res;
      })
    );
  }
  // Generate External Participants Template
  generateParticipantsTemplate() {
    this._http.get('/mock-drill/mock-drills/' + MockDrillStore.mock_drill_id + '/participants/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_template') + ".xlsx");
      }
    )
  }
  // Import External Participants
  importParticipantsData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill/mock-drills/' + MockDrillStore.mock_drill_id + '/participants/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  getWorkflow(id) {
    return this._http.get('/mock-drill/mock-drills/' + id + '/workflow').pipe((
      map((res) => {
        MockDrillStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
}
