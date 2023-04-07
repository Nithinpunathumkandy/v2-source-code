import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmWorkflow, AmWorkflowPaginationResponse, ModuleGroupsResponse, SingleAmWorkflow } from 'src/app/core/models/audit-management/am-workflow/am-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmWorkflowStore } from 'src/app/stores/audit-management/am-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
// import { AmWorkflowStore } from 'src/app/stores/audit-management/am-workflow/am-workflow-store';

@Injectable({
  providedIn: 'root'
})
export class AmWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/am-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_role_has_been_added');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/am-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_team_has_been_added');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/am-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_head_of_unit_has_been_added');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveSystemRole(item: any,id) {
    return this._http.post('/am-workflows/'+id+'/items/system-role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_system_role_has_been_added');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/am-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_designation_has_been_added!');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/am-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'am_workflow_user_has_been_added');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/am-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this.getItem(AmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleAmWorkflow> {
    return this._http.get<SingleAmWorkflow>('/am-workflows/'+id).pipe((
      map((res:SingleAmWorkflow)=>{
        AmWorkflowStore.setIndividualAmTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(params:string): Observable<AmWorkflow[]>{
    if(AmWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+AmWorkflowStore.searchText;
    return this._http.get<AmWorkflow[]>('/am-workflows'+ (params ? params : '')).pipe(
      map((res: AmWorkflow[]) => {
        AmWorkflowStore.setAllAmTemplate(res["data"]);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmWorkflowStore.currentPage}&status=all`;
      if (AmWorkflowStore.orderBy) params += `&order_by=${AmWorkflowStore.orderItem}&order=${AmWorkflowStore.orderBy}`;
    }
    if (additionalParams) params=params?params+'&'+additionalParams:'?'+additionalParams;
    if(AmWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+AmWorkflowStore.searchText;

    return this._http.get<AmWorkflowPaginationResponse>('/am-workflows' + (params ? params : '')).pipe(
      map((res: AmWorkflowPaginationResponse) => {
        AmWorkflowStore.setAmWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_work_flow_deleted_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/am-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/am-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/am-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "AuditManagement Workflow.xlsx");
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_workflow_template')+".xlsx");     

      }
    )
  }

  exportToExcel() {
    this._http.get('/am-workflows/export?module_group_ids=3900', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "AuditManagement Workflow.xlsx");
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_workflow')+".xlsx");     

      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-workflows/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','am_audit_workflow_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  saveItem(item: any) {
    return this._http.post('/am-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'am_workflow_add');
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/am-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'am_workflow_update');
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        AmWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }
}
