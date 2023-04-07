import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectWorkflowDetail, ProjectWorkflowHistoryPaginationResponse } from 'src/app/core/models/project-monitoring/project-workflow-modal';
import { ProjectWorkflowStore } from 'src/app/stores/project-monitoring/project-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectWorkflowService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(id): Observable<ProjectWorkflowDetail> {
    return this._http.get<ProjectWorkflowDetail>('/project-monitor/projects/'+id+'/workflow').pipe((
      map((res:ProjectWorkflowDetail)=>{
        ProjectWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<ProjectWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${ProjectWorkflowStore.currentPage}`;
    return this._http.get<ProjectWorkflowHistoryPaginationResponse>('/project-monitor/projects/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: ProjectWorkflowHistoryPaginationResponse) => {
        ProjectWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProject(id,item?) {
    return this._http.put('/project-monitor/projects/' + id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project  submitted successfuly');
        
        return res;
      })
    );
  }

  approveProject(id,comment) {
    return this._http.put('/project-monitor/projects/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project approved successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertProject(id,data) {
    return this._http.put('/project-monitor/projects/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project reverted successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/project-monitor/projects/' + id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project rejected successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
}
