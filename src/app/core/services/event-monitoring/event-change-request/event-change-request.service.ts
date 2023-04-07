import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventChangeRequestDetails, EventChangeRequestResponse } from 'src/app/core/models/event-monitoring/events/event-change-request';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectChangeRequest } from 'src/app/core/models/project-monitoring/project-change-request';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class EventChangeRequestService {

  constructor(private _http:HttpClient,private _helperService: HelperServiceService,
    private _utilityService:UtilityService) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<any>{
      let params = '';
      params = `?page=${EventChangeRequestStore.currentPage}`;
      if (EventChangeRequestStore.orderBy) params += `&order_by=${EventChangeRequestStore.orderItem}&order=${EventChangeRequestStore.orderBy}`;
      if(additionalParams) params += additionalParams;
      if(EventChangeRequestStore.searchText) params += (params ? '&q=' : '?q=')+EventChangeRequestStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_change_request' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<any>(`/event-change-requests` + (params ? params : '')).pipe(
        map((res: any) => {
          EventChangeRequestStore.setEventChangeRequests(res);
          return res;
        })
      );
    }

  getEventChangeRequestItems(additionalParams?){
    let params = '';
    params = `?page=${EventChangeRequestStore.currentPage}`;
    if (EventChangeRequestStore.orderBy) params += `&order_by=${EventChangeRequestStore.orderItem}&order=${EventChangeRequestStore.orderBy}`;
    if(additionalParams) params += additionalParams;
    if(EventChangeRequestStore.searchText) params += (params ? '&q=' : '?q=')+EventChangeRequestStore.searchText;
    return this._http.get<EventChangeRequestResponse>(`/events/${EventsStore.selectedEventId}/change-requests` + (params ? params : '')).pipe(
      map((res: EventChangeRequestResponse) => {
        EventChangeRequestStore.setEventChangeRequests(res);
        return res;
      })
    );
  }

  getItem(id){
    return this._http.get<EventChangeRequestDetails>(`/event-change-request-items/${id}`).pipe(
      map((res: EventChangeRequestDetails) => {
        EventChangeRequestStore.setIndividualItem(res)
        return res;
      })
    );
  }

  getIndividualItem(eventId,id){
    return this._http.get<EventChangeRequestDetails>(`/events/${eventId}/change-requests/${id}`).pipe(
      map((res: EventChangeRequestDetails) => {
        EventChangeRequestStore.setIndividualItem(res)
        return res;
      })
    );
  }

  updateChangeRequestItems(item,id){
    return this._http.put(`/events/${EventsStore.selectedEventId}/change-requests/${id}`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','em_cr_updated_message');
        this.getIndividualItem(EventsStore.selectedEventId,id).subscribe();
        return res;
      })
    );
  }

  save(item,eventId){
    return this._http.post(`/events/${eventId}/change-requests`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','events_cr_added');
        return res;
      })
    );
  }

  delete(id,eventId){
    return this._http.delete<any>(`/events/${eventId}/change-requests/${id}`).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success','event_change_request_deleted');
        let listSubscribe = this.getItems();
        if(EventsStore.selectedEventId) listSubscribe = this.getEventChangeRequestItems(EventsStore.selectedEventId);
        listSubscribe.subscribe(resp=>{
          if(resp.from==null){
            EventChangeRequestStore.setCurrentPage(resp.current_page-1);
            // this.getOutcome(EventsStore.selectedEventId);
            if(EventsStore.selectedEventId) this.getEventChangeRequestItems(eventId).subscribe();
            else this.getItems().subscribe();
          }
        });
        return res;
      })
    );
  }

  saveDuration(item,id){
    return this._http.post(`/events/${EventsStore.selectedEventId}/change-requests/${id}/event-date`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','em_cr_duration_saved');
        return res;
      })
    );
  }

  saveBudget(item,id){
    return this._http.post(`/events/${EventsStore.selectedEventId}/change-requests/${id}/event-budget`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','em_cr_budget_saved');
        return res;
      })
    );
  }

  saveScope(item,id){
    return this._http.post(`/events/${EventsStore.selectedEventId}/change-requests/${id}/event-scope`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','em_cr_scope_saved');
        return res;
      })
    );
  }

  saveDeliverable(item,id){
    return this._http.post(`/events/${EventsStore.selectedEventId}/change-requests/${id}/deliverable`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','em_cr_deliverable_saved');
        return res;
      })
    );
  }

  saveStatus(item,id){
    return this._http.post(`/events/${EventsStore.selectedEventId}/change-requests/${id}/event-status`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','em_cr_status_saved');
        return res;
      })
    );
  }

  createChangeRequest(item)
  {
    return this._http.post(`/events/${EventsStore.selectedEventId}/change-requests`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','change_request_created');
        this.getEventChangeRequestItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    let params=''
    if(EventChangeRequestStore.searchText) params += (params ? '&q=' : '?q=')+EventChangeRequestStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_event_change_request' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get(`/event-change-requests/export`+(params ? params : ''),{ responseType: 'blob' as 'json' } ).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_change_request')+".xlsx");
      }
    )
  }

  sortEventChangeReqList(type: string) {
    if (!EventChangeRequestStore.orderBy) {
      EventChangeRequestStore.orderBy = 'asc';
      EventChangeRequestStore.orderItem = type;
    }
    else {
      if (EventChangeRequestStore.orderItem == type) {
        if (EventChangeRequestStore.orderBy == 'asc') EventChangeRequestStore.orderBy = 'desc';
        else EventChangeRequestStore.orderBy = 'asc'
      }
      else {
        EventChangeRequestStore.orderBy = 'asc';
        EventChangeRequestStore.orderItem = type;
      }
    }
  }
}
