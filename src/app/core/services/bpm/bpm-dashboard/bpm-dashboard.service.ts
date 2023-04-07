import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BpmBarControls, BpmBarDepartment, BpmBarOwner, BPMCounts, BpmPaginationResponse, BPMPieChart } from 'src/app/core/models/bpm/bpm-dashboard/bpm-dashboard';
import { BPMDashboardStore } from 'src/app/stores/bpm/bpm-dashboard/bpm-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class BpmDashboardService {

  constructor(
    private _http: HttpClient,

  ) { }

  getBPMCount(): Observable<BPMCounts> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BPMCounts>('/dashboard/bpm-counts' +(params ? params : '')).pipe((
      map((res:BPMCounts)=>{
        BPMDashboardStore.setBPMCounts(res);
        return res;
      })
    ))
  }

  getPieChart(): Observable<BPMPieChart[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BPMPieChart[]>('/dashboard/bpm-risk-rating-wise-process-count' +(params ? params : '')).pipe((
      map((res:BPMPieChart[])=>{
        BPMDashboardStore.setBpmPieChart(res);
        return res;
      })
    ))
  }

  getBpm(getAll: boolean=false, additionalParams): Observable<BpmPaginationResponse> {
    // let params='?page=1&limit=5'
    let params: string = '';
    if(!getAll)
      params = `?page=${BPMDashboardStore.currentPage}&limit=5`;
    
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    // params = (params == '') ? params + '?page=1' : params + '&page=1';
    return this._http.get<BpmPaginationResponse>('/dashboard/bpm-top-ten-riskful-processes' +(params ? params : '')).pipe((
      map((res:BpmPaginationResponse)=>{
        BPMDashboardStore.setFirstBpm(res);
        return res;
      })
    ))
  }

  getSecondBpm(getAll: boolean=false, additionalParams): Observable<BpmPaginationResponse> {
    let params: string = '';
    if(!getAll)
      params = `?page=${BPMDashboardStore.currentSecondPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    // params = (params == '') ? params + '?page=2' : params + '&page=2';
    return this._http.get<BpmPaginationResponse>('/dashboard/bpm-top-ten-riskful-processes' +(params ? params : '')).pipe((
      map((res:BpmPaginationResponse)=>{
        BPMDashboardStore.setSecondBpm(res);
        return res;
      })
    ))
  }

  getBpmBarOwner(): Observable<BpmBarOwner[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BpmBarOwner[]>('/dashboard/bpm-process-by-owner-count' +(params ? params : '')).pipe((
      map((res:BpmBarOwner[])=>{
        BPMDashboardStore.setBpmBarOwner(res);
        return res;
      })
    ))
  }

  getBpmBarDepartment(): Observable<BpmBarDepartment[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BpmBarDepartment[]>('/dashboard/bpm-process-by-department-count' +(params ? params : '')).pipe((
      map((res:BpmBarDepartment[])=>{
        BPMDashboardStore.setBpmBarDepartment(res);
        return res;
      })
    ))
  }

  getBpmBarControls(): Observable<BpmBarControls[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BpmBarControls[]>('/dashboard/bpm-process-by-control-count' +(params ? params : '')).pipe((
      map((res:BpmBarControls[])=>{
        BPMDashboardStore.setBpmBarControls(res);
        return res;
      })
    ))
  }
}
