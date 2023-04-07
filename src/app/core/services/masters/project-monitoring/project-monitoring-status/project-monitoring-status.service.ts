import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectMonitoringStatus, ProjectMonitoringStatusPaginationResponse } from 'src/app/core/models/masters/project-monitoring/project-monitoring-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectMonitoringStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-monitoring-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectMonitoringStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectMonitoringStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectMonitoringStatusMasterStore.currentPage}`;
        if (ProjectMonitoringStatusMasterStore.orderBy) params += `&order_by=${ProjectMonitoringStatusMasterStore.orderItem}&order=${ProjectMonitoringStatusMasterStore.orderBy}`;
      }
      if(ProjectMonitoringStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectMonitoringStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectMonitoringStatusPaginationResponse>('/project-monitoring-statuses' + (params ? params : '')).pipe(
        map((res: ProjectMonitoringStatusPaginationResponse) => {
          ProjectMonitoringStatusMasterStore.setProjectMonitoringStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<ProjectMonitoringStatus> {
      return this._http.get<ProjectMonitoringStatus>('/project-monitoring-statuses/' + id).pipe(
        map((res: ProjectMonitoringStatus) => {
          ProjectMonitoringStatusMasterStore.updateProjectMonitoringStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-monitoring-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-monitoring-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/project-monitoring-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_monitoring_status') + ".xlsx");
        }
      )
    }


    sortProjectMonitoringStatusList(type:string, text:string) {
      if (!ProjectMonitoringStatusMasterStore.orderBy) {
        ProjectMonitoringStatusMasterStore.orderBy = 'asc';
        ProjectMonitoringStatusMasterStore.orderItem = type;
      }
      else{
        if (ProjectMonitoringStatusMasterStore.orderItem == type) {
          if(ProjectMonitoringStatusMasterStore.orderBy == 'asc') ProjectMonitoringStatusMasterStore.orderBy = 'desc';
          else ProjectMonitoringStatusMasterStore.orderBy = 'asc'
        }
        else{
          ProjectMonitoringStatusMasterStore.orderBy = 'asc';
          ProjectMonitoringStatusMasterStore.orderItem = type;
        }
      }
    }
}
