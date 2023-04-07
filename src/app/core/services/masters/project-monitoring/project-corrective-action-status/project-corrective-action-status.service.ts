import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectCorrectiveActionStatus, ProjectCorrectiveActionStatusPaginationResponse } from 'src/app/core/models/masters/project-monitoring/project-corrective-action-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectCorrectiveActionStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-corrective-action-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectCorrectiveActionStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectCorrectiveActionStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectCorrectiveActionStatusMasterStore.currentPage}`;
        if (ProjectCorrectiveActionStatusMasterStore.orderBy) params += `&order_by=${ProjectCorrectiveActionStatusMasterStore.orderItem}&order=${ProjectCorrectiveActionStatusMasterStore.orderBy}`;
      }
      if(ProjectCorrectiveActionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectCorrectiveActionStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectCorrectiveActionStatusPaginationResponse>('/project-issue-corrective-action-statuses' + (params ? params : '')).pipe(
        map((res: ProjectCorrectiveActionStatusPaginationResponse) => {
          ProjectCorrectiveActionStatusMasterStore.setProjectCorrectiveActionStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<ProjectCorrectiveActionStatus> {
      return this._http.get<ProjectCorrectiveActionStatus>('/project-issue-corrective-action-statuses/' + id).pipe(
        map((res: ProjectCorrectiveActionStatus) => {
          ProjectCorrectiveActionStatusMasterStore.updateProjectCorrectiveActionStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-issue-corrective-action-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-issue-corrective-action-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/project-issue-corrective-action-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_monitor_corrective_action_status') + ".xlsx");
        }
      )
    }


    sortProjectCorrectiveActionStatusList(type:string, text:string) {
      if (!ProjectCorrectiveActionStatusMasterStore.orderBy) {
        ProjectCorrectiveActionStatusMasterStore.orderBy = 'asc';
        ProjectCorrectiveActionStatusMasterStore.orderItem = type;
      }
      else{
        if (ProjectCorrectiveActionStatusMasterStore.orderItem == type) {
          if(ProjectCorrectiveActionStatusMasterStore.orderBy == 'asc') ProjectCorrectiveActionStatusMasterStore.orderBy = 'desc';
          else ProjectCorrectiveActionStatusMasterStore.orderBy = 'asc'
        }
        else{
          ProjectCorrectiveActionStatusMasterStore.orderBy = 'asc';
          ProjectCorrectiveActionStatusMasterStore.orderItem = type;
        }
      }
    }
}
