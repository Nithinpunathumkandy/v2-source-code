import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTypes } from 'src/app/core/models/internal-audit/audit-workflow/audit-workflow';
import { ModuleGroupsResponse, AuditWorkflow, SingleAuditWorkflow, AuditWorkflowPaginationResponse } from "src/app/core/models/ms-audit-management/ms-audit/audit-workflow/audit-workflow";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditWorkflowStore } from 'src/app/stores/internal-audit/audit-workflow/audit-workflow-store';
import { MsAuditWorkflowStore } from 'src/app/stores/ms-audit-management/audit-workflow/audit-workflow.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditWorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditWorkflowPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MsAuditWorkflowStore.currentPage}&status=all`;
        if (MsAuditWorkflowStore.orderBy) params += `&order_by=${MsAuditWorkflowStore.orderItem}&order=${MsAuditWorkflowStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(MsAuditWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditWorkflowStore.searchText;
      return this._http.get<AuditWorkflowPaginationResponse>('/ms-audit-workflows' + (params ? params : '')).pipe(
        map((res: AuditWorkflowPaginationResponse) => {
          MsAuditWorkflowStore.setAuditWorkflow(res);
          return res;
        })
      );
    }

    getItem(id): Observable<SingleAuditWorkflow> {
      return this._http.get<SingleAuditWorkflow>('/ms-audit-workflows/'+id).pipe((
        map((res:SingleAuditWorkflow)=>{
          MsAuditWorkflowStore.setIndividualRiskTemplate(res);
          return res;
        })
      ))
    }

    getAllItems(params:string): Observable<AuditWorkflow[]>{
      if(MsAuditWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditWorkflowStore.searchText;
      return this._http.get<AuditWorkflow[]>('/ms-audit-workflows'+ (params ? params : '')).pipe(
        map((res: AuditWorkflow[]) => {
          MsAuditWorkflowStore.setAllAuditTemplate(res["data"]);
          return res;
        })
      );
    }

    saveItem(item: any) {
      return this._http.post('/ms-audit-workflows', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'audit_workflow_created_successfuly');
          this.getAllItems('?module_group_ids=4100').subscribe();
          return res;
        })
      );
    }

    getUserTypes(params:string=""): Observable<UserTypes>{
      return this._http.get<UserTypes>('/user-types'+(params ? params : '')).pipe(
        map((res: UserTypes) => {
          AuditWorkflowStore.setUserTypes(res)
          return res;
        })
      );
    }
  
    updateItem(id, data: any): Observable<any>{
      return this._http.put('/ms-audit-workflows/'+id,data).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'audit_workflow_updated_successfully');
        this.getAllItems('?module_group_ids=4100').subscribe();        
        return res;
      }))
    }
  
    delete(id: number) {
      return this._http.delete('/ms-audit-workflows/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'audit_workflow_deleted_successfully');
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/ms-audit-workflows/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'audit_workflow_activated_successfully');
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/ms-audit-workflows/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'audit_workfolw_deactiveted_successfully');
          return res;
        })
      );
    }
   
    generateTemplate() {
      this._http.get('/ms-audit-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_management_workflows_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/ms-audit-workflows/export?module_group_ids=4100', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_management_workflows')+".xlsx");
        }
      )
    }

    getModuleItems(params:string): Observable<ModuleGroupsResponse>{
      return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
        map((res: ModuleGroupsResponse) => {
          MsAuditWorkflowStore.setModuleGroups(res)
          return res;
        })
      );
    }

    deleteWorkflowSections(id: number,workflowId) {
      return this._http.delete('/ms-audit-workflows/'+workflowId+'/items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'audit_workflow_user_deleted_successfully');
          this.getItem(MsAuditWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }

    saveRoleAdd(item: any,id) {
      return this._http.post('/ms-audit-workflows/'+id+'/items/role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'audit_workflow_user_added_successfully');
          this.getItem(MsAuditWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserTeamAdd(item: any,id) {
      return this._http.post('/ms-audit-workflows/'+id+'/items/team', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'audit_workflow_team_added_successfully');
          this.getItem(MsAuditWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveHeadOfUnitAdd(item: any,id) {
      return this._http.post('/ms-audit-workflows/'+id+'/items/unit-head', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'audit_workflow_head_of_unit_added_successfully');
          this.getItem(MsAuditWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveDesignationAdd(item: any,id) {
      return this._http.post('/ms-audit-workflows/'+id+'/items/designation', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'audit_workflow_desigination_added_successfully');
          this.getItem(MsAuditWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserAdd(item: any,id:any) {
      return this._http.post('/ms-audit-workflows/'+id+'/items/user', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'audit_workflow_user_added_successfully');
          this.getItem(MsAuditWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }

   
}
