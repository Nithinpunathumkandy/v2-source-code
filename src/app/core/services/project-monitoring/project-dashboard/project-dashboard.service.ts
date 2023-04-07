import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BudgetByDepartments, BudgetByYears, ChangeRequestByDepartments, ChangeRequestByStatus, MilestoneByDepartments, MilestoneByMonths, ProjectByContractTypes, ProjectByDepartment, ProjectByPriority, ProjectByTypes, ProjectByYears, ProjectClosureByDepartments, ProjectClosureByStatus, ProjectCounts, ProjectIssuesByDepartment, ProjectIssuesByStatuses } from 'src/app/core/models/project-monitoring/project-dasboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectDashboardStore } from 'src/app/stores/project-monitoring/project-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class ProjectDashboardService {

  constructor(
    private _http: HttpClient,
  ) { }

  getProjectCount(): Observable<ProjectCounts[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectCounts[]>('/project-monitor/dashboard/project-by-statuses' +(params ? params : '')).pipe((
      map((res:ProjectCounts[])=>{
        ProjectDashboardStore.setProjectCounts(res);
        return res;
      })
    ))
  }

  getProjectByDepartment(): Observable<ProjectByDepartment[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectByDepartment[]>('/project-monitor/dashboard/project-by-departments' +(params ? params : '')).pipe((
      map((res:ProjectByDepartment[])=>{
        ProjectDashboardStore.setProjectByDepartment(res);
        return res;
      })
    ))
  }

  getProjectByContractTypes(): Observable<ProjectByContractTypes[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectByContractTypes[]>('/project-monitor/dashboard/project-by-contract-types' +(params ? params : '')).pipe((
      map((res:ProjectByContractTypes[])=>{
        ProjectDashboardStore.setProjectByContractTypes(res);
        return res;
      })
    ))
  }
  
  getProjectByPriority(): Observable<ProjectByPriority[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectByPriority[]>('/project-monitor/dashboard/project-by-priorities' +(params ? params : '')).pipe((
      map((res:ProjectByPriority[])=>{
        ProjectDashboardStore.setProjectByPriority(res);
        return res;
      })
    ))
  }

  getProjectByYears(): Observable<ProjectByYears[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectByYears[]>('/project-monitor/dashboard/project-by-years' +(params ? params : '')).pipe((
      map((res:ProjectByYears[])=>{
        ProjectDashboardStore.setProjectByYears(res);
        return res;
      })
    ))
  }

  getProjectIssuesByStatuses(): Observable<ProjectIssuesByStatuses[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectIssuesByStatuses[]>('/project-monitor/dashboard/project-issues-by-statuses' +(params ? params : '')).pipe((
      map((res:ProjectIssuesByStatuses[])=>{
        ProjectDashboardStore.setProjectIssuesByStatuses(res);
        return res;
      })
    ))
  }

  getBudgetByYears(): Observable<BudgetByYears[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BudgetByYears[]>('/project-monitor/dashboard/budget-by-years' +(params ? params : '')).pipe((
      map((res:BudgetByYears[])=>{
        ProjectDashboardStore.setBudgetByYears(res);
        return res;
      })
    ))
  }

  getBudgetByDepartments(): Observable<BudgetByDepartments[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BudgetByDepartments[]>('/project-monitor/dashboard/budget-by-departments' +(params ? params : '')).pipe((
      map((res:BudgetByDepartments[])=>{
        ProjectDashboardStore.setBudgetByDepartments(res);
        return res;
      })
    ))
  }

  getMilestoneByMonths(): Observable<MilestoneByMonths[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MilestoneByMonths[]>('/project-monitor/dashboard/milestone-by-months' +(params ? params : '')).pipe((
      map((res:MilestoneByMonths[])=>{
        ProjectDashboardStore.setMilestoneByMonths(res);
        return res;
      })
    ))
  }

  getMilestoneByDepartments(): Observable<MilestoneByDepartments[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MilestoneByDepartments[]>('/project-monitor/dashboard/milestone-by-departments' +(params ? params : '')).pipe((
      map((res:MilestoneByDepartments[])=>{
        ProjectDashboardStore.setMilestoneByDepartments(res);
        return res;
      })
    ))
  }

  getProjectByTypes(): Observable<ProjectByTypes[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectByTypes[]>('/project-monitor/dashboard/project-by-types' +(params ? params : '')).pipe((
      map((res:ProjectByTypes[])=>{
        ProjectDashboardStore.setProjectByTypes(res);
        return res;
      })
    ))
  }

  getProjectIssuesByDepartment(): Observable<ProjectIssuesByDepartment[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectIssuesByDepartment[]>('/project-monitor/dashboard/project-issues-by-departments' +(params ? params : '')).pipe((
      map((res:ProjectIssuesByDepartment[])=>{
        ProjectDashboardStore.setProjectIssuesByDepartment(res);
        return res;
      })
    ))
  }

  getProjectClosureByStatus(): Observable<ProjectClosureByStatus[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_closure_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectClosureByStatus[]>('/project-monitor/dashboard/project-closure-by-statuses' +(params ? params : '')).pipe((
      map((res:ProjectClosureByStatus[])=>{
        ProjectDashboardStore.setProjectClosureByStatus(res);
        return res;
      })
    ))
  }

  getProjectClosureByDepartments(): Observable<ProjectClosureByDepartments[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_closure_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectClosureByDepartments[]>('/project-monitor/dashboard/project-closure-by-departments' +(params ? params : '')).pipe((
      map((res:ProjectClosureByDepartments[])=>{
        ProjectDashboardStore.setProjectClosureByDepartments(res);
        return res;
      })
    ))
  }

  getChangeRequestByDepartments(): Observable<ChangeRequestByDepartments[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_change_request_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ChangeRequestByDepartments[]>('/project-monitor/dashboard/project-change-request-by-departments' +(params ? params : '')).pipe((
      map((res:ChangeRequestByDepartments[])=>{
        ProjectDashboardStore.setChangeRequestByDepartments(res);
        return res;
      })
    ))
  }

  getChangeRequestByStatus(): Observable<ChangeRequestByStatus[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'project_change_request_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ChangeRequestByStatus[]>('/project-monitor/dashboard/project-change-request-by-statuses' +(params ? params : '')).pipe((
      map((res:ChangeRequestByStatus[])=>{
        ProjectDashboardStore.setChangeRequestByStatus(res);
        return res;
      })
    ))
  }
}
