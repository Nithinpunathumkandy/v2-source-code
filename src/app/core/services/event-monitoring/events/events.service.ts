import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventsPaginationResponse, EventDetails, ExpectedOutcomesPaginationResponse } from 'src/app/core/models/event-monitoring/events/events';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(additionalParams?: string, is_all: boolean = false): Observable<EventsPaginationResponse> {
    let params = '';
    params = `?page=${EventsStore.currentPage}`;
    if (EventsStore.orderBy)
      params += `&order_by=${EventsStore.orderItem}&order=${EventsStore.orderBy}`;
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (EventsStore.searchText) params += (params ? '&q=' : '?q=') + EventsStore.searchText;
    if (RightSidebarLayoutStore.filterPageTag == 'event_monitoring' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<EventsPaginationResponse>('/events' + (params ? params : ''))
      .pipe(
        map((res: EventsPaginationResponse) => {
          EventsStore.setEventList(res);
          return res;
        })
      );
  }

  getItem(id): Observable<EventDetails> {
    return this._http.get<EventDetails>('/events/' + id).pipe(
      map((res: EventDetails) => {
        EventsStore.setEventDetails(res)
        return res;
      })
    );
  }

  getItemsAll(): Observable<EventDetails> {
    return this._http.get<EventDetails>('/events?is_all=true').pipe(
      map((res: EventDetails) => {
        EventsStore.setEventAllLists(res)
        return res;
      })
    );
  }


  getOutcome(id): Observable<ExpectedOutcomesPaginationResponse> {
    return this._http.get<ExpectedOutcomesPaginationResponse>(`/events/${id}/expected-outcomes`).pipe(
      map((res: ExpectedOutcomesPaginationResponse) => {
        EventsStore.setEventOutcome(res)
        return res;
      })
    );
  }

  saveOutcome(item) {
    return this._http.post(`/events/${EventsStore.selectedEventId}/expected-outcomes`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_outcome_added');
        if (this._helperService.checkMasterUrl()) this.getItems(null, true);
        else this.getOutcome(EventsStore.selectedEventId).subscribe();
        return res;
      })
    );
  }

  updateOutcome(id, item) {
    return this._http.put(`/events/${EventsStore.selectedEventId}/expected-outcomes/${id}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_outcome_updated');
        if (this._helperService.checkMasterUrl()) this.getItems(null, true);
        else this.getOutcome(EventsStore.selectedEventId).subscribe();
        return res;
      })
    );
  }

  deleteOutcome(id) {
    return this._http.delete(`/events/${EventsStore.selectedEventId}/expected-outcomes/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_outcomes_deleted');
        this.getOutcome(EventsStore.selectedEventId).subscribe(resp => {
          if (resp.from == null) {
            EventsStore.setOutcomesCurrentPage(resp.current_page - 1);
            this.getOutcome(EventsStore.selectedEventId);
          }
        });
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/events/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_updated');
        this.getItems(null, true).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/events', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_added');
        if (this._helperService.checkMasterUrl()) this.getItems(null, true);
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/events/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('events_template') + ".xlsx");
      }
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/events/import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('successfully', 'event_imported');
        return res;
      })
    )
  }

  exportToExcel() {
    let sortparams = '';
    if (EventsStore.orderBy) sortparams += `?order=${EventsStore.orderBy}`;
    if (EventsStore.orderItem) sortparams += `&order_by=${EventsStore.orderItem}`;
    // if (EventsStore.searchText) params += `&q=${EventsStore.searchText}`;
    if (RightSidebarLayoutStore.filterPageTag == 'strategy_profile' && RightSidebarLayoutStore.filtersAsQueryString)
      sortparams = (sortparams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (sortparams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/events/export' + sortparams, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('events') + ".xlsx");
      }
    )
  }

  exportToExcelFile() {
    this._http.get(`/events/${EventsStore.selectedEventId}/report-export`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('events') + ".docx");
      }
    )
  }


  activate(id: number) {
    return this._http.put('/events/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_activated');
        this.getItems(null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/events/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_deactivated');
        this.getItems(null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/events/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'events_deleted');
        this.getItems(null, true).subscribe(resp => {
          if (resp.from == null) {
            EventsStore.setCurrentPage(resp.current_page - 1);
            this.getItems(null, true).subscribe();
          }
        });
        return res;
      })
    );
  }


  sorteventsList(type: string) {
    if (!EventsStore.orderBy) {
      EventsStore.orderBy = 'asc';
      EventsStore.orderItem = type;
    }
    else {
      if (EventsStore.orderItem == type) {
        if (EventsStore.orderBy == 'asc') EventsStore.orderBy = 'desc';
        else EventsStore.orderBy = 'asc'
      }
      else {
        EventsStore.orderBy = 'asc';
        EventsStore.orderItem = type;
      }
    }
  }
  setSelectedEvents(events) {
    EventsStore.addSelectedEvents(events);
  }

}
