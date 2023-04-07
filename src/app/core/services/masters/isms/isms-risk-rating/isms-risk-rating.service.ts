import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IsmsRiskRatingPaginationResponse } from 'src/app/core/models/masters/Isms/isms-risk-rating';
import { RiskRatingByLanguage } from 'src/app/core/models/masters/risk-management/risk-rating';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IsmsRiskRatingMasterStore } from 'src/app/stores/masters/Isms/isms-risk-rating-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IsmsRiskRatingService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<IsmsRiskRatingPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IsmsRiskRatingMasterStore.currentPage}`;
      if (IsmsRiskRatingMasterStore.orderBy) params += `&order_by=${IsmsRiskRatingMasterStore.orderItem}&order=${IsmsRiskRatingMasterStore.orderBy}`;
    }
    if(IsmsRiskRatingMasterStore.searchText) params += (params ? '&q=' : '?q=')+IsmsRiskRatingMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<IsmsRiskRatingPaginationResponse>('/isms-risk-ratings' + (params ? params : '')).pipe(
      map((res: IsmsRiskRatingPaginationResponse) => {
        IsmsRiskRatingMasterStore.setIsmsRiskRating(res);
        return res;
      })
    );
  }

  getRatingsByLanguage(getAll: boolean = false,additionalParams?:string,status:boolean = false){
    let params = '';
   
      if (IsmsRiskRatingMasterStore.orderBy) params += `&order_by=risk_rating_language.id&order=desc`;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<RiskRatingByLanguage[]>('/isms-risk-ratings?all_languages=true' + (params ? params : '')).pipe(
      map((res: RiskRatingByLanguage[]) => {
        IsmsRiskRatingMasterStore.setAllIsmsRiskRating(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/isms-risk-ratings/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('isms_risk_rating')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/isms-risk-ratings/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/isms-risk-ratings/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'isms_risk_rating_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/isms-risk-ratings/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'isms_risk_rating_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortIsmsRiskRatingList(type:string, text:string) {
    if (!IsmsRiskRatingMasterStore.orderBy) {
      IsmsRiskRatingMasterStore.orderBy = 'asc';
      IsmsRiskRatingMasterStore.orderItem = type;
    }
    else{
      if (IsmsRiskRatingMasterStore.orderItem == type) {
        if(IsmsRiskRatingMasterStore.orderBy == 'asc') IsmsRiskRatingMasterStore.orderBy = 'desc';
        else IsmsRiskRatingMasterStore.orderBy = 'asc'
      }
      else{
        IsmsRiskRatingMasterStore.orderBy = 'asc';
        IsmsRiskRatingMasterStore.orderItem = type;
      }
    }
  }
}
