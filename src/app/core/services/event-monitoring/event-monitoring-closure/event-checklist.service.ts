import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { EventChecklistStore } from 'src/app/stores/event-monitoring/events/event-checklist-store';
import { EventChecklistPaginationResponse, IndividualEventChecklist } from "src/app/core/models/event-monitoring/events/event-checklist";

@Injectable({
  providedIn: 'root'
})
export class EventChecklistService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(additionalParams?: string, is_all: boolean = false): Observable<EventChecklistPaginationResponse> {
    let params = '';
    params = `?page=${EventChecklistStore.currentPage}`;
    if (EventChecklistStore.orderBy)
      params += `&order_by=${EventChecklistStore.orderItem}&order=${EventChecklistStore.orderBy}`;
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (EventChecklistStore.searchText) params += (params ? '&q=' : '?q=') + EventChecklistStore.searchText;
    return this._http.get<EventChecklistPaginationResponse>(`/events/${EventsStore.selectedEventId}/event-checklist-details` + (params ? params : '')).pipe(
      map((res) => {
        EventChecklistStore.setEventChecklist(res);
        return res;
      })
    );
  }

  getDetails(id) {
    return this._http.get<IndividualEventChecklist>(`/events/${EventsStore.selectedEventId}/event-checklist-details/${id}`).pipe((
      map((res: IndividualEventChecklist) => {
        EventChecklistStore.setIndividualEventChecklist(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post(`/events/${EventsStore.selectedEventId}/event-checklist-details`, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'event_checklist_added');
        if (this._helperService.checkMasterUrl()) this.getItems(null, true).subscribe();
        else this.getItems(null, true).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/event-checklist-details/${id}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_checklist_updated');
        this.getItems(null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete(`/events/${EventsStore.selectedEventId}/event-checklist-details/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_checklist_deleted');
        this.getItems(null, true).subscribe();
        return res;
      })
    );
  }

  //Get Thumbnail Preview according to type and token
  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch (type) {
      case 'event-closure-document': return environment.apiBasePath + '/event-monitoring/files/event-closure/thumbnail?token=' + token;
        break;
    }
  }

}
