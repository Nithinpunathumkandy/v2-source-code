import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventMappingResponse } from 'src/app/core/models/event-monitoring/events/event-mapping';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventMappingStore } from 'src/app/stores/event-monitoring/events/event-mapping-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';


@Injectable({
  providedIn: 'root'
})
export class EventMappingService {
  EventMappingStore=EventMappingStore;
  EventsStore=EventsStore;
  constructor(
    private _http: HttpClient,
    private _utilityService:UtilityService
  ) { }

  getRiskMappingData(id) {
    return this._http.get<EventMappingResponse>('/event-risks?event_ids='+id).pipe((
      map((res: EventMappingResponse) => {
        EventMappingStore.setMappingDetails(res);
        return res;
      })
    ))
  }
  saveRiskMapping(saveData): Observable<any> {
    return this._http.post('/event-risks', saveData).pipe(
      map(res => {
        //this._utilityService.showSuccessMessage('Success!', 'risk_mapped_to_event');
        return res;
      })
    );

  }
  delete(id) {
    return this._http.delete('/events/' + EventsStore.selectedEventId + '/risks/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'mapped_risk_remove_from_event_success_message');
        //this.getComplianceMaping(ComplianceRegisterStore.complianceRegisterId).subscribe();
        return res;
      })
    );
  }
}
