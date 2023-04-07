import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { EventStakeholderStore } from 'src/app/stores/event-monitoring/events/event-stakeholder-store';
import { StakeholderDetails , StakeholderPaginationResponse } from 'src/app/core/models/event-monitoring/events/event-stakeholder';

@Injectable({
  providedIn: 'root'
})
export class EventStakeholderService {
  
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(additionalParams?: string, is_all: boolean = false): Observable<StakeholderPaginationResponse> {
    let params = '';
    params = `?page=${EventStakeholderStore.currentPage}`;
    if (EventStakeholderStore.orderBy)
      params += `&order_by=${EventStakeholderStore.orderItem}&order=${EventStakeholderStore.orderBy}`;
    if (additionalParams) params += additionalParams;
    if (is_all) params += '&status=all'
    if (EventStakeholderStore.searchText) params += (params ? '&q=' : '?q=') + EventStakeholderStore.searchText;
    return this._http.get<StakeholderPaginationResponse>(`/events/${EventsStore.selectedEventId}/stakeholders` + (params ? params : '')).pipe(
      map((res) => {
        EventStakeholderStore.setStakeholderList(res);
        return res;
      })
    );
  }

  getStakeholderDetails(id) {
    return this._http.get<StakeholderDetails>(`/events/${EventsStore.selectedEventId}/stakeholders/${id}`).pipe((
      map((res: StakeholderDetails) => {
        EventStakeholderStore.setIndividualStakeholderDetails(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post(`/events/${EventsStore.selectedEventId}/stakeholders`, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'event_stakeholder_added');
        if (this._helperService.checkMasterUrl()) this.getItems(null,true).subscribe();
        else this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put(`/events/${EventsStore.selectedEventId}/stakeholders/${id}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_stakeholder_updated');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete(`/events/${EventsStore.selectedEventId}/stakeholders/${id}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'event_stakeholder_deleted');
        this.getItems(null,true).subscribe();
        return res;
      })
    );
  }

}
