import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditCounts, CorrectiveActionByStatus, ProgramByCategories, FindingsByDepartment, FindingsByMsTypes, FindingsByStatus, PlanByStatus, AuditFindingCounts } from 'src/app/core/models/ms-audit-management/dashboard/dashboard';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AuditDashboardStore } from 'src/app/stores/ms-audit-management/dashboard/audit-dashboard.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }
  
  getPlanByStatus(): Observable<PlanByStatus> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<PlanByStatus>(`/dashboard/ms-audit-plan-by-statuses`+(params ? params : '')).pipe(
      map((res: PlanByStatus) => {
        AuditDashboardStore.setPlanByStatus(res);
        return res;

      })
    );
  }

  getProgramByCategories(): Observable<ProgramByCategories> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProgramByCategories>(`/dashboard/ms-audit-program-by-categories`+(params ? params : '')).pipe(
      map((res: ProgramByCategories) => {
        AuditDashboardStore.setProgramByCategories(res);
        return res;

      })
    );
  }


  getFindingByDepartment(): Observable<FindingsByDepartment> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingsByDepartment>(`/dashboard/ms-audit-finding-by-departments`+(params ? params : '')).pipe(
      map((res: FindingsByDepartment) => {
        AuditDashboardStore.setFindingsByDepartment(res);
        return res;

      })
    );
  }

  getAuditCount(): Observable<AuditCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditCounts>(`/dashboard/ms-audit-counts`+(params ? params : '')).pipe(
      map((res: AuditCounts) => {
        AuditDashboardStore.setAuditCounts(res);
        return res;

      })
    );
  }

  getAuditFindingCount(): Observable<AuditFindingCounts> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditFindingCounts>(`/dashboard/ms-audit-finding-counts`+(params ? params : '')).pipe(
      map((res: AuditFindingCounts) => {
        AuditDashboardStore.setAuditFindingCounts(res);
        return res;

      })
    );
  }

  findingsByMsTypes(): Observable<FindingsByMsTypes> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingsByMsTypes>(`/dashboard/ms-audit-findings-by-ms-types`+(params ? params : '')).pipe(
      map((res: FindingsByMsTypes) => {
        AuditDashboardStore.setFindingsByMsType(res);
        return res;

      })
    );
  }

  findingsByStatus(): Observable<FindingsByStatus> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingsByStatus>(`/dashboard/ms-audit-finding-by-statuses`+(params ? params : '')).pipe(
      map((res: FindingsByStatus) => {
        AuditDashboardStore.setFindingsByStatus(res);
        return res;

      })
    );
  }

  findingsByCategory(): Observable<any> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>(`/dashboard/ms-audit-finding-by-categories`+(params ? params : '')).pipe(
      map((res: any) => {
        AuditDashboardStore.setFindingsByCategory(res);
        return res;

      })
    );
  }

  caDelayCountByDepartments(): Observable<any> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>(`/dashboard/ms-audit-corrective-action-delay-analysis-by-department`+(params ? params : '')).pipe(
      map((res: any) => {
        AuditDashboardStore.setCaDelayCount(res);
        return res;

      })
    );
  }

  getCorrectiveActionByStatus(): Observable<CorrectiveActionByStatus> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionByStatus>(`/dashboard/ms-audit-corrective-action-by-statuses`+(params ? params : '')).pipe(
      map((res: CorrectiveActionByStatus) => {
        AuditDashboardStore.setCorrectiveActionByStatus(res);
        return res;

      })
    );
  }

  getScheduleStatus(): Observable<CorrectiveActionByStatus> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionByStatus>(`/dashboard/ms-audit-schedule-by-statuses`+(params ? params : '')).pipe(
      map((res: CorrectiveActionByStatus) => {
        AuditDashboardStore.setScheduleByStatus(res);
        return res;

      })
    );
  }
}
