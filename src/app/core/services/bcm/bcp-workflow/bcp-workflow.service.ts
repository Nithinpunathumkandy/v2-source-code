import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BcpWorkflow, BcpWorkflowPaginationResponse, ModuleGroupsResponse, SingleBcpWorkflow } from 'src/app/core/models/bcm/bcm-workflow/bcm-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcpWorkflowStore } from 'src/app/stores/bcm/bcp-workflow/bcp-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BcpWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

 
  getItems(getAll: boolean = false, additionalParams?: string): Observable<BcpWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BcpWorkflowStore.currentPage}&status=all`;
      if (BcpWorkflowStore.orderBy) params += `&order_by=${BcpWorkflowStore.orderItem}&order=${BcpWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(BcpWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+BcpWorkflowStore.searchText;
    return this._http.get<BcpWorkflowPaginationResponse>('/bcp-workflows' + (params ? params : '')).pipe(
      map((res: BcpWorkflowPaginationResponse) => {
        BcpWorkflowStore.setBcpWorkflow(res);
        return res;
      })
    );
  }
  
  getItem(id): Observable<SingleBcpWorkflow> {
    return this._http.get<SingleBcpWorkflow>('/bcp-workflows/'+id).pipe((
      map((res:SingleBcpWorkflow)=>{
        BcpWorkflowStore.setIndividualRiskTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(params:string): Observable<BcpWorkflow[]>{
    if(BcpWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+BcpWorkflowStore.searchText;
    return this._http.get<BcpWorkflow[]>('/bcp-workflows'+ (params ? params : '')).pipe(
      map((res: BcpWorkflow[]) => {
        BcpWorkflowStore.setAllRiskTemplate(res["data"]);
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/bcp-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'bcp_workflow_add');
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/bcp-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'bcp_workflow_update');
      return res;
    }))
  }

  delete(id: number) {
    return this._http.delete('/bcp-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_work_flow_deleted_main');
        return res;
      })
    );
  }

  saveRoleAdd(item: any,id) {
    return this._http.post('/bcp-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'bcp_workflow_role_has_been_added');
        this.getItem(BcpWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/bcp-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'bcp_workflow_team_has_been_added');
        this.getItem(BcpWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/bcp-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'bcp_workflow_head_of_unit_has_been_added');
        this.getItem(BcpWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/bcp-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'bcp_workflow_designation_has_been_added!');
        this.getItem(BcpWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/bcp-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'bcp_workflow_user_has_been_added');
        this.getItem(BcpWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/bcp-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_bcp_work_flow');
        this.getItem(BcpWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/bcp-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_work_flow_activated_main');
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/bcp-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_work_flow_deactivated_main');
        return res;
      })
    );
  }
 
  generateTemplate() {
    this._http.get('/bcp-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "BcpWorkflow.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/bcp-workflows/export?module_group_ids=2800', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bcp_workflow')+".xlsx");
      }
    )
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        BcpWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }
}
