import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventClosureStatusPaginationResponse } from 'src/app/core/models/masters/event-monitoring/event-closure-status';
import { EventClosureStatusMasterStore } from 'src/app/stores/masters/event-monitoring/event-closure-status-store';

@Injectable({
  providedIn: 'root'
})
export class EventClosureStatusService {

  constructor(
    private _http: HttpClient,
    
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<EventClosureStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventClosureStatusMasterStore.currentPage}`;
      if (EventClosureStatusMasterStore.orderBy) params += `&order_by=${EventClosureStatusMasterStore.orderItem}&order=${EventClosureStatusMasterStore.orderBy}`;
    }
    if(EventClosureStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventClosureStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<EventClosureStatusPaginationResponse>('/event-closure-statuses' + (params ? params : '')).pipe(
      map((res: EventClosureStatusPaginationResponse) => {
        EventClosureStatusMasterStore.setEventClosureStatus(res);
        return res;
      })
    );
  }

  // exportToExcel() {
  //   this._http.get('/event-closure-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_closure_status')
  //       +".xlsx");
  //     }
  //   )
  // }

  sortEventClosureStatusList(type:string, text:string) {
    if (!EventClosureStatusMasterStore.orderBy) {
      EventClosureStatusMasterStore.orderBy = 'asc';
      EventClosureStatusMasterStore.orderItem = type;
    }
    else{
      if (EventClosureStatusMasterStore.orderItem == type) {
        if(EventClosureStatusMasterStore.orderBy == 'asc') EventClosureStatusMasterStore.orderBy = 'desc';
        else EventClosureStatusMasterStore.orderBy = 'asc'
      }
      else{
        EventClosureStatusMasterStore.orderBy = 'asc';
        EventClosureStatusMasterStore.orderItem = type;
      }
    }
  }
}
