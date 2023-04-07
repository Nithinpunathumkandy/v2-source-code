import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IndividualMockDrillProgram, MockDrillProgramPaginationResponse } from 'src/app/core/models/mock-drill/mock-drill-program/mock-drill-program';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillProgramService {

  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }


  // Get Mock Drill Scenario List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillProgramPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillProgramStore.currentPage}`;
      if (MockDrillProgramStore.orderBy) params += `&order_by=${MockDrillProgramStore.orderItem}&order=${MockDrillProgramStore.orderBy}`;
    }
    if (MockDrillProgramStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillProgramStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    if (RightSidebarLayoutStore.filterPageTag == 'mock_drills' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MockDrillProgramPaginationResponse>('/mock-drill/mock-drill-programs' + (params ? params : '')).pipe(
      map((res: MockDrillProgramPaginationResponse) => {
        MockDrillProgramStore.setMockDrillProgram(res);
        return res;
      })
    );
  }

  getItem(id): Observable<IndividualMockDrillProgram> {
    return this._http.get<IndividualMockDrillProgram>('/mock-drill/mock-drill-programs/' + id).pipe(
      map((res: IndividualMockDrillProgram) => {
        MockDrillProgramStore.setIndividualMockDrillProgram(res)
        return res;
      })
    );
  }

  sortMockDrillProgramList(type) {
    if (!MockDrillProgramStore.orderBy) {
      MockDrillProgramStore.orderBy = 'asc';
      MockDrillProgramStore.orderItem = type;
    }
    else {
      if (MockDrillProgramStore.orderItem == type) {
        if (MockDrillProgramStore.orderBy == 'asc') MockDrillProgramStore.orderBy = 'desc';
        else MockDrillProgramStore.orderBy = 'asc'
      }
      else {
        MockDrillProgramStore.orderBy = 'asc';
        MockDrillProgramStore.orderItem = type;
      }
    }
  }

  saveItem(value) {
    return this._http.post('/mock-drill/mock-drill-programs', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_program_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/mock-drill/mock-drill-programs/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_program_deleted');
        this.getItems(false, null).subscribe(resp => {
          if (resp.from == null) {
            MockDrillProgramStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false).subscribe();
          }
        });
        return res;
      })
    );
  }

  updateItem(id, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drill-programs/' + id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_program_updated');

        this.getItems(false, null).subscribe();

        return res;
      })
    );
  }
  // Generate Mock Drill Program Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill/mock-drill-programs/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_program_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill Program
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill/mock-drill-programs/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_program_imported');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }
  // Export Mock Drill Program
  exportToExcel() {
    this._http.get('/mock-drill/mock-drill-programs/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_program') + ".xlsx");
      }
    )
  }
  // // Export Mock Drill  PDF
  // exportToPdf() {
  //   this._http.get('/mock-drill/mock-drill-reports/' + MockDrillProgramStore.mock_drill_program_id + '/export-pdf', { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill') + ".pdf");
  //     }
  //   )
  // }
  // Shatre Mock Drill Types 
  shareData(data) {
    return this._http.post('/mock-drill/mock-drill-programs/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }


  // Review Mock Drill Program
  reviewMockDrill(type: string, saveData) {
    return this._http.put('/mock-drill/mock-drill-Programs/' + MockDrillProgramStore.mock_drill_program_id + '/' + type, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_Program' + type);
        return res;
      })
    );
  }
  // // Get Mock Drill History
  // getMockDrilHistory(): Observable<any> {
  //   MockDrillProgramStore.mockdrill_history_program_loaded = true;
  //   return this._http.get<any>('/mock-drill/mock-drills/' + MockDrillProgramStore.mock_drill_program_id + '/workflow-history').pipe(
  //     map((res: any) => {
  //       MockDrillProgramStore.setMockDrillProgramHistory(res.data)
  //       MockDrillProgramStore.mockdrill_program_history_loaded = false;
  //       return res;
  //     })
  //   );
  // }
  // Update Preplan
  updatePreplanItem(id, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drill-preplans/' + id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_preplan_updated');
        return res;
      })
    );
  }
  savePreplanItem(value) {
    return this._http.post('/mock-drill/mock-drill-preplans', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_preplan_added');
        return res;
      })
    );
  }
  deletePreplan(id: number) {
    return this._http.delete('/mock-drill/mock-drill-preplans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_preplan_deleted');
        return res;
      })
    );
  }

  // getPreplanList(): Observable<any> {
  //   return this._http.get<any>('/mock-drill/mock-drill-preplans/').pipe(
  //     map((res: any) => {
  //       MockDrillProgramStore.setPreplan(res)
  //       return res;
  //     })
  //   );
  // }

  // Get Preplan List
  getPreplanList(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<any> {
    let params = '';
    if (!getAll) {
      params = `?page=${1}`;
    }
    if (additionalParams) params += additionalParams;
    // if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<any>('/mock-drill/mock-drill-preplans' + (params ? params : '')).pipe(
      map((res: any) => {
        MockDrillProgramStore.setPreplan(res.data)
        return res;
      })
    );
  }
}
