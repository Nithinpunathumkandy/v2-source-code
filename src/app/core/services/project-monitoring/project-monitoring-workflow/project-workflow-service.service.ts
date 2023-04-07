import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleGroupsResponse, ProjectWorkflow, ProjectWorkflowPaginationResponse, SingleProjectWorkflow } from 'src/app/core/models/project-monitoring/project-monitoring-workflow.modal';
import { ProjectMonitoringWorkflowStore } from 'src/app/stores/project-monitoring/project-monitoring-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectWorkflowServiceService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<ProjectWorkflowPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectMonitoringWorkflowStore.currentPage}&status=all`;
        if (ProjectMonitoringWorkflowStore.orderBy) params += `&order_by=${ProjectMonitoringWorkflowStore.orderItem}&order=${ProjectMonitoringWorkflowStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(ProjectMonitoringWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+ProjectMonitoringWorkflowStore.searchText;
      return this._http.get<ProjectWorkflowPaginationResponse>('/project-monitor/project-workflows' + (params ? params : '')).pipe(
        map((res: ProjectWorkflowPaginationResponse) => {
          ProjectMonitoringWorkflowStore.setProjectWorkflow(res);
          return res;
        })
      );
    }

    getItem(id): Observable<SingleProjectWorkflow> {
      return this._http.get<SingleProjectWorkflow>('/project-monitor/project-workflows/'+id).pipe((
        map((res:SingleProjectWorkflow)=>{
          ProjectMonitoringWorkflowStore.setIndividualRiskTemplate(res);
          return res;
        })
      ))
    }

    getAllItems(params:string): Observable<ProjectWorkflow[]>{
      if(ProjectMonitoringWorkflowStore.searchText) params += (params ? '&q=' : '?q=')+ProjectMonitoringWorkflowStore.searchText;
      return this._http.get<ProjectWorkflow[]>('/project-monitor/project-workflows'+ (params ? params : '')).pipe(
        map((res: ProjectWorkflow[]) => {
          ProjectMonitoringWorkflowStore.setAllRiskTemplate(res["data"]);
          return res;
        })
      );
    }

    saveItem(item: any) {
      return this._http.post('/project-monitor/project-workflows', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'Poject workflow created successfuly');
          this.getAllItems('?module_group_ids=3700').subscribe();
          return res;
        })
      );
    }
  
    updateItem(id, data: any): Observable<any>{
      return this._http.put('/project-monitor/project-workflows/'+id,data).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success', 'Poject workflow updated successfuly');
        this.getAllItems('?module_group_ids=3700').subscribe();        
        return res;
      }))
    }
  
    delete(id: number) {
      return this._http.delete('/project-monitor/project-workflows/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Poject workflow deleted successfuly');
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-monitor/project-workflows/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Poject workflow activated successfuly');
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-monitor/project-workflows/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Poject workflow deactivated successfuly');
          return res;
        })
      );
    }
   
    generateTemplate() {
      this._http.get('/project-monitor/project-workflows/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Project workflow template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/project-monitor/projecct-workflows/export?module_group_ids=3200', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Project')+".xlsx");
        }
      )
    }

    getModuleItems(params:string): Observable<ModuleGroupsResponse>{
      return this._http.get<ModuleGroupsResponse>('/modules'+(params ? params : '')).pipe(
        map((res: ModuleGroupsResponse) => {
          ProjectMonitoringWorkflowStore.setModuleGroups(res)
          return res;
        })
      );
    }

    deleteWorkflowSections(id: number,workflowId) {
      return this._http.delete('/project-monitor/project-workflows/'+workflowId+'/items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Project workflow user deleted successfuly');
          this.getItem(ProjectMonitoringWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }

    saveRoleAdd(item: any,id) {
      return this._http.post('/project-monitor/project-workflows/'+id+'/items/role', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Project workflow user added successfuly');
          this.getItem(ProjectMonitoringWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserTeamAdd(item: any,id) {
      return this._http.post('/project-monitor/project-workflows/'+id+'/items/team', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Project workflow team added successfuly');
          this.getItem(ProjectMonitoringWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveHeadOfUnitAdd(item: any,id) {
      return this._http.post('/project-monitor/project-workflows/'+id+'/items/unit-head', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Project workflow head of unit added successfuly');
          this.getItem(ProjectMonitoringWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveDesignationAdd(item: any,id) {
      return this._http.post('/project-monitor/project-workflows/'+id+'/items/designation', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Project workflow desigination added successfuly');
          this.getItem(ProjectMonitoringWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
  
    saveUserAdd(item: any,id:any) {
      return this._http.post('/project-monitor/project-workflows/'+id+'/items/user', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Project workflow user added successfuly');
          this.getItem(ProjectMonitoringWorkflowStore.workflowId).subscribe();
          return res;
        })
      );
    }
}


