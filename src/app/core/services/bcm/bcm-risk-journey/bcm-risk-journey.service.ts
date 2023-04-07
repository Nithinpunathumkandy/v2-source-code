import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BcmRiskJourney } from 'src/app/core/models/bcm/bcm-risk-journey/bcm-risk-journey';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcmRiskJourneyStore } from 'src/app/stores/bcm/risk-assessment/bc-risk-journey.store';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BcmRiskJourneyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getItem(id: number): Observable<BcmRiskJourney>{
    return this._http.get<BcmRiskJourney>('/bcm-risks/' + id+'/journey').pipe(
      map((res: BcmRiskJourney) => {
        BcmRiskJourneyStore.setIndividualRiskJourney(res)
        return res;
      })
    );
  }

  exportJourney() {
    this._http.get('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/journey/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_journey')+".docx");
      }
    )
  }
}
