import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleGroupsResponse, RiskWorkflow, RiskWorkflowPaginationResponse, SingleRiskWorkflow } from 'src/app/core/models/risk-management/risk-workflow/risk-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskWorkflowStore } from 'src/app/stores/isms/isms-risk-workflow/isms-risk-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
// import { IsmsRiskWorkflowStore } from 'src/app/stores/risk-management/risk-workflow/risk-workflow-store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/isms-risk-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_role_has_been_added');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/isms-risk-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_team_has_been_added');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/isms-risk-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_head_of_unit_has_been_added');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveSystemRole(item: any,id) {
    return this._http.post('/isms-risk-workflows/'+id+'/items/system-role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_system_role_has_been_added');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/isms-risk-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_designation_has_been_added!');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/isms-risk-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_workflow_user_has_been_added');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/isms-risk-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this.getItem(IsmsRiskWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleRiskWorkflow> {
    return this._http.get<SingleRiskWorkflow>('/isms-risk-workflows/'+id).pipe((
      map((res:SingleRiskWorkflow)=>{
        IsmsRiskWorkflowStore.setIndividualRiskTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(params:string): Observable<RiskWorkflow[]>{
    if(IsmsRiskWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRiskWorkflowStore.searchText;
    return this._http.get<RiskWorkflow[]>('/isms-risk-workflows'+ (params ? params : '')).pipe(
      map((res: RiskWorkflow[]) => {
        IsmsRiskWorkflowStore.setAllRiskTemplate(res["data"]);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsRiskWorkflowStore.currentPage}&status=all`;
      if (IsmsRiskWorkflowStore.orderBy) params += `&order_by=${IsmsRiskWorkflowStore.orderItem}&order=${IsmsRiskWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(IsmsRiskWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRiskWorkflowStore.searchText;

    return this._http.get<RiskWorkflowPaginationResponse>('/isms-risk-workflows' + (params ? params : '')).pipe(
      map((res: RiskWorkflowPaginationResponse) => {
        IsmsRiskWorkflowStore.setRiskWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risk-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_work_flow_deleted_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/isms-risk-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/isms-risk-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/isms-risk-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_workflow_template')+".xlsx");     
      }
    )
  }

  exportToExcel() {
    this._http.get('/isms-risk-workflows/export?module_group_ids=3600', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_workflows')+".xlsx");     

      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/isms-risk-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'risk_workflow_add');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/isms-risk-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'risk_workflow_update');
      // this.getAllItems('?module_group_ids=900').subscribe()
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        IsmsRiskWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }
}
