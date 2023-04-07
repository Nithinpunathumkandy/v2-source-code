import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MeetingReportStatusMasterStore } from 'src/app/stores/masters/mrm/meeting-report-status-store';
import { Observable } from 'rxjs';
import { MeetingReportStatusPaginationResponse } from 'src/app/core/models/masters/mrm/meeting-report-status';

@Injectable({
  providedIn: 'root'
})
export class MeetingReportStatusService {

  constructor(private _http:HttpClient) { }

  // getAllItems() {
  //   return this._http.get('/meeting-report-statuses').pipe((
  //     map((res)=>{
  //       MeetingReportStatusMasterStore.setMeetingReportStatus(res)
  //       return res;
  //     })
  //   ))
  // }

  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MeetingReportStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MeetingReportStatusMasterStore.currentPage}`;
      if (MeetingReportStatusMasterStore.orderBy) params += `&order_by=${MeetingReportStatusMasterStore.orderItem}&order=${MeetingReportStatusMasterStore.orderBy}`;
    }
    if (MeetingReportStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + MeetingReportStatusMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MeetingReportStatusPaginationResponse>('/meeting-report-statuses' + (params ? params : '')).pipe(
      map((res: MeetingReportStatusPaginationResponse) => {
        MeetingReportStatusMasterStore.setMeetingReportStatus(res);
        return res;
      })
    );
  }

  sortMeetingReportStatusList(type:string, text:string) {
    if (!MeetingReportStatusMasterStore.orderBy) {
      MeetingReportStatusMasterStore.orderBy = 'asc';
      MeetingReportStatusMasterStore.orderItem = type;
    }
    else{
      if (MeetingReportStatusMasterStore.orderItem == type) {
        if(MeetingReportStatusMasterStore.orderBy == 'asc') MeetingReportStatusMasterStore.orderBy = 'desc';
        else MeetingReportStatusMasterStore.orderBy = 'asc'
      }
      else{
        MeetingReportStatusMasterStore.orderBy = 'asc';
        MeetingReportStatusMasterStore.orderItem = type;
      }
    }
  }

}
