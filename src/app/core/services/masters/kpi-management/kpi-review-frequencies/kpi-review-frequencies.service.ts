import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReviewFrequencies, ReviewFrequenciesPaginationResponse } from 'src/app/core/models/masters/kpi-management/kpi-review-frequencies';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiReviewFrequenciesStore } from 'src/app/stores/masters/kpi-management/kpi-review-frequencies-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiReviewFrequenciesService {

  
  constructor( 
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService,
    ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all: boolean = false): Observable<ReviewFrequenciesPaginationResponse> {
        let params = '';
        if (!getAll) {
          params = `?page=${KpiReviewFrequenciesStore.currentPage}`;
          if (KpiReviewFrequenciesStore.orderBy) params += `&order_by=${KpiReviewFrequenciesStore.orderItem}&order=${KpiReviewFrequenciesStore.orderBy}`;

        }
      
        if(additionalParams) params += additionalParams;
        if(KpiReviewFrequenciesStore.searchText) params += (params ? '&q=' : '?q=')+KpiReviewFrequenciesStore.searchText;
        if(is_all) params += '&status=all';
        return this._http.get<ReviewFrequenciesPaginationResponse>('/kpi-review-frequencies' + (params ? params : '')).pipe(
          map((res: ReviewFrequenciesPaginationResponse) => {
            KpiReviewFrequenciesStore.setReviewFrequencies(res);
            return res;
          })
        );
    
    }

    getAllItems(): Observable<ReviewFrequencies[]>{
      return this._http.get<ReviewFrequencies[]>('/kpi-review-frequencies?is_all=true').pipe(
        map((res: ReviewFrequencies[]) => {
          
          KpiReviewFrequenciesStore.setAllReviewFrequencies(res);
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/kpi-review-frequencies/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_review_frequency_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/kpi-review-frequencies/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_review_frequency_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/kpi-review-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_review_frequency')+".xlsx");
        }
      )
    }

    sortList(type:string, text:string) {
      if (!KpiReviewFrequenciesStore.orderBy) {
        KpiReviewFrequenciesStore.orderBy = 'asc';
        KpiReviewFrequenciesStore.orderItem = type;
      }
      else{
        if (KpiReviewFrequenciesStore.orderItem == type) {
          if(KpiReviewFrequenciesStore.orderBy == 'asc') KpiReviewFrequenciesStore.orderBy = 'desc';
          else KpiReviewFrequenciesStore.orderBy = 'asc'
        }
        else{
          KpiReviewFrequenciesStore.orderBy = 'asc';
          KpiReviewFrequenciesStore.orderItem = type;
        }
      }
    }

    getSearchItems(additionalParams:string){
      let params='';
  
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      return this._http.get<ReviewFrequenciesPaginationResponse>('/kpi-review-frequencies' + (params ? params : '')).pipe(
        map((res: ReviewFrequenciesPaginationResponse) => {
          KpiReviewFrequenciesStore.setReviewFrequencies(res);
  
          return res;
        })
      );
    }
    
}
