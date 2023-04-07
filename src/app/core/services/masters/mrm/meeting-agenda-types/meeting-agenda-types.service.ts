import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MeetingAgendaTypeMasterStore } from 'src/app/stores/masters/mrm/meeting-agenda-type-store';
import { MeetingAgendaTypePaginationResponse } from 'src/app/core/models/masters/mrm/meeting-agenda-type';

@Injectable({
  providedIn: 'root'
})
export class MeetingAgendaTypesService {

  constructor(private _http:HttpClient) { }

  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MeetingAgendaTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MeetingAgendaTypeMasterStore.currentPage}`;
      if (MeetingAgendaTypeMasterStore.orderBy) params += `&order_by=${MeetingAgendaTypeMasterStore.orderItem}&order=${MeetingAgendaTypeMasterStore.orderBy}`;
    }
    if (MeetingAgendaTypeMasterStore.searchText) params += (params ? '&q=' : '?q=') + MeetingAgendaTypeMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MeetingAgendaTypePaginationResponse>('/meeting-agenda-types' + (params ? params : '')).pipe(
      map((res: MeetingAgendaTypePaginationResponse) => {
        MeetingAgendaTypeMasterStore.setMeetingAgendaType(res);
        return res;
      })
    );
  }

  sortMeetingActionPlanStatusList(type:string) {
    if (!MeetingAgendaTypeMasterStore.orderBy) {
      MeetingAgendaTypeMasterStore.orderBy = 'asc';
      MeetingAgendaTypeMasterStore.orderItem = type;
    }
    else{
      if (MeetingAgendaTypeMasterStore.orderItem == type) {
        if(MeetingAgendaTypeMasterStore.orderBy == 'asc') MeetingAgendaTypeMasterStore.orderBy = 'desc';
        else MeetingAgendaTypeMasterStore.orderBy = 'asc'
      }
      else{
        MeetingAgendaTypeMasterStore.orderBy = 'asc';
        MeetingAgendaTypeMasterStore.orderItem = type;
      }
    }
  }
}
