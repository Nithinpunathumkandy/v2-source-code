import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import {Chart, ResidualRisk,RiskProcess} from 'src/app/core/models/hira/hira-register/residual-hira';
import { ResidualRiskStore } from 'src/app/stores/hira/hira/residual-hira.store';

@Injectable({
  providedIn: 'root'
})
export class ResidualHiraService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    getItem(): Observable<ResidualRisk> {
      return this._http.get<ResidualRisk>('/risks/'+RisksStore.riskId+'/residual-analyses').pipe(
        map((res: ResidualRisk) => {
          ResidualRiskStore.setResidualDetails(res);
          // ImpactStore.updateImpact(res)
          return res;
        })
      );
    }
  
    updateItem(saveData): Observable<any> {
      return this._http.post('/risks/' + RisksStore.riskId + '/residual-analyses', saveData).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'residual_risk_updated');
  
          this.getItem().subscribe();
  
          return res;
        })
      );
    }
  
    getItemByProcess(id): Observable<RiskProcess[]> {
      return this._http.get<RiskProcess[]>('/risks/'+RisksStore.riskId+'/residual-analyses/'+id).pipe(
        map((res: RiskProcess[]) => {
          ResidualRiskStore.setResidualByProcess(res);
          this.getItem().subscribe();
          // ImpactStore.updateImpact(res)
          return res;
        })
      );
    }
  
    getChartDetails(): Observable<Chart> {
      return this._http.get<Chart>('/risks/'+RisksStore.riskId+'/residual-analyses/charts').pipe(
        map((res: Chart) => {
          ResidualRiskStore.setChartDetails(res);
          // ImpactStore.updateImpact(res)
          return res;
        })
      );
    }

}
