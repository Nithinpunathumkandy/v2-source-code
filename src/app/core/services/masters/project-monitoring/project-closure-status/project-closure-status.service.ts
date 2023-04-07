import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectClosureStatus, ProjectClosureStatusPaginationResponse } from 'src/app/core/models/masters/project-monitoring/project-closure-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectClosureStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-closure-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectClosureStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectClosureStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectClosureStatusMasterStore.currentPage}`;
        if (ProjectClosureStatusMasterStore.orderBy) params += `&order_by=${ProjectClosureStatusMasterStore.orderItem}&order=${ProjectClosureStatusMasterStore.orderBy}`;
      }
      if(ProjectClosureStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectClosureStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectClosureStatusPaginationResponse>('/project-monitor-closure-statuses' + (params ? params : '')).pipe(
        map((res: ProjectClosureStatusPaginationResponse) => {
          ProjectClosureStatusMasterStore.setProjectClosureStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<ProjectClosureStatus> {
      return this._http.get<ProjectClosureStatus>('/project-monitor-closure-statuses/' + id).pipe(
        map((res: ProjectClosureStatus) => {
          ProjectClosureStatusMasterStore.updateProjectClosureStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-monitor-closure-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-monitor-closure-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/project-monitor-closure-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_monitor_closure_status') + ".xlsx");
        }
      )
    }


    sortProjectClosureStatusList(type:string, text:string) {
      if (!ProjectClosureStatusMasterStore.orderBy) {
        ProjectClosureStatusMasterStore.orderBy = 'asc';
        ProjectClosureStatusMasterStore.orderItem = type;
      }
      else{
        if (ProjectClosureStatusMasterStore.orderItem == type) {
          if(ProjectClosureStatusMasterStore.orderBy == 'asc') ProjectClosureStatusMasterStore.orderBy = 'desc';
          else ProjectClosureStatusMasterStore.orderBy = 'asc'
        }
        else{
          ProjectClosureStatusMasterStore.orderBy = 'asc';
          ProjectClosureStatusMasterStore.orderItem = type;
        }
      }
    }
}
