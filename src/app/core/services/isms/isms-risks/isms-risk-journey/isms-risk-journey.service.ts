import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

import { RiskJourney } from 'src/app/core/models/risk-management/risks/risk-journey';
import { IsmsRiskJourneyStore } from 'src/app/stores/isms/isms-risks/isms-risk-journey.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskJourneyService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItem(id): Observable<RiskJourney> {
    return this._http.get<RiskJourney>('/isms-risks/'+IsmsRisksStore.riskId+'/journey').pipe((
      map((res:RiskJourney)=>{
        IsmsRiskJourneyStore.setIndividualRiskJourney(res);
        return res;
      })
    ))
  }

}
