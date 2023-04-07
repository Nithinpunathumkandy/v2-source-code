import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RisksStore } from 'src/app/stores/hira/hira/hira.store';
import {RiskAssessment} from 'src/app/core/models/hira/hira-register/hira-assessment';
import { RiskAssessmentStore } from 'src/app/stores/hira/hira/hira-assessment.store';

@Injectable({
  providedIn: 'root'
})
export class HiraAssessmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    getItem(): Observable<RiskAssessment> {
      return this._http.get<RiskAssessment>('/risks/'+RisksStore.riskId+'/analyses').pipe(
        map((res: RiskAssessment) => {
          RiskAssessmentStore.setAssessmentDetails(res);
          // ImpactStore.updateImpact(res)
          return res;
        })
      );
    }
  
    updateItem(saveData): Observable<any> {
      return this._http.post('/risks/' + RisksStore.riskId + '/analyses', saveData).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_assessment_updated');
  
          this.getItem().subscribe();
  
          return res;
        })
      );
    }
  
    
    getItemByProcess(id): Observable<RiskAssessment> {
      return this._http.get<RiskAssessment>('/risks/'+RisksStore.riskId+'/analyses/'+id).pipe(
        map((res: RiskAssessment) => {
          RiskAssessmentStore.setAssessmentByProcess(res);
          this.getItem().subscribe();
          // ImpactStore.updateImpact(res)
          return res;
        })
      );
    }
  
  
}
