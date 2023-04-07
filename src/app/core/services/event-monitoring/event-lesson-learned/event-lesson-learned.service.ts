import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { EventLessonLearnedPaginationResponse, EventLessonLearnedDetails } from 'src/app/core/models/event-monitoring/events/event-lesson-learned';
import { EventLessonLearnedStore } from 'src/app/stores/event-monitoring/events/event-lesson-learned-store';



@Injectable({
  providedIn: 'root'
})
export class EventLessonLearnedService {
  
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false,additionalParams?: string, is_all: boolean = false): Observable<EventLessonLearnedPaginationResponse> {
    let params = '';
    if (!getAll) {
    params = `?page=${EventLessonLearnedStore.currentPage}`;
    if (EventLessonLearnedStore.orderBy)
      params += `&order_by=${EventLessonLearnedStore.orderItem}&order=${EventLessonLearnedStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (EventLessonLearnedStore.searchText) params += (params ? '&q=' : '?q=') + EventLessonLearnedStore.searchText;
    return this._http.get<EventLessonLearnedPaginationResponse>(`/events/${EventsStore.selectedEventId}/lesson-learned` + (params ? params : '')).pipe(
      map((res) => {
        EventLessonLearnedStore.setEventLessonLearnedList(res);
        return res;
      })
    );
  }

  getTaskDetails(id) {
    return this._http.get<EventLessonLearnedDetails>(`/events/${EventsStore.selectedEventId}/lesson-learned/${id}`).pipe((
      map((res: EventLessonLearnedDetails) => {
        EventLessonLearnedStore.setIndividualEventLessonLearnedDetails(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post(`/events/${EventsStore.selectedEventId}/lesson-learned`, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'event_lesson_learned_added');
        if (this._helperService.checkMasterUrl()) this.getItems().subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/lesson-learned/${id}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_lesson_learned_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete(`/events/${EventsStore.selectedEventId}/lesson-learned/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_lesson_learned_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

}
