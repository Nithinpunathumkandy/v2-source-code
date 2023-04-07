import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { from, Observable, of } from 'rxjs';
import { map} from 'rxjs/operators';
import { TimeTrackerStore } from 'src/app/stores/project-management/time-tracker/time-tracker.store';
import { TimeTrackerPaginationResponse,TimeTrackerActivityPaginationResponse, IndividualTimeTrackerDetails, ProjectTimeTrackerPaginationResponse } from "src/app/core/models/project-management/time-tracker/time-tracker"
@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  TimeTrackerStore=TimeTrackerStore;
  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getItems(additionalParams?:string,is_all:boolean = false): Observable<TimeTrackerPaginationResponse> {
    let params = '';
    params = `?page=${TimeTrackerStore.currentPage}`;
    if (TimeTrackerStore.orderBy)
        params += `&order_by=${TimeTrackerStore.orderItem}&order=${TimeTrackerStore.orderBy}`;
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(TimeTrackerStore.searchText) params += (params ? '&q=' : '?q=')+TimeTrackerStore.searchText;
    return this._http
      .get<TimeTrackerPaginationResponse>('/project-time-trackers'+(params ? params : ''))
      .pipe(
        map((res: TimeTrackerPaginationResponse) => {
          TimeTrackerStore.setTimeTrackerList(res);
          return res;
        })
      );
  }

  getItem(id) : Observable<IndividualTimeTrackerDetails>{
    return this._http.get<IndividualTimeTrackerDetails>('/projects/'+id+'/time-tracker-details').pipe(
      map((res: IndividualTimeTrackerDetails) => {
        TimeTrackerStore.setIndiviualTimeTrackerDetails(res);
        return res;
      })
    );
  }

  getItemById(id) {
    return this._http.get<IndividualTimeTrackerDetails>('/project-time-trackers/'+id).pipe(
      map((res: IndividualTimeTrackerDetails) => {
        // TimeTrackerStore.setIndiviualTimeTrackerDetails(res);
        return res;
      })
    );
  }

  getProjectTimeTrackerDetails(id) : Observable<ProjectTimeTrackerPaginationResponse>{
    let params = '';
    params = (params == '') ? params + `?page=${TimeTrackerStore.projectTimeTrackerCurrentPage}` : params + `&page=${TimeTrackerStore.projectTimeTrackerCurrentPage}`;
    return this._http.get<ProjectTimeTrackerPaginationResponse>('/project-time-trackers'+(params ? params : '')+'&project_id='+id+'&order=desc').pipe(
      map((res: ProjectTimeTrackerPaginationResponse) => {
        TimeTrackerStore.setProjectTimeTrackerDetails(res);
        return res;
      })
    );
  }


  saveItem(item) {
    return this._http.post('/project-time-trackers', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'project_time_tracker_created_successfully');
        return res;
      })
    );
  }
  
  updateItem(id, item) {
    return this._http.put(`/project-time-trackers/${id}`, item).pipe(map((res: any) => {
      this._utilityService.showSuccessMessage('success', 'project_time_tracker_updated_successfully');
      return res;
    }))
  }

  getTimeTrackerActivity(params):Observable<TimeTrackerActivityPaginationResponse> {
    return this._http.get<TimeTrackerActivityPaginationResponse>('/project-time-tracker-activities'+params).pipe(map((res: TimeTrackerActivityPaginationResponse) => {
      TimeTrackerStore.setTimeTrackerActivity(res);
      return res;
    }))
  }

  delete(id):Observable<any> {
    return this._http.delete<any>('/project-time-trackers/'+id).pipe(map((res: any) => {
      this._utilityService.showSuccessMessage('success', 'project_time_tracker_deleted_successfully');
      return res;
    }))
  }
}


