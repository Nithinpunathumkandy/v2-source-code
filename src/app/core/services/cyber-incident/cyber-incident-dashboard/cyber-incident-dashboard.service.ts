import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentCorrectiveActionCountByDepartments, IncidentCount, IncidentCountByDepartments, IncidentCountByMonths, IncidentCountByYears } from 'src/app/core/models/cyber-incident/cyber-incident-dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentDashBoardStore } from 'src/app/stores/cyber-incident/cyber-incident-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentDashboardService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,) { }

    
  getIncidentCount(): Observable<IncidentCount> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCount>('/cyber-incident/dashboard/cyber-incident-counts' +(params?params:'')).pipe((
      map((res:IncidentCount)=>{
        CyberIncidentDashBoardStore.setIncidentCountDetails(res);
        return res;
      })
    ))
  }

  getIncidentCountByYears(): Observable<IncidentCountByYears[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByYears[]>('/cyber-incident/dashboard/cyber-incident-count-by-years' +(params?params:'')).pipe((
      map((res:IncidentCountByYears[])=>{
        CyberIncidentDashBoardStore.setIncidentCountByYearsDetails(res);
        return res;
      })
    ))
  }

  getIncidentCountByMonths(): Observable<IncidentCountByMonths[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByMonths[]>('/cyber-incident/dashboard/cyber-incident-count-by-months' +(params?params:'')).pipe((
      map((res:IncidentCountByMonths[])=>{
        CyberIncidentDashBoardStore.setIncidentCountByMonthsDetails(res);
        return res;
      })
    ))
  }

  getIncidentCountByDepartments(): Observable<IncidentCountByDepartments[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCountByDepartments[]>('/cyber-incident/dashboard/cyber-incident-count-by-departments' +(params?params:'')).pipe((
      map((res:IncidentCountByDepartments[])=>{
        CyberIncidentDashBoardStore.setIncidentCountByDepartments(res);
        return res;
      })
    ))
  }

  getIncidentCorrectiveActionCountByDepartments(): Observable<IncidentCorrectiveActionCountByDepartments[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<IncidentCorrectiveActionCountByDepartments[]>('/cyber-incident/dashboard/cyber-incident-corrective-action-count-by-departments' +(params?params:'')).pipe((
      map((res:IncidentCorrectiveActionCountByDepartments[])=>{
        CyberIncidentDashBoardStore.setIncidentCorrectiveActionCountByDepartments(res);
        return res;
      })
    ))
  }
}
