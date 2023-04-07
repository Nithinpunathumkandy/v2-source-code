import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyDaashboardStore } from 'src/app/stores/strategy-management/dashboard.store';
import { StrategyCount } from 'src/app/core/models/strategy-management/dashbord.model';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http: HttpClient,) { }

    getStrategyCounts(additionalParams?:string):Observable<StrategyCount>{
      let params = '';
      if(additionalParams) params += additionalParams;
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<StrategyCount>('/dashboard/strategy-profile-count' +(params?params:'')).pipe((
        map((res:StrategyCount)=>{
          StrategyDaashboardStore.setStrategyCountDetails(res);
          return res;
        })
      ))
    }


    getStrategyProfiles(getAll: boolean = false,additionalParams?:string,is_all:boolean = false){
      let params = '';
      if (!getAll) {
        params = `?page=${StrategyDaashboardStore.currentPage}`;
        if (StrategyDaashboardStore.orderBy) params += `&order_by=${StrategyDaashboardStore.orderItem}&order=${StrategyDaashboardStore.orderBy}`;
  
      }
      if(additionalParams) params += additionalParams;
      if(StrategyDaashboardStore.searchText) params += (params ? '&q=' : '?q=')+StrategyDaashboardStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<any>('/dashboard/strategy-profiles' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setStrategyProfiles(res);
          return res;
        })
      ))
    }

    totalBudgetvsActual(){
      let params = '';
      
      return this._http.get<any>('/dashboard/strategy-profile-total-budget-vs-actual' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setTotalBudgetvsActual(res);
          return res;
        })
      ))
    }

    profileStatusByDepartment(){
      let params = '';
      return this._http.get<any>('/dashboard/strategy-profile-status-by-departments' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setProfileStatusByDepartment(res);
          return res;
        })
      ))
    }

    achivedVsTarget(id){
      let params = '';
      return this._http.get<any>('/dashboard/strategy-profile/'+id+'/achieved-vs-target' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setAchivedVsTarget(res);
          return res;
        })
      ))
    }

    profileCounts(id){
      let params = '';
      return this._http.get<any>('/dashboard/strategy-profile/'+id+'/strategy-profile-count' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setProfileCounts(res);
          return res;
        })
      ))
    }

    profileDetails(id){
      let params = '';
      return this._http.get<any>('/dashboard/strategy-profile/'+id +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setInduvalProfileDetails(res);
          return res;
        })
      ))
    }

    getKpiScoreCounts(getAll: boolean = false,additionalParams?:string){
      let params = '';
      if (!getAll) {
        params = `?page=${StrategyDaashboardStore.currentKPIPage}&limit=5`;
        if (StrategyDaashboardStore.orderByKPI) params += `&order=${StrategyDaashboardStore.orderByKPI}`;
      }
      if(additionalParams) params += additionalParams;
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<any>('/dashboard/strategy-profile/'+StrategyStore.strategyProfileId+'/focus-areas/'+StrategyStore.focusAreaId+'/objectives/'+StrategyStore.objectiveId +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setKpiScoreCounts(res);
          return res;
        })
      ))
    }

    getProfileObjectives(additionalParams?:string){
      let params = '';
      if(additionalParams) params += additionalParams;
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<any>('/strategy-profile-objectives' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setObjectives(res);
          return res;
        })
      ))
    }

    getProfileInitiatives(additionalParams?:string){
      let params = '';
      if(additionalParams) params += additionalParams;
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<any>('/strategy-initiatives' +(params?params:'')).pipe((
        map((res:any)=>{
          StrategyDaashboardStore.setInitiatives(res);
          return res;
        })
      ))
    }

}
