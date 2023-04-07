import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectChangeRequestStatus, ProjectChangeRequestStatusPaginationResponse } from 'src/app/core/models/masters/project-monitoring/project-change-request-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectChangeRequestStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-change-request-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class ProjectChangeRequestStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectChangeRequestStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectChangeRequestStatusMasterStore.currentPage}`;
        if (ProjectChangeRequestStatusMasterStore.orderBy) params += `&order_by=${ProjectChangeRequestStatusMasterStore.orderItem}&order=${ProjectChangeRequestStatusMasterStore.orderBy}`;
      }
      if(ProjectChangeRequestStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectChangeRequestStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectChangeRequestStatusPaginationResponse>('/project-monitor-change-request-statuses' + (params ? params : '')).pipe(
        map((res: ProjectChangeRequestStatusPaginationResponse) => {
          ProjectChangeRequestStatusMasterStore.setProjectChangeRequestStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<ProjectChangeRequestStatus> {
      return this._http.get<ProjectChangeRequestStatus>('/project-monitor-change-request-statuses/' + id).pipe(
        map((res: ProjectChangeRequestStatus) => {
          ProjectChangeRequestStatusMasterStore.updateProjectChangeRequestStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-monitor-change-request-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-monitor-change-request-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/project-monitor-change-request-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_monitor_change_request_status') + ".xlsx");
        }
      )
    }


    sortProjectChangeRequestStatusList(type:string, text:string) {
      if (!ProjectChangeRequestStatusMasterStore.orderBy) {
        ProjectChangeRequestStatusMasterStore.orderBy = 'asc';
        ProjectChangeRequestStatusMasterStore.orderItem = type;
      }
      else{
        if (ProjectChangeRequestStatusMasterStore.orderItem == type) {
          if(ProjectChangeRequestStatusMasterStore.orderBy == 'asc') ProjectChangeRequestStatusMasterStore.orderBy = 'desc';
          else ProjectChangeRequestStatusMasterStore.orderBy = 'asc'
        }
        else{
          ProjectChangeRequestStatusMasterStore.orderBy = 'asc';
          ProjectChangeRequestStatusMasterStore.orderItem = type;
        }
      }
    }
}
