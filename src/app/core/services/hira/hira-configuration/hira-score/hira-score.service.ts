import { Injectable } from '@angular/core';
import { Risk, RiskPaginationResponse } from 'src/app/core/models/risk-management/risks/risks';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RiskScoreStore } from 'src/app/stores/risk-management/risk-configuration/risk-score.store';

@Injectable({
  providedIn: 'root'
})
export class HiraScoreService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }
  
    getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskScoreStore.currentPage}`;
        if (RiskScoreStore.orderBy) params += `&order_by=risks.title&order=${RiskScoreStore.orderBy}`;
      }
  
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(RiskScoreStore.searchText) params += (params ? '&q=' : '?q=')+RiskScoreStore.searchText;
      return this._http.get<RiskPaginationResponse>('/risk-matrix-configurations' ).pipe(
        map((res: RiskPaginationResponse) => {
          RiskScoreStore.setRiskScoreDetails(res);
          return res;
        })
      );
    }
  
    updateItem(risk_id:number, risk: Risk): Observable<any> {
      return this._http.put('/risk-matrix-configurations/'+ risk_id, risk).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'risk_score_has_been_updated');
          
          this.getItems().subscribe();
  
          return res;
        })
      );
    }
  
    saveItem(risk): Observable<any> {
      return this._http.post('/risk-matrix-configurations', risk).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'risk_score_has_been_added');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    delete(id: number) {
      return this._http.delete('/risk-matrix-configurations/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'risk_score_has_been_deleted');
          this.getItems().subscribe();
          return res;
        })
      );
    }

}
