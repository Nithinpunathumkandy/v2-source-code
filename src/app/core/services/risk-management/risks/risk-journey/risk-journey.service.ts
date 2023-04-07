import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KRIStore } from 'src/app/stores/risk-management/risks/kri.store';
import { RiskJourneyStore } from 'src/app/stores/risk-management/risks/risk-journey.store';
import { KRIPaginationResponse,KRI } from 'src/app/core/models/risk-management/risks/key-risk-indicators';
import { RiskJourney } from 'src/app/core/models/risk-management/risks/risk-journey';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';

@Injectable({
  providedIn: 'root'
})
export class RiskJourneyService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItem(id): Observable<RiskJourney> {
    return this._http.get<RiskJourney>('/risks/'+RisksStore.riskId+'/journey').pipe((
      map((res:RiskJourney)=>{
        RiskJourneyStore.setIndividualRiskJourney(res);
        return res;
      })
    ))
  }

}
