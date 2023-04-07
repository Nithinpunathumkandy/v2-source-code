import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CIWorkflow, CIWorkflowPaginationResponse, ModuleGroupsResponse, SingleCIWorkflow } from 'src/app/core/models/cyber-incident/cyber-incident-workflow-modal';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentWorkflowStore } from 'src/app/stores/cyber-incident/cyber-incident-workflow-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentWorkflowService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<CIWorkflowPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${CyberIncidentWorkflowStore.currentPage}&status=all`;
        if (CyberIncidentWorkflowStore.orderBy) params += `&order_by=${CyberIncidentWorkflowStore.orderItem}&order=${CyberIncidentWorkflowStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(CyberIncidentWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+CyberIncidentWorkflowStore.searchText;
      return this._http.get<CIWorkflowPaginationResponse>('/cyber-incident/cyber-incident-workflows' + (params ? params : '')).pipe(
        map((res: CIWorkflowPaginationResponse) => {
          CyberIncidentWorkflowStore.setCyberIncidentWorkflow(res);
          return res;
        })
      );
    }

    getItem(id): Observable<SingleCIWorkflow> {
      return this._http.get<SingleCIWorkflow>('/cyber-incident/cyber-incident-workflows/'+id).pipe((
        map((res:SingleCIWorkflow)=>{
          CyberIncidentWorkflowStore.setIndividualRiskTemplate(res);
          return res;
        })
      ))
    }

    getAllItems(params:string): Observable<CIWorkflow[]>{
      if(CyberIncidentWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+CyberIncidentWorkflowStore.searchText;
      return this._http.get<CIWorkflow[]>('/cyber-incident/cyber-incident-workflows'+ (params ? params : '')).pipe(
        map((res: CIWorkflow[]) => {
          CyberIncidentWorkflowStore.setAllRiskTemplate(res["data"]);
          return res;
        })
      );
    }

    saveItem(item: any) {
      return this._http.post('/cyber-incident/cyber-incident-workflows', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'Cyber Incident Workflow Created successfully');
          this.getAllItems('?module_group_ids=4800').subscribe();
          return res;
        })
      );
    }
  
    updateItem(id, data: any): Observable<any>{
      return this._http.put('/cyber-incident/cyber-incident-workflows/'+id,data).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'Cyber Incident Workflow Updated successfully');
        this.getAllItems('?module_group_ids=4800').subscribe();        
        return res;
      }))
    }
  
    delete(id: number) {
      return this._http.delete('/cyber-incident/cyber-incident-workflows/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Cyber Incident Workflow Deleted successfully');
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/cyber-incident/cyber-incident-workflows/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Cyber Incident Workflow Activated Successfully');
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/cyber-incident/cyber-incident-workflows/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Cyber Incident Workflow Deactivated Successfully');
          return res;
        })
      );
    }
   
    generateTemplate() {
      this._http.get('/cyber-incident/cyber-incident-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Cyber Incident Workflow Template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/cyber-incident/cyber-incident-workflows/export?module_group_ids=4800', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Cyber Incident Workflow')+".xlsx");
        }
      )
    }

    getModuleItems(params:string): Observable<ModuleGroupsResponse>{
      return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
        map((res: ModuleGroupsResponse) => {
          CyberIncidentWorkflowStore.setModuleGroups(res)
          return res;
        })
      );
    }

    deleteWorkflowSections(id: number,workflowId) {
      return this._http.delete('/cyber-incident/cyber-incident-workflows/'+workflowId+'/items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Cyber Incident Workflow User Deleted Successfully');
          this.getItem(CyberIncidentWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }

    saveRoleAdd(item: any,id) {
      return this._http.post('/cyber-incident/cyber-incident-workflows/'+id+'/items/role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Cyber Incident Workflow User Added Successfully');
          this.getItem(CyberIncidentWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserTeamAdd(item: any,id) {
      return this._http.post('/cyber-incident/cyber-incident-workflows/'+id+'/items/team', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Cyber Incident Workflow Team Added Successfully');
          this.getItem(CyberIncidentWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveHeadOfUnitAdd(item: any,id) {
      return this._http.post('/cyber-incident/cyber-incident-workflows/'+id+'/items/unit-head', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Cyber Incident Workflow Head Of Unit Added Successfully');
          this.getItem(CyberIncidentWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveDesignationAdd(item: any,id) {
      return this._http.post('/cyber-incident/cyber-incident-workflows/'+id+'/items/designation', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Cyber Incident Workflow Desigination Added Successfully');
          this.getItem(CyberIncidentWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserAdd(item: any,id:any) {
      return this._http.post('/cyber-incident/cyber-incident-workflows/'+id+'/items/user', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Cyber Incident Workflow User Added successfully');
          this.getItem(CyberIncidentWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
}
