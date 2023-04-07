import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
// import { IsmsRisksStore } from 'src/app/stores/risk-management/isms-risks/isms-risks.store';
import {Chart, ResidualRisk,RiskProcess} from 'src/app/core/models/risk-management/risks/residual-risk';
import { IsmsResidualRiskStore } from 'src/app/stores/isms/isms-risks/isms-residual-risk.store';
import { IsmsRisksStore } from 'src/app/stores/isms/isms-risks/isms-risks.store';
// import { IsmsResidualRiskStore } from 'src/app/stores/risk-management/isms-risks/residual-risk.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsResidualRiskService {

 
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getItem(): Observable<ResidualRisk> {
    return this._http.get<ResidualRisk>('/isms-risks/'+IsmsRisksStore.riskId+'/residual-analyses').pipe(
      map((res: ResidualRisk) => {
        IsmsResidualRiskStore.setResidualDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(saveData): Observable<any> {
    return this._http.post('/isms-risks/' + IsmsRisksStore.riskId + '/residual-analyses', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'residual_risk_updated');

        this.getItem().subscribe();

        return res;
      })
    );
  }

  getItemByProcess(id): Observable<RiskProcess[]> {
    return this._http.get<RiskProcess[]>('/isms-risks/'+IsmsRisksStore.riskId+'/residual-analyses/'+id).pipe(
      map((res: RiskProcess[]) => {
        IsmsResidualRiskStore.setResidualByProcess(res);
        this.getItem().subscribe();
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getChartDetails(): Observable<Chart> {
    return this._http.get<Chart>('/isms-risks/'+IsmsRisksStore.riskId+'/residual-analyses/charts').pipe(
      map((res: Chart) => {
        IsmsResidualRiskStore.setChartDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
