import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskReviewFrequencyPaginationResponse } from 'src/app/core/models/masters/risk-management/risk-review-frequency';
import{RiskReviewFrequencyMasterStore} from 'src/app/stores/masters/risk-management/risk-review-frequency-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';



@Injectable({
  providedIn: 'root'
})
export class RiskReviewFrequencyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
   
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskReviewFrequencyPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskReviewFrequencyMasterStore.currentPage}`;
        if (RiskReviewFrequencyMasterStore.orderBy) params += `&order_by=${RiskReviewFrequencyMasterStore.orderItem}&order=${RiskReviewFrequencyMasterStore.orderBy}`;
      }
      if(RiskReviewFrequencyMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskReviewFrequencyMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskReviewFrequencyPaginationResponse>('/risk-review-frequencies' + (params ? params : '')).pipe(
        map((res: RiskReviewFrequencyPaginationResponse) => {
          RiskReviewFrequencyMasterStore.setRiskReviewFrequency(res);
          return res;
        })
      );
    }


    activate(id: number) {
      return this._http.put('/risk-review-frequencies/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_review_frequency_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-review-frequencies/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_review_frequency_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-review-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_review_frequencies')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-review-frequencies/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
    sortRiskReviewFrequencyList(type:string, text:string) {
      if (!RiskReviewFrequencyMasterStore.orderBy) {
        RiskReviewFrequencyMasterStore.orderBy = 'asc';
        RiskReviewFrequencyMasterStore.orderItem = type;
      }
      else{
        if (RiskReviewFrequencyMasterStore.orderItem == type) {
          if(RiskReviewFrequencyMasterStore.orderBy == 'asc') RiskReviewFrequencyMasterStore.orderBy = 'desc';
          else RiskReviewFrequencyMasterStore.orderBy = 'asc'
        }
        else{
          RiskReviewFrequencyMasterStore.orderBy = 'asc';
          RiskReviewFrequencyMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
