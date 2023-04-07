import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EACountByDepartmentAndRiskRating, EACountByMsType, EACountByRiskRating, EACounts, EACountsByCategory, EACountsByStatus, EACountsByType, FindingCACountByStatus, FindingCAList } from 'src/app/core/models/external-audit/ea-dashboard/ea-dashboard';
import { EADashboardStore } from 'src/app/stores/external-audit/ea-dashboard/ea-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class EaDashboardService {
  RightSidebarLayoutStore=RightSidebarLayoutStore
  constructor(
    private _http: HttpClient,

  ) { }

  getEACount(): Observable<EACounts> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACounts>('/dashboard/ea-counts' +(params ? params : '')).pipe((
      map((res:EACounts)=>{
        EADashboardStore.setEACounts(res);
        return res;
      })
    ))
  }

  getEACountByCategory(): Observable<EACountsByCategory[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACountsByCategory[]>('/dashboard/ea-findings-count-by-categories' +(params ? params : '')).pipe((
      map((res:EACountsByCategory[])=>{
        EADashboardStore.setEACountsByCategory(res);
        return res;
      })
    ))
  }

  getEACountByStatus(): Observable<EACountsByStatus[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACountsByStatus[]>('/dashboard/ea-findings-count-by-status' +(params ? params : '')).pipe((
      map((res:EACountsByStatus[])=>{
        EADashboardStore.setEACountsByStatus(res);
        return res;
      })
    ))
  }

  getEACountByType(): Observable<EACountsByType[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACountsByType[]>('/dashboard/ea-count-by-types' +(params ? params : '')).pipe((
      map((res:EACountsByType[])=>{
        EADashboardStore.setEACountsByType(res);
        return res;
      })
    ))
  }

  getFindingCACountByStatus(): Observable<FindingCACountByStatus[]> {
    let params: string = '';
     if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
       params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingCACountByStatus[]>('/dashboard/ea-findings-corrective-action-count-by-statuses' +(params ? params : '')).pipe((
      map((res:FindingCACountByStatus[])=>{
        EADashboardStore.setFindingCACountByStatus(res);
        return res;
      })
    ))
  }

  getEACountByMsType(): Observable<EACountByMsType[]> {
    let params: string = '';
     if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
       params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACountByMsType[]>('/dashboard/ea-count-by-ms-types' +(params ? params : '')).pipe((
      map((res:EACountByMsType[])=>{
        EADashboardStore.setEACountByMsType(res);
        return res;
      })
    ))
  }

  getEACountByRiskRating(): Observable<EACountByRiskRating[]> {
    let params: string = '';
     if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
       params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACountByRiskRating[]>('/dashboard/ea-findings-count-by-risk-ratings' +(params ? params : '')).pipe((
      map((res:EACountByRiskRating[])=>{
        EADashboardStore.setEACountByRiskRating(res);
        return res;
      })
    ))
  }

  getEACountByDepartmentAndRiskRating(): Observable<EACountByDepartmentAndRiskRating[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EACountByDepartmentAndRiskRating[]>('/dashboard/ea-findings-count-by-department-and-risk-rating-categories' +(params ? params : '')).pipe((
      map((res:EACountByDepartmentAndRiskRating[])=>{
        EADashboardStore.setEACountByDepartmentAndRiskRating(res);
        return res;
      })
    ))
  }

  getFindingCAList(): Observable<FindingCAList[]> {
    let params: string = '';
     if (RightSidebarLayoutStore.filterPageTag == 'ea_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
       params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingCAList[]>('/dashboard/ea-findings-pending-corrective-actions' +(params ? params : '')).pipe((
      map((res:FindingCAList[])=>{
        EADashboardStore.setFindingCAList(res);
        return res;
      })
    ))
  }
}
