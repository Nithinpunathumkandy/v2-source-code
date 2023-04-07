import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BCMCounts, BCPCountByStatuses, BIAByYear, BIAPerformedCounts, ChangeRequestCountByYears, CriticalProcessCounts, RiskCounts, SolutionCountByScores, StrategyCountByStatuses, StrategyCountByTypes, TestAndExercisePerformedCounts } from 'src/app/core/models/bcm/bcm-dashboard/bcm-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BCMDashboardStore } from 'src/app/stores/bcm/bcm-dashboard/bcm-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class BcmDashboardService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getBCMCounts(): Observable<BCMCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BCMCounts>('/dashboard/bcm-counts' +(params?params:'')).pipe((
      map((res:BCMCounts)=>{
        BCMDashboardStore.setBCMCounts(res)
        return res;
      })
    ))
  }

  getCriticalProcessCounts(): Observable<CriticalProcessCounts[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CriticalProcessCounts[]>('/dashboard/bcm-critical-process-counts' +(params?params:'')).pipe((
      map((res:CriticalProcessCounts[])=>{
        BCMDashboardStore.setCriticalProcessCounts(res)
        return res;
      })
    ))
  }

  getRiskCounts(): Observable<RiskCounts[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskCounts[]>('/dashboard/bcm-risk-counts' +(params?params:'')).pipe((
      map((res:RiskCounts[])=>{
        BCMDashboardStore.setRiskCounts(res)
        return res;
      })
    ))
  }

  getBIAPerformedVsNonPerformedCounts(): Observable<BIAPerformedCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BIAPerformedCounts>('/dashboard/bcm-bia-performed-counts' +(params?params:'')).pipe((
      map((res:BIAPerformedCounts)=>{
        BCMDashboardStore.setBIAPerformedCounts(res)
        return res;
      })
    ))
  }

  getBIAByYearCounts(): Observable<BIAByYear[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BIAByYear[]>('/dashboard/bcm-bia-by-years' +(params?params:'')).pipe((
      map((res:BIAByYear[])=>{
        BCMDashboardStore.setBIAByYear(res)
        return res;
      })
    ))
  }

  getBCPCountByStatus(): Observable<BCPCountByStatuses[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BCPCountByStatuses[]>('/dashboard/bcm-bcp-count-by-statuses' +(params?params:'')).pipe((
      map((res:BCPCountByStatuses[])=>{
        BCMDashboardStore.setBCPCountByStatuses(res)
        return res;
      })
    ))
  }

  getStrategyCountByTypes(): Observable<StrategyCountByTypes[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StrategyCountByTypes[]>('/dashboard/bcm-strategy-count-by-types' +(params?params:'')).pipe((
      map((res:StrategyCountByTypes[])=>{
        BCMDashboardStore.setStrategyCountByTypes(res)
        return res;
      })
    ))
  }

  getSolutionCountByScores(): Observable<SolutionCountByScores[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<SolutionCountByScores[]>('/dashboard/bcm-solution-count-by-scores' +(params?params:'')).pipe((
      map((res:SolutionCountByScores[])=>{
        BCMDashboardStore.setSolutionCountByScores(res)
        return res;
      })
    ))
  }

  getStrategyCountByStatuses(): Observable<StrategyCountByStatuses[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StrategyCountByStatuses[]>('/dashboard/bcm-strategy-count-by-statuses' +(params?params:'')).pipe((
      map((res:StrategyCountByStatuses[])=>{
        BCMDashboardStore.setStrategyCountByStatuses(res)
        return res;
      })
    ))
  }

  getChangeRequestCountByYears(): Observable<ChangeRequestCountByYears[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ChangeRequestCountByYears[]>('/dashboard/bcm-change-request-count-by-years' +(params?params:'')).pipe((
      map((res:ChangeRequestCountByYears[])=>{
        BCMDashboardStore.setChangeRequestCountByYears(res)
        return res;
      })
    ))
  }

  getTestAndExercisePerformedCounts(): Observable<TestAndExercisePerformedCounts[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TestAndExercisePerformedCounts[]>('/dashboard/bcm-test-and-exercise-performed-counts' +(params?params:'')).pipe((
      map((res:TestAndExercisePerformedCounts[])=>{
        BCMDashboardStore.setTestAndExercisePerformedCounts(res)
        return res;
      })
    ))
  }
  
}
