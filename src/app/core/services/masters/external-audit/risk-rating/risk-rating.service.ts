import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskRatingPaginationResponse } from 'src/app/core/models/masters/external-audit/risk-rating';
import { RiskRatingMasterStore } from 'src/app/stores/masters/external-audit/risk-rating-store';

@Injectable({
  providedIn: 'root'
})
export class RiskRatingService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getAllItems(getAll:boolean = false, additionalParams?:string): Observable<RiskRatingPaginationResponse> {
      let params = '';
      if(!getAll){
        params = `?page=${RiskRatingMasterStore.currentPage}&status=all`;
        if(RiskRatingMasterStore.orderBy) params+= `&order_by=${RiskRatingMasterStore.orderItem}&order=${RiskRatingMasterStore.orderBy}`;
      }

      if(additionalParams) params+=additionalParams;
      if(RiskRatingMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskRatingMasterStore.searchText;

      return this._http.get<RiskRatingPaginationResponse>('/external-audit/risk-ratings' + (params ? params : '')).pipe((
        map((res:RiskRatingPaginationResponse)=>{
          RiskRatingMasterStore.setRiskRating(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/external-audit/risk-ratings/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getAllItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/external-audit/risk-ratings/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getAllItems().subscribe();
          return res;
        })
      );
    }

    sortRiskRatingList(type:string, text:string) {
      if (!RiskRatingMasterStore.orderBy) {
        RiskRatingMasterStore.orderBy = 'asc';
        RiskRatingMasterStore.orderItem = type;
      }
      else {
        if (RiskRatingMasterStore.orderItem == type) {
          if (RiskRatingMasterStore.orderBy == 'asc') RiskRatingMasterStore.orderBy = 'desc';
          else RiskRatingMasterStore.orderBy = 'asc'
        }
        else {
          RiskRatingMasterStore.orderBy = 'asc';
          RiskRatingMasterStore.orderItem = type;
        }
      }
    //   if (!text)
    //     this.getAllItems().subscribe();
    //   else
    //     this.getAllItems(false, `&q=${text}`).subscribe();
     }
  
  }

