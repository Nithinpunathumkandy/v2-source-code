import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyNsRecord } from 'dns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActionPlan, MeetingVsActionPlan, MeetingYear, MRMCounts } from 'src/app/core/models/mrm/dashboard/mrm-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MRMDashboardStore } from 'src/app/stores/mrm/mrm-dashboard/mrm-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class MrmDashboardService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getMRMCount(): Observable<MRMCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MRMCounts>('/dashboard/mrm-counts' +(params?params:'')).pipe((
      map((res:MRMCounts)=>{
        MRMDashboardStore.setMRMCounts(res);
        return res;
      })
    ))
  }

  getActionPlanCount(): Observable<ActionPlan[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ActionPlan[]>('/dashboard/mrm-action-plans' +(params?params:'')).pipe((
      map((res:ActionPlan[])=>{
        MRMDashboardStore.setActionPlan(res);
        return res;
      })
    ))
  }

  getMeetingByStatus(): Observable<ActionPlan[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ActionPlan[]>('/dashboard/mrm-by-statuses' +(params?params:'')).pipe((
      map((res:ActionPlan[])=>{
        MRMDashboardStore.setMeetingByStatus(res);
        return res;
      })
    ))
  }

  getMeetingByDepartments(): Observable<ActionPlan[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ActionPlan[]>('/dashboard/mrm-by-departments' +(params?params:'')).pipe((
      map((res:ActionPlan[])=>{
        MRMDashboardStore.setMeetingByDepartments(res);
        return res;
      })
    ))
  }

  getMeetingByCategory(): Observable<ActionPlan[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ActionPlan[]>('/dashboard/mrm-by-categories' +(params?params:'')).pipe((
      map((res:ActionPlan[])=>{
        MRMDashboardStore.setMeetingByCategories(res);
        return res;
      })
    ))
  }

  getMeetingByYear(): Observable<MeetingYear[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MeetingYear[]>('/dashboard/mrm-by-years' +(params?params:'')).pipe((
      map((res:MeetingYear[])=>{
        MRMDashboardStore.setMeetingByYears(res);
        return res;
      })
    ))
  }

  getMeetingVsActionplan(): Observable<MeetingVsActionPlan[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'mrm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MeetingVsActionPlan[]>('/dashboard/mrm-vs-action-plans' +(params?params:'')).pipe((
      map((res:MeetingVsActionPlan[])=>{
        MRMDashboardStore.setMeetingVsActionPlan(res);
        return res;
      })
    ))
  }
  
}
