import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentCorrectiveActionCountByDepartments, IncidentCount, IncidentCountByCategories, IncidentCountByDepartments, IncidentCountByMonths, IncidentCountByYears, IncidentEmployeesVsPersonInvolved } from 'src/app/core/models/incident-management/incident-dashboard/incident-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IncidentDashBoardStore } from 'src/app/stores/incident-management/incident-dashboard/incident-dashboard.store';
import { RiskDashboardStore } from 'src/app/stores/risk-management/risk-dashboard/risk-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class IncidentDshboardService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,) { }

    
  getIncidentCount(): Observable<IncidentCount> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCount>('/dashboard/incident-counts' +(params?params:'')).pipe((
      map((res:IncidentCount)=>{
        IncidentDashBoardStore.setIncidentCountDetails(res);
        return res;
      })
    ))
  }

  getIncidentCountByYears(): Observable<IncidentCountByYears[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByYears[]>('/dashboard/incident-count-by-years' +(params?params:'')).pipe((
      map((res:IncidentCountByYears[])=>{
        IncidentDashBoardStore.setIncidentCountByYearsDetails(res);
        return res;
      })
    ))
  }

  getIncidentCountByMonths(): Observable<IncidentCountByMonths[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByMonths[]>('/dashboard/incident-count-by-months' +(params?params:'')).pipe((
      map((res:IncidentCountByMonths[])=>{
        IncidentDashBoardStore.setIncidentCountByMonthsDetails(res);
        return res;
      })
    ))
  }

  getIncidentCountByDepartments(): Observable<IncidentCountByDepartments[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByDepartments[]>('/dashboard/incident-count-by-departments' +(params?params:'')).pipe((
      map((res:IncidentCountByDepartments[])=>{
         IncidentDashBoardStore.setIncidentCountByDepartments(res);
        return res;
      })
    ))
  }

  getIncidentCountByCategories(): Observable<IncidentCountByCategories[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByCategories[]>('/dashboard/incident-by-category-percentages' +(params?params:'')).pipe((
      map((res:IncidentCountByCategories[])=>{
       IncidentDashBoardStore.setIncidentCountByCategories(res);
        return res;
      })
    ))
  }

  getIncidentCorrectiveActionCountByDepartments(): Observable<IncidentCorrectiveActionCountByDepartments[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCorrectiveActionCountByDepartments[]>('/dashboard/incident-corrective-action-count-by-departments' +(params?params:'')).pipe((
      map((res:IncidentCorrectiveActionCountByDepartments[])=>{
        IncidentDashBoardStore.setIncidentCorrectiveActionCountByDepartments(res);
        return res;
      })
    ))
  }

  getIncidentEmployeesVsPersonInvolved(): Observable<IncidentEmployeesVsPersonInvolved[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentEmployeesVsPersonInvolved[]>('/dashboard/incident-employee-versus-person-involved-percentages' +(params?params:'')).pipe((
      map((res:IncidentEmployeesVsPersonInvolved[])=>{
        IncidentDashBoardStore.setIncidentEmployeesVsPersonInvolved(res);
        return res;
      })
    ))
  }
}
