import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import { IsmsRiskHeatMapStore } from 'src/app/stores/risk-management/isms-risk-heat-map/isms-risk-heat-map.store';
import { RiskHeatMap } from 'src/app/core/models/risk-management/risk-heat-map/risk-heat-map';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IsmsRiskHeatMapStore } from 'src/app/stores/isms/isms-risk-heat-map/isms-risk-heat-map.store';


@Injectable({
  providedIn: 'root'
})
export class IsmsHeatMapService {

  constructor(private _http: HttpClient) { }

  getItem(): Observable<RiskHeatMap[]> {
    let params = "";
    if(RightSidebarLayoutStore.filterPageTag == 'isms_risk_heat_map'   && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/isms-risk-heat-map' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        IsmsRiskHeatMapStore.setRiskHeatMapDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemByCategory(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_category'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/isms-risk-heat-map/by-category'  +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        IsmsRiskHeatMapStore.setHeatMapByCategoryDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemByDivision(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_division'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/isms-risk-heat-map/by-division' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        IsmsRiskHeatMapStore.setHeatMapByDivisionDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItemBySection(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_section'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/isms-risk-heat-map/by-section' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        IsmsRiskHeatMapStore.setHeatMapBySectionDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemBySource(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_risk_source'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/isms-risk-heat-map/by-risk-source' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        IsmsRiskHeatMapStore.setHeatMapBySourceDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItemByDepartment(): Observable<RiskHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_department'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskHeatMap[]>('/isms-risk-heat-map/by-department' +(params?params:'')).pipe(
      map((res: RiskHeatMap[]) => {
        IsmsRiskHeatMapStore.setHeatMapByDepartmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
