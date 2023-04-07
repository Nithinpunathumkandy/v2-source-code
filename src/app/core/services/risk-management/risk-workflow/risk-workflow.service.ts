import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleGroupsResponse, RiskWorkflow, RiskWorkflowPaginationResponse, SingleRiskWorkflow } from 'src/app/core/models/risk-management/risk-workflow/risk-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskWorkflowStore } from 'src/app/stores/risk-management/risk-workflow/risk-workflow-store';

@Injectable({
  providedIn: 'root'
})
export class RiskWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/risk-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_role_has_been_added');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/risk-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_team_has_been_added');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/risk-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_head_of_unit_has_been_added');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveSystemRole(item: any,id) {
    return this._http.post('/risk-workflows/'+id+'/items/system-role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_system_role_has_been_added');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/risk-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_designation_has_been_added!');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/risk-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_user_has_been_added');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/risk-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this.getItem(RiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleRiskWorkflow> {
    return this._http.get<SingleRiskWorkflow>('/risk-workflows/'+id).pipe((
      map((res:SingleRiskWorkflow)=>{
        RiskWorkflowStore.setIndividualRiskTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(params:string): Observable<RiskWorkflow[]>{
    if(RiskWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+RiskWorkflowStore.searchText;
    return this._http.get<RiskWorkflow[]>('/risk-workflows'+ (params ? params : '')).pipe(
      map((res: RiskWorkflow[]) => {
        RiskWorkflowStore.setAllRiskTemplate(res["data"]);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${RiskWorkflowStore.currentPage}&status=all`;
      if (RiskWorkflowStore.orderBy) params += `&order_by=${RiskWorkflowStore.orderItem}&order=${RiskWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(RiskWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+RiskWorkflowStore.searchText;

    return this._http.get<RiskWorkflowPaginationResponse>('/risk-workflows' + (params ? params : '')).pipe(
      map((res: RiskWorkflowPaginationResponse) => {
        RiskWorkflowStore.setRiskWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/risk-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_work_flow_deleted_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/risk-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/risk-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/risk-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "RiskWorkflow.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/risk-workflows/export?module_group_ids=900', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "RiskWorkflow.xlsx");
      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/risk-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'risk_workflow_add');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/risk-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'risk_workflow_update');
      // this.getAllItems('?module_group_ids=900').subscribe()
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        RiskWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }
}
