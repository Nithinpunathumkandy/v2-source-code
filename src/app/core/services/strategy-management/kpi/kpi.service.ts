import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { KpiResponse, KpiReviewResponse } from 'src/app/core/models/strategy-management/kpi.model';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<KpiResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${KpiStore.currentPage}`;
        if (KpiStore.orderBy) params += `&order_by=${KpiStore.orderItem}&order=${KpiStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(KpiStore.searchText) params += (params ? '&q=' : '?q=')+KpiStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<KpiResponse>('/strategy-profile-kpis' + (params ? params : '')).pipe(
        map((res: KpiResponse) => {
          KpiStore.setKpis(res);
          return res;
        })
      );
   
    }

    induvalKpi(id){
      return this._http.get('/strategy-profile-kpis/'+id).pipe(
        map((res) => {
         KpiStore.setInduvalKpi(res);
          return res;
        })
      );
    }

    getKpiReviews(id){
      return this._http.get('/KPIs/'+id+'/Reviews').pipe(
        map((res:KpiReviewResponse) => {
         KpiStore.setKpiReviews(res);
          return res
        })
      );
    }

    getIndivalReview(id,reviewId){
      return this._http.get('/KPIs/'+id+'/Reviews/'+reviewId).pipe(
        map((res) => {
         KpiStore.setInduvalReview(res);
          return res
        })
      );
    }

    addKpiMesure(id,reviewId,item){
      return this._http.put('/KPIs/'+id+'/Reviews/'+reviewId,item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'KPI review updated successfully');
          // this.getItems().subscribe();
          return res;
        })
      );
    }

    getItemsforScoringFilter(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<KpiResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${KpiStore.currentPage}`;
        if (KpiStore.orderBy) params += `&order_by=${KpiStore.orderItem}&order=${KpiStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(KpiStore.searchText) params += (params ? '&q=' : '?q=')+KpiStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<KpiResponse>('/strategy-profile-kpis' + (params ? params : '')).pipe(
        map((res: KpiResponse) => {
          KpiStore.setKpis(res);
          return res;
        })
      );
   
    }
}
