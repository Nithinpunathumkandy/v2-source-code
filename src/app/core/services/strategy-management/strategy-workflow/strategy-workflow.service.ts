import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyWorkflow, StrategyWorkflowPaginationResponse, ModuleGroupsResponse, SingleStrategyWorkflow } from 'src/app/core/models/strategy-management/strategy-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyWorkflowStore } from 'src/app/stores/strategy-management/strategy-workflow.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StrategyWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<StrategyWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategyWorkflowStore.currentPage}&status=all`;
      if (StrategyWorkflowStore.orderBy) params += `&order_by=${StrategyWorkflowStore.orderItem}&order=${StrategyWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(StrategyWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+StrategyWorkflowStore.searchText;
    return this._http.get<StrategyWorkflowPaginationResponse>('/strategy-workflows' + (params ? params : '')).pipe(
      map((res: StrategyWorkflowPaginationResponse) => {
        StrategyWorkflowStore.setStrategyWorkflow(res);
        return res;
      })
    );
  }
  
  getItem(id): Observable<SingleStrategyWorkflow> {
    return this._http.get<SingleStrategyWorkflow>('/strategy-workflows/'+id).pipe((
      map((res:SingleStrategyWorkflow)=>{
        StrategyWorkflowStore.setIndividualRiskTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(params:string): Observable<StrategyWorkflow[]>{
    if(StrategyWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+StrategyWorkflowStore.searchText;
    return this._http.get<StrategyWorkflow[]>('/strategy-workflows'+ (params ? params : '')).pipe(
      map((res: StrategyWorkflow[]) => {
        StrategyWorkflowStore.setAllRiskTemplate(res["data"]);
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/strategy-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'strategy_workflow_create');
        this.getAllItems('?module_group_ids=3200').subscribe();
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/strategy-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'strategy_workflow_update');
      this.getAllItems('?module_group_ids=3200').subscribe();        
      return res;
    }))
  }

  delete(id: number) {
    return this._http.delete('/strategy-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_work_flow_deleted_main');
        return res;
      })
    );
  }

  saveRoleAdd(item: any,id) {
    return this._http.post('/strategy-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'strategy_workflow_role_added');
        this.getItem(StrategyWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/strategy-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'strategy_workflow_team_added');
        this.getItem(StrategyWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/strategy-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'strategy_workflow_head_of_unit_added');
        this.getItem(StrategyWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/strategy-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'strategy_workflow_designation_added');
        this.getItem(StrategyWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/strategy-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'strategy_workflow_user_added');
        this.getItem(StrategyWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/strategy-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_work_flow_deleted_main');
        this.getItem(StrategyWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/strategy-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_work_flow_activated_main');
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/strategy-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_work_flow_deactivated_main');
        return res;
      })
    );
  }
 
  generateTemplate() {
    this._http.get('/strategy-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_workflow_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/strategy-workflows/export?module_group_ids=3200', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_workflow_export')+".xlsx");
      }
    )
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        StrategyWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }
}
