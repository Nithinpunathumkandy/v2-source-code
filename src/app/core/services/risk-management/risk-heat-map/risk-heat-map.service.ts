import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RiskHeatMapStore } from 'src/app/stores/risk-management/risk-heat-map/risk-heat-map.store';
import { RiskHeatMap } from 'src/app/core/models/risk-management/risk-heat-map/risk-heat-map';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class RiskHeatMapService {

  constructor(private _http: HttpClient) { }

  getItem(): Observable<RiskHeatMap[]> {
    let params = "";
    if(RightSidebarLayoutStore.filterPageTag == 'risk_heat_map'   && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/risk-heat-map' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        RiskHeatMapStore.setRiskHeatMapDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemByCategory(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_category'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/risk-heat-map/by-category'  +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        RiskHeatMapStore.setHeatMapByCategoryDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemByDivision(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_division'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/risk-heat-map/by-division' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        RiskHeatMapStore.setHeatMapByDivisionDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItemBySection(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_section'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/risk-heat-map/by-section' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        RiskHeatMapStore.setHeatMapBySectionDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemBySource(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_risk_source'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/risk-heat-map/by-risk-source' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        RiskHeatMapStore.setHeatMapBySourceDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItemByDepartment(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_department'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/risk-heat-map/by-department' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        RiskHeatMapStore.setHeatMapByDepartmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
