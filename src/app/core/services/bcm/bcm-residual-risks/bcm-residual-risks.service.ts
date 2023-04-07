import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import {Chart, ResidualRisk,RiskProcess} from 'src/app/core/models/risk-management/risks/residual-risk';
import { BcmRiskAssessmentStore } from 'src/app/stores/bcm/risk-assessment/bcm-risk-assessment';
import { BcmResidualRiskStore } from 'src/app/stores/bcm/risk-assessment/bcm-residual-risk.store';
import { BcmRiskResidualAnalysis } from 'src/app/core/models/bcm/risk-assessment/risk-assessment';

@Injectable({
  providedIn: 'root'
})
export class BcmResidualRisksService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getItem(): Observable<BcmRiskResidualAnalysis> {
    return this._http.get<BcmRiskResidualAnalysis>('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/residual-analyses').pipe(
      map((res: BcmRiskResidualAnalysis) => {
        BcmResidualRiskStore.setResidualDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(saveData): Observable<any> {
    return this._http.post('/bcm-risks/' + BcmRiskAssessmentStore.selectedId + '/residual-analyses', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'residual_risk_updated');

        this.getItem().subscribe();

        return res;
      })
    );
  }

  getItemByProcess(id): Observable<RiskProcess[]> {
    return this._http.get<RiskProcess[]>('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/residual-analyses/'+id).pipe(
      map((res: RiskProcess[]) => {
        BcmResidualRiskStore.setResidualByProcess(res);
        this.getItem().subscribe();
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getChartDetails(): Observable<Chart> {
    return this._http.get<Chart>('/bcm-risks/'+BcmRiskAssessmentStore.selectedId+'/residual-analyses/charts').pipe(
      map((res: Chart) => {
        BcmResidualRiskStore.setChartDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
