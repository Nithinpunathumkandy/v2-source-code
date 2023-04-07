import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ProjectChangeRequest, ProjectChangeRequestItems, ProjectChangeRequestResponse } from 'src/app/core/models/project-monitoring/project-change-request';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectChangeRequestStatusPaginationResponse } from 'src/app/core/models/masters/project-monitoring/project-change-request-status';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectChangeRequestService {

  constructor(private _http:HttpClient,private _helperService: HelperServiceService,
    private _utilityService:UtilityService) { }

    getAllItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectChangeRequestResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectChangeRequestStore.currentPage}`;
        if (ProjectChangeRequestStore.orderBy) params += `&order_by=${ProjectChangeRequestStore.orderItem}&order=${ProjectChangeRequestStore.orderBy}`;
  
      }
      if(additionalParams) params += additionalParams;
      if(ProjectChangeRequestStore.searchText) params += (params ? '&q=' : '?q=')+ProjectChangeRequestStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'project_change_request' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ProjectChangeRequestResponse>(`/project-monitor/project-change-requests` + (params ? params : '')).pipe(
        map((res: ProjectChangeRequestResponse) => {
          ProjectChangeRequestStore.setProjectChangeRequests(res);
          return res;
        })
      );
   
    }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectChangeRequestResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectChangeRequestStore.currentPage}`;
        if (ProjectChangeRequestStore.orderBy) params += `&order_by=${ProjectChangeRequestStore.orderItem}&order=${ProjectChangeRequestStore.orderBy}`;
  
      }
      if(additionalParams) params += additionalParams;
      if(ProjectChangeRequestStore.searchText) params += (params ? '&q=' : '?q=')+ProjectChangeRequestStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'project_issue' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ProjectChangeRequestResponse>(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request` + (params ? params : '')).pipe(
        map((res: ProjectChangeRequestResponse) => {
          ProjectChangeRequestStore.setProjectChangeRequests(res);
          return res;
        })
      );
   
    }

  getItem() : Observable<ProjectChangeRequestItems>{
    return this._http.get<ProjectChangeRequestItems>(`/project-change-request-items`).pipe(
      map((res: ProjectChangeRequestItems) => {
        ProjectChangeRequestStore.setChangeRequestItems(res)
        return res;
      })
    );
  }

  exportToExcel(params:string='') {
    this._http.get('/project-monitor/project-change-requests/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Change request') +".xlsx");
      }
    )
  }

  deleteChangeRequestItem(id){
    return this._http.delete(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Change request deleted successfully');
        return res;
      })
    );
  }

  getIndividualItem(id){
    return this._http.get<ProjectChangeRequest>(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}`).pipe(
      map((res: ProjectChangeRequest) => {
        ProjectChangeRequestStore.setIndividualItem(res)
        return res;
      })
    );
  }

  saveChangeRequestItems(item){
    return this._http.post(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','Change request saved successfully');
        return res;
      })
    );
  }

  updateChangeRequestItems(item,id){
    return this._http.put(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','Change request updated successfully');
        return res;
      })
    );
  }

  saveDuration(item,id){
    return this._http.post(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}/duration`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','Duration Changed successfully');
        return res;
      })
    );
  }

  saveTeam(item,id){
    return this._http.post(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}/team`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','Project team changed successfully');
        return res;
      })
    );
  }

  saveScopeOfWork(item,id){
    return this._http.post(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}/scope`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','Project scopes changed successfully');
        return res;
      })
    );
  }

  saveBudget(item,id){
    return this._http.post(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}/budget`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','Project budget changed successfully');
        return res;
      })
    );
  }

    saveDelivarables(item,id){
      return this._http.post(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/change-request/${id}/deliverable`, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','Project de changed successfully');
          return res;
        })
      );
  }
}
