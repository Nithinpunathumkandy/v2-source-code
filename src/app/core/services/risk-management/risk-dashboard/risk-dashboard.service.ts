import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskCount, RiskCountByCategories, RiskCountByDepartment, RiskCountByOwners, RiskCountBySection, RiskCountBySource, RiskCountByStatus, RiskHeatMap, RiskList, SecondRiskList } from 'src/app/core/models/risk-management/risk-dashboard/risk-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class RiskDashboardService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getRisk(): Observable<RiskList[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    params = (params == '') ? params + '?page=1' : params + '&page=1';
    return this._http.get<RiskList[]>('/dashboard/risk' +(params?params:'')).pipe((
      map((res:RiskList[])=>{
        RiskDashboardStore.setRiskDetails(res["data"]);
        return res;
      })
    ))
  }

  getSecondTopRisk(): Observable<SecondRiskList[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    params = (params == '') ? params + '?page=2' : params + '&page=2';
    return this._http.get<SecondRiskList[]>('/dashboard/risk' +(params?params:'')).pipe((
      map((res:SecondRiskList[])=>{
        RiskDashboardStore.setSecondRiskDetails(res["data"]);
        return res;
      })
    ))
  }

  getRiskCount(): Observable<RiskCount> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCount>('/dashboard/risk-count' +(params?params:'')).pipe((
      map((res:RiskCount)=>{
        RiskDashboardStore.setRiskCountDetails(res);
        return res;
      })
    ))
  }

  getRiskCountBySources(): Observable<RiskCountBySource[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCountBySource[]>('/dashboard/risk-count-by-sources' +(params?params:'')).pipe((
      map((res:RiskCountBySource[])=>{
        RiskDashboardStore.setRiskCountBySources(res);
        return res;
      })
    ))
  }

  getRiskCountBySections(): Observable<RiskCountBySection[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCountBySection[]>('/dashboard/risk-count-by-sections' +(params?params:'')).pipe((
      map((res:RiskCountBySection[])=>{
        RiskDashboardStore.setRiskCountBySections(res);
        return res;
      })
    ))
  }

  getRiskCountByDepartments(): Observable<RiskCountByDepartment[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCountByDepartment[]>('/dashboard/risk-count-by-departments' +(params?params:'')).pipe((
      map((res:RiskCountByDepartment[])=>{
        RiskDashboardStore.setRiskCountByDepartments(res);
        return res;
      })
    ))
  }

  getRiskCountByStatuses(): Observable<RiskCountByStatus[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCountByStatus[]>('/dashboard/risk-count-by-statuses' +(params?params:'')).pipe((
      map((res:RiskCountByStatus[])=>{
        RiskDashboardStore.setRiskCountByStatuses(res);
        return res;
      })
    ))
  }

  getRiskCountByCategories(): Observable<RiskCountByCategories[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCountByCategories[]>('/dashboard/risk-count-by-categories' +(params?params:'')).pipe((
      map((res:RiskCountByCategories[])=>{
        RiskDashboardStore.setRiskCountByCategories(res);
        return res;
      })
    ))
  }

  getRiskCountByOwners(): Observable<RiskCountByOwners[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCountByOwners[]>('/dashboard/risk-count-by-owners' +(params?params:'')).pipe((
      map((res:RiskCountByOwners[])=>{
        RiskDashboardStore.setRiskCountByOwners(res);
        return res;
      })
    ))
  }

  getRiskHeatMap(): Observable<RiskHeatMap[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/dashboard/risk-heat-map' +(params?params:'')).pipe((
      map((res:RiskHeatMap[])=>{
        RiskDashboardStore.setRiskHeatMapDetails(res);
        return res;
      })
    ))
  }

  getRiskCountByInherentRiskRatings(): Observable<any[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any[]>('/dashboard/risk-count-by-inherent-risk-ratings' +(params?params:'')).pipe((
      map((res:any[])=>{
        RiskDashboardStore.setRiskCountByInherentRiskRatings(res);
        return res;
      })
    ))
  }

  getRiskCountByResidualRiskRatings(): Observable<any[]> {
    let params = '';
    // if(!RightSidebarLayoutStore.isFilterSelected('is_functional', 1) && !RightSidebarLayoutStore.isFilterSelected('is_corporate', 1))
    //   params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any[]>('/dashboard/risk-count-by-residual-risk-ratings' +(params?params:'')).pipe((
      map((res:any[])=>{
        RiskDashboardStore.setRiskCountByResidualRiskRatings(res);
        return res;
      })
    ))
  }

}
