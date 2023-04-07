import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {RiskRatingPaginationResponse,RiskRatingByLanguage } from 'src/app/core/models/masters/risk-management/risk-rating';
import{RiskRatingMasterStore} from 'src/app/stores/masters/risk-management/risk-rating-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskRatingService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskRatingPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskRatingMasterStore.currentPage}`;
        if (RiskRatingMasterStore.orderBy) params += `&order_by=${RiskRatingMasterStore.orderItem}&order=${RiskRatingMasterStore.orderBy}`;
      }
      if(RiskRatingMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskRatingMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskRatingPaginationResponse>('/risk-ratings' + (params ? params : '')).pipe(
        map((res: RiskRatingPaginationResponse) => {
          if(res['data'].length>0){
            for(let i of res['data']){
              if(i['risk_rating_values']){
                i['risk_rating_values']=i['risk_rating_values'].split(',');
              }
            }           
          }
          RiskRatingMasterStore.setRiskRating(res);
          return res;
        })
      );
    }

    getRatingsByLanguage(getAll: boolean = false,additionalParams?:string,status:boolean = false){
      let params = '';
     
        if (RiskRatingMasterStore.orderBy) params += `&order_by=risk_rating_language.id&order=desc`;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskRatingByLanguage[]>('/risk-ratings?all_languages=true' + (params ? params : '')).pipe(
        map((res: RiskRatingByLanguage[]) => {
          RiskRatingMasterStore.setAllRiskRating(res);
          return res;
        })
      );
    }


    activate(id: number) {
      return this._http.put('/risk-ratings/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_rating_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-ratings/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_rating_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-ratings/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_rating')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-ratings/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskRatingList(type:string, text:string) {
      if (!RiskRatingMasterStore.orderBy) {
        RiskRatingMasterStore.orderBy = 'asc';
        RiskRatingMasterStore.orderItem = type;
      }
      else{
        if (RiskRatingMasterStore.orderItem == type) {
          if(RiskRatingMasterStore.orderBy == 'asc') RiskRatingMasterStore.orderBy = 'desc';
          else RiskRatingMasterStore.orderBy = 'asc'
        }
        else{
          RiskRatingMasterStore.orderBy = 'asc';
          RiskRatingMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
