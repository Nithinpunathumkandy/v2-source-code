import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiWorkflowPaginationResponse, ModuleGroupsResponse, SingleKpiWorkflow } from 'src/app/core/models/kpi-management/kpi-workflow/kpi-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiWorkflowStore } from 'src/app/stores/kpi-management/kpi-workflow/kpi-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/kpi-management/workflow/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_role_add');
        this.getItem(KpiWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/kpi-management/workflow/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_team_add');
        this.getItem(KpiWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/kpi-management/workflow/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_hod_add');
        this.getItem(KpiWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/kpi-management/workflow/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_designation_add');
        this.getItem(KpiWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/kpi-management/workflow/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_user_add');
        console.log('hi');
        
        this.getItem(KpiWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/kpi-management/workflow/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow_section_event');
        this.getItem(KpiWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleKpiWorkflow> {
    return this._http.get<SingleKpiWorkflow>('/kpi-management/workflows/'+id).pipe((
      map((res:SingleKpiWorkflow)=>{
        KpiWorkflowStore.setIndividualKpiTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(getAll: boolean = false, additionalParams?: string): Observable<KpiWorkflowPaginationResponse>{
    let params = '';
    if (!getAll) {
      params = `?page=${KpiWorkflowStore.currentPage}&status=all`;
      if (KpiWorkflowStore.orderBy) params += `&order_by=${KpiWorkflowStore.orderItem}&order=${KpiWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(KpiWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+KpiWorkflowStore.searchText;
    return this._http.get<KpiWorkflowPaginationResponse>('/kpi-management/workflows'+ (params ? params : '')).pipe(
      map((res: KpiWorkflowPaginationResponse) => {
        KpiWorkflowStore.setAllKpiTemplate(res);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<KpiWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KpiWorkflowStore.currentPage}&status=all`;
      if (KpiWorkflowStore.orderBy) params += `&order_by=${KpiWorkflowStore.orderItem}&order=${KpiWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(KpiWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+KpiWorkflowStore.searchText;

    return this._http.get<KpiWorkflowPaginationResponse>('/kpi-management/workflows' + (params ? params : '')).pipe(
      map((res: KpiWorkflowPaginationResponse) => {
        KpiWorkflowStore.setKpiWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/kpi-management/workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'workflow_delete');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/kpi-management/workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/kpi-management/workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/kpi-management/workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_workflow_template')+".xlsx");     

      }
    )
  }

  exportToExcel() {
    this._http.get('/kpi-management/workflows/export?module_group_ids=3800', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_workflow')+".xlsx");     

      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/kpi-management/workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_add');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/kpi-management/workflows/'+id, data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'workflow_update');
      // this.getAllItems('?module_group_ids=1600').subscribe()
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        KpiWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }

  sortWorkflowList(type:string, text:string) {
    if (!KpiWorkflowStore.orderBy) {
      KpiWorkflowStore.orderBy = 'desc';
      KpiWorkflowStore.orderItem = type;
    }
    else{
      if (KpiWorkflowStore.orderItem == type) {
        if(KpiWorkflowStore.orderBy == 'desc') KpiWorkflowStore.orderBy = 'asc';
        else KpiWorkflowStore.orderBy = 'desc'
      }
      else{
        KpiWorkflowStore.orderBy = 'desc';
        KpiWorkflowStore.orderItem = type;
      }
    }
  }
  
}
