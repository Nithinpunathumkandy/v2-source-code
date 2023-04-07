import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskJourneyStore } from 'src/app/stores/hira/hira/hira-journey.store';
import { RiskJourney } from 'src/app/core/models/hira/hira-register/hira-journey';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';

@Injectable({
  providedIn: 'root'
})
export class HiraJourneyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
  getItem(id): Observable<RiskJourney> {
    return this._http.get<RiskJourney>('/risks/'+RisksStore.riskId+'/journey').pipe((
      map((res:RiskJourney)=>{
        RiskJourneyStore.setIndividualRiskJourney(res);
        return res;
      })
    ))
  }

}
