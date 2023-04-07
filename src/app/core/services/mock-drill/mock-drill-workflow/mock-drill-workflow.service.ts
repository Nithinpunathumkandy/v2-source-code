import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDrillWorkflowPaginationResponse, ModuleGroupsResponse, SingleMockDrillWorkflow } from 'src/app/core/models/mock-drill/mock-drill-workflow/mock-drill-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillWorkflowStore } from 'src/app/stores/mock-drill/mock-drill-workflow/mock-drill-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class MockDrillWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  saveRoleAdd(item: any, id) {
    return this._http.post('/mock-drill/mock-drill-workflows/' + id + '/items/role', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'workflow_role_add');
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any, id) {
    return this._http.post('/mock-drill/mock-drill-workflows/' + id + '/items/team', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'workflow_team_add');
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any, id) {
    return this._http.post('/mock-drill/mock-drill-workflows/' + id + '/items/unit-head', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'workflow_hod_add');
        return res;
      })
    );
  }

  saveDesignationAdd(item: any, id) {
    return this._http.post('/mock-drill/mock-drill-workflows/' + id + '/items/designation', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'workflow_designation_add');
        return res;
      })
    );
  }

  saveUserAdd(item: any, id: any) {
    return this._http.post('/mock-drill/mock-drill-workflows/' + id + '/items/user', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'workflow_user_add');
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number, workflowId) {
    return this._http.delete('/mock-drill/mock-drill-workflows/' + workflowId + '/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this.getItem(MockDrillWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleMockDrillWorkflow> {
    return this._http.get<SingleMockDrillWorkflow>('/mock-drill/mock-drill-workflows/' + id).pipe((
      map((res: SingleMockDrillWorkflow) => {
        MockDrillWorkflowStore.setIndividualMockDrillTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(getAll: boolean = false, additionalParams?: string): Observable<MockDrillWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillWorkflowStore.currentPage}&status=all`;
      if (MockDrillWorkflowStore.orderBy) params += `&order_by=${MockDrillWorkflowStore.orderItem}&order=${MockDrillWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if (MockDrillWorkflowStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillWorkflowStore.searchText;
    return this._http.get<MockDrillWorkflowPaginationResponse>('/mock-drill/mock-drill-workflows' + (params ? params : '')).pipe(
      map((res: MockDrillWorkflowPaginationResponse) => {
        MockDrillWorkflowStore.setAllMockDrillTemplate(res);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MockDrillWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillWorkflowStore.currentPage}&status=all`;
      if (MockDrillWorkflowStore.orderBy) params += `&order_by=${MockDrillWorkflowStore.orderItem}&order=${MockDrillWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if (MockDrillWorkflowStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillWorkflowStore.searchText;

    return this._http.get<MockDrillWorkflowPaginationResponse>('/mock-drill/mock-drill-workflows' + (params ? params : '')).pipe(
      map((res: MockDrillWorkflowPaginationResponse) => {
        MockDrillWorkflowStore.setMockDrillWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/mock-drill/mock-drill-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'workflow_delete');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/mock-drill/mock-drill-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/mock-drill/mock-drill-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/mock-drill/mock-drill-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill_workflow_template') + ".xlsx");

      }
    )
  }

  exportToExcel() {
    this._http.get('/mock-drill/mock-drill-workflows/export?module_group_ids=1600', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_workflow') + ".xlsx");
      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/mock-drill/mock-drill-workflows', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'workflow_add');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any> {
    return this._http.put('/mock-drill/mock-drill-workflows/' + id, data).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', 'workflow_update');
      // this.getAllItems('?module_group_ids=1600').subscribe()
      return res;
    }))
  }

  getModuleItems(params: string): Observable<ModuleGroupsResponse> {
    return this._http.get<ModuleGroupsResponse>('/modules' + (params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        MockDrillWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }

  sortWorkflowList(type: string, text: string) {
    if (!MockDrillWorkflowStore.orderBy) {
      MockDrillWorkflowStore.orderBy = 'desc';
      MockDrillWorkflowStore.orderItem = type;
    }
    else {
      if (MockDrillWorkflowStore.orderItem == type) {
        if (MockDrillWorkflowStore.orderBy == 'desc') MockDrillWorkflowStore.orderBy = 'asc';
        else MockDrillWorkflowStore.orderBy = 'desc'
      }
      else {
        MockDrillWorkflowStore.orderBy = 'desc';
        MockDrillWorkflowStore.orderItem = type;
      }
    }
  }
}
