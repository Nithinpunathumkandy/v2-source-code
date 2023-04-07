import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectWorkflowDetail, ProjectWorkflowHistoryPaginationResponse } from 'src/app/core/models/project-monitoring/project-workflow-modal';
import { ProjectWorkflowStore } from 'src/app/stores/project-monitoring/project-workflow.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { ProjectChangeRequestWorkflowDetail, ProjectWorkflowChangeRequestHistoryPaginationResponse } from 'src/app/core/models/project-monitoring/project-change-request-workfloww';
import { ProjectClosureStatusMasterStore } from 'src/app/stores/masters/project-monitoring/project-closure-status-store';
import { ProjectChangeRequestWorkflowStore } from 'src/app/stores/project-monitoring/project-change-request-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectChangeRequestWorkflowService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(id): Observable<ProjectChangeRequestWorkflowDetail> {
    return this._http.get<ProjectChangeRequestWorkflowDetail>('/project-monitor/change-request/'+id+'/workflow').pipe((
      map((res:ProjectChangeRequestWorkflowDetail)=>{
        ProjectChangeRequestWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<ProjectWorkflowChangeRequestHistoryPaginationResponse> {
    let params = '';
      params = `?page=${ProjectChangeRequestWorkflowStore.currentPage}`;
    return this._http.get<ProjectWorkflowChangeRequestHistoryPaginationResponse>('/project-monitor/change-request/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: ProjectWorkflowChangeRequestHistoryPaginationResponse) => {
        ProjectChangeRequestWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProject(id,item?) {
    return this._http.put('/project-monitor/change-request/' + id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project change request submitted successfully');
        
        return res;
      })
    );
  }

  approveProject(id,comment) {
    return this._http.put('/project-monitor/change-request/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project change request approved successfully');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertProject(id,data) {
    return this._http.put('/project-monitor/change-request/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project change request reverted successfully');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/project-monitor/change-request/' + id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project change request rejected successfully');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
