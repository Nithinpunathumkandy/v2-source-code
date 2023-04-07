import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FindingCount, FindingLineDepartment, FindingLineYear, FindingPieChartActionPlan, FindingPieChartCategory, RiskRating } from 'src/app/core/models/non-conformity/non-conformity-dashboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { NonConformityDashboardStore } from 'src/app/stores/non-conformity/dashboard/non-conformity-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class NonConformityDashboardService {

  constructor(
    private _http: HttpClient,

  ) { }


  getFindingCount(): Observable<FindingCount> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'non_conformity_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingCount>('/dashboard/noc-finding-counts'+ (params ? params : '')).pipe(
      map((res: FindingCount) => {
        NonConformityDashboardStore.setFindingCount(res)
        return res;
      })
    );
  }

  getRiskRating(): Observable<RiskRating[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'non_conformity_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskRating[]>('/dashboard/noc-finding-count-by-risk-ratings'+ (params ? params : '')).pipe((
      map((res:any[])=>{
        NonConformityDashboardStore.setRiskRating(res);
        return res;
      })
    ))
  }

  getFindingPieChartCategory(): Observable<FindingPieChartCategory[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'non_conformity_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingPieChartCategory[]>('/dashboard/noc-finding-count-by-finding-categories'+ (params ? params : '')).pipe((
      map((res:FindingPieChartCategory[])=>{
        NonConformityDashboardStore.setFindingPieChartCategory(res);
        return res;
      })
    ))
  }

  getFindingPieChartActionPlan(): Observable<FindingPieChartActionPlan[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'non_conformity_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingPieChartActionPlan[]>('/dashboard/noc-finding-count-by-action-plans'+ (params ? params : '')).pipe((
      map((res:FindingPieChartActionPlan[])=>{
        NonConformityDashboardStore.setFindingPieChartActionPlan(res);
        return res;
      })
    ))
  }

  getFindingLineDepartment(): Observable<FindingLineDepartment[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'non_conformity_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingLineDepartment[]>('/dashboard/noc-finding-count-by-departments'+ (params ? params : '')).pipe((
      map((res:FindingLineDepartment[])=>{
        NonConformityDashboardStore.setFindingLineDepartment(res);
        return res;
      })
    ))
  }

  getFindingLineYear(): Observable<FindingLineYear[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'non_conformity_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingLineYear[]>('/dashboard/noc-finding-count-by-years'+ (params ? params : '')).pipe((
      map((res:FindingLineYear[])=>{
        NonConformityDashboardStore.setFindingLineYear(res);
        return res;
      })
    ))
  }
}
