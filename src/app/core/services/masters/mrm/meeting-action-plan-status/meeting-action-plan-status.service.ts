import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MeetingActionPlanStatusMasterStore } from 'src/app/stores/masters/mrm/meeting-action-plan-status-store';
import { MeetingActionPlanStatusPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-action-plan-status';
@Injectable({
  providedIn: 'root'
})
export class MeetingActionPlanStatusService {

  constructor(private _http:HttpClient) { }

  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MeetingActionPlanStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MeetingActionPlanStatusMasterStore.currentPage}`;
      if (MeetingActionPlanStatusMasterStore.orderBy) params += `&order_by=${MeetingActionPlanStatusMasterStore.orderItem}&order=${MeetingActionPlanStatusMasterStore.orderBy}`;
    }
    if (MeetingActionPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + MeetingActionPlanStatusMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MeetingActionPlanStatusPaginationResponse>('/meeting-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: MeetingActionPlanStatusPaginationResponse) => {
        MeetingActionPlanStatusMasterStore.setMeetingActionPlanStatus(res);
        return res;
      })
    );
  }

  sortMeetingActionPlanStatusList(type:string) {
    if (!MeetingActionPlanStatusMasterStore.orderBy) {
      MeetingActionPlanStatusMasterStore.orderBy = 'asc';
      MeetingActionPlanStatusMasterStore.orderItem = type;
    }
    else{
      if (MeetingActionPlanStatusMasterStore.orderItem == type) {
        if(MeetingActionPlanStatusMasterStore.orderBy == 'asc') MeetingActionPlanStatusMasterStore.orderBy = 'desc';
        else MeetingActionPlanStatusMasterStore.orderBy = 'asc'
      }
      else{
        MeetingActionPlanStatusMasterStore.orderBy = 'asc';
        MeetingActionPlanStatusMasterStore.orderItem = type;
      }
    }
  }

}
