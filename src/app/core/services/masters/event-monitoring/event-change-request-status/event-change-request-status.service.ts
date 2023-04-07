import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventChangeRequestStatusPaginationResponse } from 'src/app/core/models/masters/event-monitoring/event-change-request-status';
import { EventChaneRequestStatusMasterStore } from 'src/app/stores/masters/event-monitoring/event-change-request-status-store';

@Injectable({
  providedIn: 'root'
})
export class EventChangeRequestStatusService {

  constructor(
    private _http: HttpClient,
    
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<EventChangeRequestStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${EventChaneRequestStatusMasterStore.currentPage}`;
      if (EventChaneRequestStatusMasterStore.orderBy) params += `&order_by=${EventChaneRequestStatusMasterStore.orderItem}&order=${EventChaneRequestStatusMasterStore.orderBy}`;
    }
    if(EventChaneRequestStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+EventChaneRequestStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<EventChangeRequestStatusPaginationResponse>('/event-change-request-statuses' + (params ? params : '')).pipe(
      map((res: EventChangeRequestStatusPaginationResponse) => {
        EventChaneRequestStatusMasterStore.setEventChangeRequestStatus(res);
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

  sortEventChangeRequestStatusList(type:string, text:string) {
    if (!EventChaneRequestStatusMasterStore.orderBy) {
      EventChaneRequestStatusMasterStore.orderBy = 'asc';
      EventChaneRequestStatusMasterStore.orderItem = type;
    }
    else{
      if (EventChaneRequestStatusMasterStore.orderItem == type) {
        if(EventChaneRequestStatusMasterStore.orderBy == 'asc') EventChaneRequestStatusMasterStore.orderBy = 'desc';
        else EventChaneRequestStatusMasterStore.orderBy = 'asc'
      }
      else{
        EventChaneRequestStatusMasterStore.orderBy = 'asc';
        EventChaneRequestStatusMasterStore.orderItem = type;
      }
    }
  }
}
