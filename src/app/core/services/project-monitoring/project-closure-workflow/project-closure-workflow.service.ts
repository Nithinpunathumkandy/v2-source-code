import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectClosureWorkflowDetail, ProjectClosureWorkflowHistoryPaginationResponse } from 'src/app/core/models/project-monitoring/project-closure-workflow';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectClosureWorkflowStore } from 'src/app/stores/project-monitoring/project-closure-workflow.store';
@Injectable({
  providedIn: 'root'
})
export class ProjectClosureWorkflowService {

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService
  ) { }

  getItems(id): Observable<ProjectClosureWorkflowDetail> {
    return this._http.get<ProjectClosureWorkflowDetail>('/project-monitor/project-closures/'+id+'/workflow').pipe((
      map((res:ProjectClosureWorkflowDetail)=>{
        ProjectClosureWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<ProjectClosureWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${ProjectClosureWorkflowStore.currentPage}`;
    return this._http.get<ProjectClosureWorkflowHistoryPaginationResponse>('/project-monitor/project-closures/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: ProjectClosureWorkflowHistoryPaginationResponse) => {
        ProjectClosureWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProjectClosure(id) {
    return this._http.put('/project-monitor/project-closures/' + id+'/submit',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project closure submitted successfully');
        
        return res;
      })
    );
  }

  approveProjectClosure(id,comment) {
    return this._http.put('/project-monitor/project-closures/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project closure approved successfully');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertProjectClosure(id,data) {
    return this._http.put('/project-monitor/project-closures/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project closure reverted successfully');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  rejectProjectClosure(id,data) {
    return this._http.put('/project-monitor/project-closures/' + id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Project closure rejected successfully');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  
}
