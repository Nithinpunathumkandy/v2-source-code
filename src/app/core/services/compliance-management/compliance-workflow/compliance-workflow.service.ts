import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceWorkflowDetails, ComplianceWorkflowPaginationResponse, ModuleGroupsResponse } from 'src/app/core/models/compliance-management/compliance-workflow/compliance-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceWorkflowStore } from 'src/app/stores/compliance-management/compliance-workflow/compliance-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceWorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    saveRoleAdd(item: any,id) {
      return this._http.post('/compliance-workflows/'+id+'/items/role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_role_has_been_added');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserTeamAdd(item: any,id) {
      return this._http.post('/compliance-workflows/'+id+'/items/team', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_team_has_been_added');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveHeadOfUnitAdd(item: any,id) {
      return this._http.post('/compliance-workflows/'+id+'/items/unit-head', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_head_of_unit_has_been_added');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveSystemRole(item: any,id) {
      return this._http.post('/compliance-workflows/'+id+'/items/system-role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_system_role_has_been_added');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveDesignationAdd(item: any,id) {
      return this._http.post('/compliance-workflows/'+id+'/items/designation', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_designation_has_been_added!');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserAdd(item: any,id:any) {
      return this._http.post('/compliance-workflows/'+id+'/items/user', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_user_has_been_added');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    deleteWorkflowSections(id: number,workflowId) {
      return this._http.delete('/compliance-workflows/'+workflowId+'/items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_work_flow');
          this.getItem(ComplianceWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    getItem(id): Observable<ComplianceWorkflowDetails> {
      return this._http.get<ComplianceWorkflowDetails>('/compliance-workflows/'+id).pipe((
        map((res:ComplianceWorkflowDetails)=>{
          ComplianceWorkflowStore.setIndividualComplianceTemplate(res);
          return res;
        })
      ))
    }
  
    getAllItems(params:string): Observable<any[]>{
      if(ComplianceWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceWorkflowStore.searchText;
      return this._http.get<any[]>('/compliance-workflows'+ (params ? params : '')).pipe(
        map((res: any[]) => {
          ComplianceWorkflowStore.setAllComplianceTemplate(res["data"]);
          return res;
        })
      );
    }
  
    getItems(getAll: boolean = false, additionalParams?: string): Observable<ComplianceWorkflowPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ComplianceWorkflowStore.currentPage}&status=all`;
        if (ComplianceWorkflowStore.orderBy) params += `&order_by=${ComplianceWorkflowStore.orderItem}&order=${ComplianceWorkflowStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(ComplianceWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceWorkflowStore.searchText;
      return this._http.get<ComplianceWorkflowPaginationResponse>('/compliance-workflows' + (params ? params : '')).pipe(
        map((res: ComplianceWorkflowPaginationResponse) => {
          ComplianceWorkflowStore.setComplianceWorkflow(res);
          return res;
        })
      );
    }
  
    delete(id: number) {
      return this._http.delete('/compliance-workflows/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'compliance_work_flow_deleted_main');
          this.getAllItems('?module_group_ids=2500').subscribe()
          return res;
        })
      );
    }
  
    activate(id: number) {
      return this._http.put('/compliance-workflows/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'work_flow_activated_main');
          this.getAllItems('?module_group_ids=2500').subscribe()
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/compliance-workflows/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'work_flow_deactivated_main');
          this.getAllItems('?module_group_ids=2500').subscribe()
          return res;
        })
      );
    }
  
    generateTemplate() {
      this._http.get('/compliance-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_workflow_template	')+".xlsx");     
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (ComplianceWorkflowStore.orderBy) params += `&order=${ComplianceWorkflowStore.orderBy}`;
      if (ComplianceWorkflowStore.orderItem) params += `&order_by=${ComplianceWorkflowStore.orderItem}`;
      // if (ComplianceWorkflowStore.searchText) params += `&q=${ComplianceWorkflowStore.searchText}`;
      this._http.get('/compliance-workflows/export?module_group_ids=2500'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_workflows')+".xlsx");     
        }
      )
    }
  
    saveItem(item: any) {
      return this._http.post('/compliance-workflows', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'compliance_workflow_add');
          this.getAllItems('?module_group_ids=2500').subscribe()
          return res;
        })
      );
    }
  
    updateItem(id, data: any): Observable<any>{
      return this._http.put('/compliance-workflows/'+id,data).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'compliance_workflow_update');
        this.getAllItems('?module_group_ids=2500').subscribe()
        return res;
      }))
    }
  
    getModuleItems(params:string): Observable<ModuleGroupsResponse>{
      return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
        map((res: ModuleGroupsResponse) => {
          ComplianceWorkflowStore.setModuleGroups(res)
          return res;
        })
      );
    }
}
