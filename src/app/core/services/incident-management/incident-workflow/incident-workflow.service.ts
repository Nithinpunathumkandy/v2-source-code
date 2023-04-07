import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleGroupsResponse, IncidentWorkflow, IncidentWorkflowPaginationResponse, SingleIncidentWorkflow } from 'src/app/core/models/incident-management/incident-workflow/incident-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentWorkflowService {

  constructor(
	  private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  saveRoleAdd(item: any,id) {
    return this._http.post('/incident-workflows/'+id+'/items/role', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_workflow_role_added');
        return res;
      })
    );
  }

  saveUserTeamAdd(item: any,id) {
    return this._http.post('/incident-workflows/'+id+'/items/team', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_workflow_team_added');
        return res;
      })
    );
  }

  saveHeadOfUnitAdd(item: any,id) {
    return this._http.post('/incident-workflows/'+id+'/items/unit-head', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_workflow_head_of_unit_added');
        return res;
      })
    );
  }

  saveDesignationAdd(item: any,id) {
    return this._http.post('/incident-workflows/'+id+'/items/designation', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_workflow_designation_added');
        return res;
      })
    );
  }

  saveUserAdd(item: any,id:any) {
    return this._http.post('/incident-workflows/'+id+'/items/user', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_workflow_user_added');
        return res;
      })
    );
  }

  deleteWorkflowSections(id: number,workflowId) {
    return this._http.delete('/incident-workflows/'+workflowId+'/items/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_section_deleted');
        this.getItem(IncidentWorkflowStore.workflowId).subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<SingleIncidentWorkflow> {
    return this._http.get<SingleIncidentWorkflow>('/incident-workflows/'+id).pipe((
      map((res:SingleIncidentWorkflow)=>{
        IncidentWorkflowStore.setIndividualIncidentTemplate(res);
        return res;
      })
    ))
  }

  getAllItems(params:string): Observable<IncidentWorkflow[]>{
    if(IncidentWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+IncidentWorkflowStore.searchText;
    return this._http.get<IncidentWorkflow[]>('/incident-workflows'+ (params ? params : '')).pipe(
      map((res: IncidentWorkflow[]) => {
        IncidentWorkflowStore.setAllIncidentTemplate(res["data"]);
        return res;
      })
    );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<IncidentWorkflowPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentWorkflowStore.currentPage}&status=all`;
      if (IncidentWorkflowStore.orderBy) params += `&order_by=${IncidentWorkflowStore.orderItem}&order=${IncidentWorkflowStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(IncidentWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+IncidentWorkflowStore.searchText;

    return this._http.get<IncidentWorkflowPaginationResponse>('/incident-workflows' + (params ? params : '')).pipe(
      map((res: IncidentWorkflowPaginationResponse) => {
        IncidentWorkflowStore.setIncidentWorkflow(res);
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/incident-workflows/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deleted');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/incident-workflows/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/incident-workflows/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
        // this.getAllItems('?module_group_ids=900').subscribe()
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/incident-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_workflow_template') +".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/incident-workflows/export?module_group_ids=1900', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_workflow') +".xlsx");
      }
    )
  }

  saveItem(item: any) {
    return this._http.post('/incident-workflows', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_work_flow_added');
         this.getAllItems('?module_group_ids=1900').subscribe()
        return res;
      })
    );
  }

  updateItem(id, data: any): Observable<any>{
    return this._http.put('/incident-workflows/'+id,data).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'incident_work_flow_updated');
      this.getAllItems('?module_group_ids=1900').subscribe()
      return res;
    }))
  }

  getModuleItems(params:string): Observable<ModuleGroupsResponse>{
    return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
      map((res: ModuleGroupsResponse) => {
        IncidentWorkflowStore.setModuleGroups(res)
        return res;
      })
    );
  }
}
