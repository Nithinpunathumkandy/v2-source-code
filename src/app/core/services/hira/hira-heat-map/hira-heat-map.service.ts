import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HiraHeatMapStore } from 'src/app/stores/hira/hira-heatmap/hira-heatmap.store';
import { HiraHeatMap } from 'src/app/core/models/hira/hira-heatmap/hira-heatmap';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class HiraHeatMapService {

  constructor(private _http: HttpClient) { }

  getItem(): Observable<HiraHeatMap[]> {
    let params = "";
    if(RightSidebarLayoutStore.filterPageTag == 'risk_heat_map'   && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<HiraHeatMap[]>('/risk-heat-map' +(params?params:'')).pipe(
      map((res: HiraHeatMap[]) => {
        HiraHeatMapStore.setHiraHeatMapDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemByCategory(): Observable<HiraHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_category'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<HiraHeatMap[]>('/risk-heat-map/by-category'  +(params?params:'')).pipe(
      map((res: HiraHeatMap[]) => {
        HiraHeatMapStore.setHeatMapByCategoryDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemByDivision(): Observable<HiraHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_division'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<HiraHeatMap[]>('/risk-heat-map/by-division' +(params?params:'')).pipe(
      map((res: HiraHeatMap[]) => {
        HiraHeatMapStore.setHeatMapByDivisionDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItemBySection(): Observable<HiraHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_section'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<HiraHeatMap[]>('/risk-heat-map/by-section' +(params?params:'')).pipe(
      map((res: HiraHeatMap[]) => {
        HiraHeatMapStore.setHeatMapBySectionDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
  getItemBySource(): Observable<HiraHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_risk_source'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<HiraHeatMap[]>('/risk-heat-map/by-risk-source' +(params?params:'')).pipe(
      map((res: HiraHeatMap[]) => {
        HiraHeatMapStore.setHeatMapBySourceDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItemByDepartment(): Observable<HiraHeatMap[]> {
    let params = "";
    if( RightSidebarLayoutStore.filterPageTag == 'heap_by_department'  && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<HiraHeatMap[]>('/risk-heat-map/by-department' +(params?params:'')).pipe(
      map((res: HiraHeatMap[]) => {
        HiraHeatMapStore.setHeatMapByDepartmentDetails(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }
}
