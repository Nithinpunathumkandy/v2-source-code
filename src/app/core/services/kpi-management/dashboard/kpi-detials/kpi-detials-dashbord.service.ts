import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiCountByCategory, KpiCountByDepartment, KpiCountByStatus, KpiCounts, KpiImprovementPlanCounts, KpiLeastPerforming, KpiPerformancebyTypeCounts, KpiTopPerforming } from 'src/app/core/models/kpi-management/dashboard/kpi-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { KPIDetialsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-detials-dashboard-store';
@Injectable({
  providedIn: 'root'
})
export class KpiDetialsDashbordService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

   /*1*/
   getKpiCountByStatus(): Observable<KpiCountByStatus[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiCountByStatus[]>('/kpi-management/dashboard/kpi-count-by-status' +(params?params:'')).pipe((
      map((res:KpiCountByStatus[])=>{
        KPIDetialsDashboardStore.setKpiCountByStatus(res);
        return res;
      })
    ))
  }

  /*2*/
  getkpiPerformancebyTypeCounts(): Observable<KpiPerformancebyTypeCounts[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiPerformancebyTypeCounts[]>('/kpi-management/dashboard/kpi-performance-by-type-counts' +(params?params:'')).pipe((
      map((res:KpiPerformancebyTypeCounts[])=>{
        KPIDetialsDashboardStore.setKpiPerformancebyTypeCounts(res);
        return res;
      })
    ))
  }

  /*4*/
  getKpiCountByCategory(): Observable<KpiCountByCategory[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiCountByCategory[]>('/kpi-management/dashboard/kpi-count-by-category' +(params?params:'')).pipe((
      map((res:KpiCountByCategory[])=>{
        KPIDetialsDashboardStore.setKpiCountByCategory(res);
        return res;
      })
    ))
  }

  /*5*/
  getKpiCountByDepartment(): Observable<KpiCountByDepartment[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiCountByDepartment[]>('/kpi-management/dashboard/kpi-count-by-department' +(params?params:'')).pipe((
      map((res:KpiCountByDepartment[])=>{
        KPIDetialsDashboardStore.setKpiCountByDepartment(res);
        return res;
      })
    ))
  }

  /*6*/
  getKpiTopPerforming(): Observable<KpiTopPerforming[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiTopPerforming[]>('/kpi-management/dashboard/kpi-top-performing' +(params?params:'')).pipe((
      map((res:KpiTopPerforming[])=>{
        KPIDetialsDashboardStore.setKpiTopPerforming(res);
        return res;
      })
    ))
  }

  /*7*/
  getKpiLeastPerforming(): Observable<KpiLeastPerforming[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiLeastPerforming[]>('/kpi-management/dashboard/kpi-least-performing' +(params?params:'')).pipe((
      map((res:KpiLeastPerforming[])=>{
        KPIDetialsDashboardStore.setKpiLeastPerforming(res);
        return res;
      })
    ))
  }

}
