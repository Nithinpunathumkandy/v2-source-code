import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventResidualRiskStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-residual-risk.store';
import { EventRiskAssessmentStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-assesment.store';
import { Chart,RiskProcess } from 'src/app/core/models/risk-management/risks/residual-risk';
import { EventRiskResidualAnalysis } from 'src/app/core/models/event-monitoring/risk-assessment/risk-residual';

@Injectable({
  providedIn: 'root'
})
export class EventRiskResidualService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getItem(): Observable<EventRiskResidualAnalysis> {
    return this._http.get<EventRiskResidualAnalysis>('/event-risks/'+EventRiskAssessmentStore.selectedId+'/residual-analyses').pipe(
      map((res: EventRiskResidualAnalysis) => {
        EventResidualRiskStore.setResidualDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  updateItem(saveData): Observable<any> {
    return this._http.post('/event-risks/' + EventRiskAssessmentStore.selectedId + '/residual-analyses', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'residual_risk_updated');

        this.getItem().subscribe();

        return res;
      })
    );
  }

  getItemByProcess(id): Observable<RiskProcess[]> {
    return this._http.get<RiskProcess[]>('/event-risks/'+EventRiskAssessmentStore.selectedId+'/residual-analyses/'+id).pipe(
      map((res: RiskProcess[]) => {
        EventResidualRiskStore.setResidualByProcess(res);
        this.getItem().subscribe();
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getChartDetails(): Observable<Chart> {
    return this._http.get<Chart>('/event-risks/'+EventRiskAssessmentStore.selectedId+'/residual-analyses/charts').pipe(
      map((res: Chart) => {
        EventResidualRiskStore.setChartDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
