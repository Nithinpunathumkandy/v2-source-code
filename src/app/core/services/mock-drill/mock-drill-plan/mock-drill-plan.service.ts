import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { MockDrillPlanStore } from 'src/app/stores/mock-drill/mock-drill-plan/mock-drill-plan-store';
import { IndividualMockDrillPlan, MockDrillPlanPaginationResponse } from 'src/app/core/models/mock-drill/mock-drill-plan/mock-drill-plan';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class MockDrillPlanService {

  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }


  // Get Mock Drill Scenario List
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillPlanStore.currentPage}`;
      if (MockDrillPlanStore.orderBy) params += `&order_by=${MockDrillPlanStore.orderItem}&order=${MockDrillPlanStore.orderBy}`;
    }
    if (MockDrillPlanStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillPlanStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    if (RightSidebarLayoutStore.filterPageTag == 'mock_drills' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MockDrillPlanPaginationResponse>('/mock-drill/mock-drill-plans' + (params ? params : '')).pipe(
      map((res: MockDrillPlanPaginationResponse) => {
        MockDrillPlanStore.setMockDrillPlan(res);
        return res;
      })
    );
  }

  getItem(id): Observable<IndividualMockDrillPlan> {
    return this._http.get<IndividualMockDrillPlan>('/mock-drill/mock-drill-plans/' + id).pipe(
      map((res: IndividualMockDrillPlan) => {
        MockDrillPlanStore.setIndividualMockDrillPlan(res)
        return res;
      })
    );
  }
  searchPlans(params) {
    return this._http.get<MockDrillPlanPaginationResponse>('/mock-drill/mock-drill-plans' + (params ? params : '')).pipe(
      map((res: MockDrillPlanPaginationResponse) => {
        MockDrillPlanStore.setMockDrillPlan(res);
        return res;
      })
    );
  }
  sortMockDrillPlanList(type) {
    if (!MockDrillPlanStore.orderBy) {
      MockDrillPlanStore.orderBy = 'asc';
      MockDrillPlanStore.orderItem = type;
    }
    else {
      if (MockDrillPlanStore.orderItem == type) {
        if (MockDrillPlanStore.orderBy == 'asc') MockDrillPlanStore.orderBy = 'desc';
        else MockDrillPlanStore.orderBy = 'asc'
      }
      else {
        MockDrillPlanStore.orderBy = 'asc';
        MockDrillPlanStore.orderItem = type;
      }
    }
  }

  saveItem(value) {
    return this._http.post('/mock-drill/mock-drill-plans', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_plan_added');
        let parms = "&used_plan_id";
        this.getItems(false, parms).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/mock-drill/mock-drill-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_plan_deleted');
        let parms = "&used_plan_id";
        this.getItems(false, parms).subscribe(resp => {
          if (resp.from == null) {
            MockDrillPlanStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false).subscribe();
          }
        });
        return res;
      })
    );
  }

  updateItem(id, saveData): Observable<any> {
    return this._http.put('/mock-drill/mock-drill-plans/' + id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_plan_updated');
        let parms = "&used_plan_id";
        this.getItems(false, parms).subscribe();
        return res;
      })
    );
  }
  // Generate Mock Drill Plan Template For User Reference
  generateTemplate() {
    this._http.get('/mock-drill/mock-drill-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_plan_template') + ".xlsx");
      }
    )
  }
  // Import Mock Drill Plan 
  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/mock-drill/mock-drill-plans/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'mock_drill_plan_imported');
        let parms = "&used_plan_id";
        this.getItems(false, parms, true).subscribe();
        return res;
      })
    )
  }
  // Export Mock Drill Plan
  exportToExcel() {
    this._http.get('/mock-drill/mock-drill-plans/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_plan') + ".xlsx");
      }
    )
  }
  // Shatre Mock Drill Types 
  shareData(data) {
    return this._http.post('/mock-drill/mock-drill-plans/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }
}
