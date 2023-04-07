import { Injectable } from '@angular/core';
import { RisksStore } from 'src/app/stores/risk-management/risks/risks.store';
import { Risk, RiskPaginationResponse, IndividualRisk } from 'src/app/core/models/risk-management/risks/risks';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskScoreStore } from 'src/app/stores/isms/isms-risk-configuration/isms-risk-score.store';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskScoreService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<any> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsRiskScoreStore.currentPage}`;
      if (IsmsRiskScoreStore.orderBy) params += `&order_by=risks.title&order=${IsmsRiskScoreStore.orderBy}`;
    }

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(IsmsRiskScoreStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRiskScoreStore.searchText;
    return this._http.get<any>('/isms-risk-matrix-configurations' ).pipe(
      map((res: any) => {
        IsmsRiskScoreStore.setRiskScoreDetails(res);
        return res;
      })
    );
  }

  // getItem(id: number): Observable<IndividualRisk> {
  //   return this._http.get<IndividualRisk>('/isms-risk-matrix-configurations/' + id).pipe(
  //     map((res: IndividualRisk) => {
  //       IsmsRiskScoreStore.setIndividualRiskDetails(res);
  //       // RisksStore.updateRisk(res)
  //       return res;
  //     })
  //   );
  // }

  updateItem(risk_id:number, risk: Risk): Observable<any> {
    return this._http.put('/isms-risk-matrix-configurations/'+ risk_id, risk).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'risk_score_has_been_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  saveItem(risk): Observable<any> {
    return this._http.post('/isms-risk-matrix-configurations', risk).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'Risk Score saved successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/isms-risk-matrix-configurations/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'risk_score_has_been_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }
}
