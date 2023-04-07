import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {  KpiByPerformanceCounts, KpiByType, KpiByTypePaginationResponse, KpiCounts, KpiImprovementPlanCounts, KpiPerformanceByDepartmentCounts, KpiPerformanceByTypeCounts } from 'src/app/core/models/kpi-management/dashboard/kpi-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { KPIDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-dashbord';

@Injectable({
  providedIn: 'root'
})
export class KpiDashboardService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  /*1*/
  getKpiCounts(): Observable<KpiCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiCounts>('/kpi-management/dashboard/kpi-counts' +(params?params:'')).pipe((
      map((res:KpiCounts)=>{
        KPIDashboardStore.setKpiCounts(res);
        return res;
      })
    ))
  }

  
  /*2*/
  getKpiImprovementPlanCounts(): Observable<KpiImprovementPlanCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiImprovementPlanCounts>('/kpi-management/dashboard/kpi-improvement-plan-counts' +(params?params:'')).pipe((
      map((res:KpiImprovementPlanCounts)=>{
        KPIDashboardStore.setKpiImprovementPlanCounts(res);
        return res;
      })
    ))
  }

  /*3*/
  getKpiByPerformanceCounts(): Observable<KpiByPerformanceCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiByPerformanceCounts>('/kpi-management/dashboard/kpi-by-performance-counts' +(params?params:'')).pipe((
      map((res:KpiByPerformanceCounts)=>{
        KPIDashboardStore.setKpiByPerformanceCounts(res);
        return res;
      })
    ))
  }

  /*4*/
  getKpiPerformanceByDepartmentCounts(): Observable<KpiPerformanceByDepartmentCounts[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiPerformanceByDepartmentCounts[]>('/kpi-management/dashboard/kpi-performance-by-department-counts' +(params?params:'')).pipe((
      map((res:KpiPerformanceByDepartmentCounts[])=>{
        KPIDashboardStore.setKpiPerformanceByDepartmentCounts(res);
        return res;
      })
    ))
  }

  /*5*/
  // getKpisByType(id): Observable<KpiByTypePaginationResponse> {
  //   return this._http.get<KpiByTypePaginationResponse>(`/kpi-management/dashboard/kpi-by-types?kpi_type_ids=${id}`).pipe((
  //     map((res:KpiByTypePaginationResponse)=>{
  //       KPIDashboardStore.setKpiByTypes(res);
  //       return res;
  //     })
  //   ))
  // }

  getKpisByType(getAll: boolean = false, additionalParams?: string): Observable<KpiByTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KPIDashboardStore.currentPage}&status=all`;
      if (KPIDashboardStore.orderBy) params += `&order_by=${KPIDashboardStore.orderItem}&order=${KPIDashboardStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiByTypePaginationResponse>('/kpi-management/dashboard/kpi-by-types' + (params ? params : '')).pipe(
      map((res: KpiByTypePaginationResponse) => {
        KPIDashboardStore.setKpiByTypes(res);
        return res;
      })
    );
  }

  
  /*6*/
  getKpiPerformanceByTypeCounts(): Observable<KpiPerformanceByTypeCounts[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiPerformanceByTypeCounts[]>('/kpi-management/dashboard/kpi-performance-by-type-counts' +(params?params:'')).pipe((
      map((res:KpiPerformanceByTypeCounts[])=>{
        KPIDashboardStore.setKpiPerformanceByTypeCounts(res);
        return res;
      })
    ))
  }

}
