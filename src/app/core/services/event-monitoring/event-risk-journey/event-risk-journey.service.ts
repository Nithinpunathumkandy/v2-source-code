import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventRiskJourney } from 'src/app/core/models/event-monitoring/risk-assessment/event-risk-journey';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventRiskAssessmentStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-assesment.store';
import { EventRiskJourneyStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-journey.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventRiskJourneyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) { }

  getItem(id: number): Observable<EventRiskJourney>{
    return this._http.get<EventRiskJourney>('/event-risks/' + id+'/journey').pipe(
      map((res: EventRiskJourney) => {
        EventRiskJourneyStore.setIndividualRiskJourney(res)
        return res;
      })
    );
  }

  exportJourney() {
    this._http.get('/event-risks/'+EventRiskAssessmentStore.selectedId+'/journey/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_journey')+".docx");
      }
    )
  }
}