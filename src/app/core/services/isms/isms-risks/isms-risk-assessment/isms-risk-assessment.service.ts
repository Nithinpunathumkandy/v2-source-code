import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
import {RiskAssessment} from 'src/app/core/models/risk-management/risks/risk-assessment';
import { IsmsRiskAssessmentStore } from 'src/app/stores/isms/isms-risks/isms-risk-assessment.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskAssessmentService {
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


  getItem(): Observable<RiskAssessment> {
    return this._http.get<RiskAssessment>('/isms-risks/'+IsmsRisksStore.riskId+'/analyses').pipe(
      map((res: RiskAssessment) => {
        IsmsRiskAssessmentStore.setAssessmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(saveData): Observable<any> {
    return this._http.post('/isms-risks/' + IsmsRisksStore.riskId + '/analyses', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_assessment_updated');

        this.getItem().subscribe();

        return res;
      })
    );
  }

  
  getItemByProcess(id): Observable<RiskAssessment> {
    return this._http.get<RiskAssessment>('/isms-risks/'+IsmsRisksStore.riskId+'/analyses/'+id).pipe(
      map((res: RiskAssessment) => {
        IsmsRiskAssessmentStore.setAssessmentByProcess(res);
        this.getItem().subscribe();
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
