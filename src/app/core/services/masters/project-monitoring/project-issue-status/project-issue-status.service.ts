import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProjectIssueStatus,ProjectIssueStatusPaginationResponse} from 'src/app/core/models/masters/project-monitoring/project-issue-status'
import {ProjectIssueStatusMasterStore} from 'src/app/stores/masters/project-monitoring/project-issue-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectIssueStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectIssueStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectIssueStatusMasterStore.currentPage}`;
      if (ProjectIssueStatusMasterStore.orderBy)
        params += `&order_by=${ProjectIssueStatusMasterStore.orderItem}&order=${ProjectIssueStatusMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += params?'&status=all':'?status=all';
    if(ProjectIssueStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectIssueStatusMasterStore.searchText;

    
    return this._http
      .get<ProjectIssueStatusPaginationResponse>('/project-issue-statuses'+(params ? params : ''))
      .pipe(
        map((res: ProjectIssueStatusPaginationResponse) => {
          ProjectIssueStatusMasterStore.setProjectIssueStatus(res);
          return res;
        })
      );
  }

  exportToExcel() {
    this._http.get('/project-objectives/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_issue_status')+".xlsx");
      }
    )
  }
  

  activate(id: number) {
    return this._http.put('/project-issue-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-issue-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortProjectObjectiveList(type:string, text:string) {
    if (!ProjectIssueStatusMasterStore.orderBy) {
      ProjectIssueStatusMasterStore.orderBy = 'asc';
      ProjectIssueStatusMasterStore.orderItem = type;
    }
    else{
      if (ProjectIssueStatusMasterStore.orderItem == type) {
        if(ProjectIssueStatusMasterStore.orderBy == 'asc') ProjectIssueStatusMasterStore.orderBy = 'desc';
        else ProjectIssueStatusMasterStore.orderBy = 'asc'
      }
      else{
        ProjectIssueStatusMasterStore.orderBy = 'asc';
        ProjectIssueStatusMasterStore.orderItem = type;
      }
    }
  }
}
