import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleGroupsResponse, MrmWorkflow, MrmWorkflowPaginationResponse, SingleMrmWorkflow } from 'src/app/core/models/mrm/mrm-workflow/mrm-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MrmWorkflowStore } from 'src/app/stores/mrm/mrm-workflow/mrm-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MrmWorkflowService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/meeting-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_role_add');
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/meeting-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_team_add');
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/meeting-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_hod_add');
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/meeting-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_designation_add');
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/meeting-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_user_add');
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/meeting-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_work_flow');
        this.getItem(MrmWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleMrmWorkflow> {
    return this._http.get<SingleMrmWorkflow>('/meeting-workflows/'+id).pipe((
      map((res:SingleMrmWorkflow)=>{
        MrmWorkflowStore.setIndividualMrmTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(getAll: boolean = false, additionalParams?: string): Observable<MrmWorkflowPaginationResponse>{
    let params = '';
    if (!getAll) {
      params = `?page=${MrmWorkflowStore.currentPage}&status=all`;
      if (MrmWorkflowStore.orderBy) params += `&order_by=${MrmWorkflowStore.orderItem}&order=${MrmWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MrmWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+MrmWorkflowStore.searchText;
    return this._http.get<MrmWorkflowPaginationResponse>('/meeting-workflows'+ (params ? params : '')).pipe(
      map((res: MrmWorkflowPaginationResponse) => {
        MrmWorkflowStore.setAllMrmTemplate(res);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MrmWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MrmWorkflowStore.currentPage}&status=all`;
      if (MrmWorkflowStore.orderBy) params += `&order_by=${MrmWorkflowStore.orderItem}&order=${MrmWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MrmWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+MrmWorkflowStore.searchText;

    return this._http.get<MrmWorkflowPaginationResponse>('/meeting-workflows' + (params ? params : '')).pipe(
      map((res: MrmWorkflowPaginationResponse) => {
        MrmWorkflowStore.setMrmWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/meeting-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'workflow_delete');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/meeting-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/meeting-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/meeting-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_workflow_template')+".xlsx");

      }
    )
  }

  exportToExcel() {
    this._http.get('/meeting-workflows/export?module_group_ids=1600', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_workflow')+".xlsx");
      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/meeting-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'workflow_add');
        // this.getAllItems('?module_group_ids=1600').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/meeting-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'workflow_update');
      // this.getAllItems('?module_group_ids=1600').subscribe()
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        MrmWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }

  sortWorkflowList(type:string, text:string) {
    if (!MrmWorkflowStore.orderBy) {
      MrmWorkflowStore.orderBy = 'desc';
      MrmWorkflowStore.orderItem = type;
    }
    else{
      if (MrmWorkflowStore.orderItem == type) {
        if(MrmWorkflowStore.orderBy == 'desc') MrmWorkflowStore.orderBy = 'asc';
        else MrmWorkflowStore.orderBy = 'desc'
      }
      else{
        MrmWorkflowStore.orderBy = 'desc';
        MrmWorkflowStore.orderItem = type;
      }
    }
  }
}
