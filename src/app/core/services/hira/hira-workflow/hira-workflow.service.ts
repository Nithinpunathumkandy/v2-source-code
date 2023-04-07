import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleGroupsResponse, HiraWorkflow, HiraWorkflowPaginationResponse, SingleHiraWorkflow } from 'src/app/core/models/hira/workflow/hira-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HiraWorkflowStore } from 'src/app/stores/hira/workflow/hira-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class HiraWorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    saveRoleAdd(item: any,id) {
      return this._http.post('/risk-workflows/'+id+'/items/role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'risk_workflow_role_has_been_added');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserTeamAdd(item: any,id) {
      return this._http.post('/risk-workflows/'+id+'/items/team', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'risk_workflow_team_has_been_added');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveHeadOfUnitAdd(item: any,id) {
      return this._http.post('/risk-workflows/'+id+'/items/unit-head', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'risk_workflow_head_of_unit_has_been_added');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveSystemRole(item: any,id) {
      return this._http.post('/risk-workflows/'+id+'/items/system-role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'risk_workflow_system_role_has_been_added');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveDesignationAdd(item: any,id) {
      return this._http.post('/risk-workflows/'+id+'/items/designation', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'risk_workflow_designation_has_been_added!');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserAdd(item: any,id:any) {
      return this._http.post('/risk-workflows/'+id+'/items/user', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'risk_workflow_user_has_been_added');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    deleteWorkflowSections(id: number,workflowId) {
      return this._http.delete('/risk-workflows/'+workflowId+'/items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_work_flow');
          this.getItem(HiraWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    getItem(id): Observable<SingleHiraWorkflow> {
      return this._http.get<SingleHiraWorkflow>('/risk-workflows/'+id).pipe((
        map((res:SingleHiraWorkflow)=>{
          HiraWorkflowStore.setIndividualHiraTemplate(res);
          return res;
        })
      ))
    }
  
    getAllItems(params:string): Observable<HiraWorkflow[]>{
      if(HiraWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+HiraWorkflowStore.searchText;
      return this._http.get<HiraWorkflow[]>('/risk-workflows'+ (params ? params : '')).pipe(
        map((res: HiraWorkflow[]) => {
          HiraWorkflowStore.setAllHiraTemplate(res["data"]);
          return res;
        })
      );
    }
  
    getItems(getAll: boolean = false, additionalParams?: string): Observable<HiraWorkflowPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${HiraWorkflowStore.currentPage}&status=all`;
        if (HiraWorkflowStore.orderBy) params += `&order_by=${HiraWorkflowStore.orderItem}&order=${HiraWorkflowStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(HiraWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+HiraWorkflowStore.searchText;
  
      return this._http.get<HiraWorkflowPaginationResponse>('/risk-workflows' + (params ? params : '')).pipe(
        map((res: HiraWorkflowPaginationResponse) => {
          HiraWorkflowStore.setHiraWorkflow(res);
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
          HiraWorkflowStore.setModuleGroups(res)
          return res;
        })
      );
    }

}
