import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CorrectiveActionOpenCloseCount, DepartmentFindings, CorrectiveActionDepartment, CorrectiveActionResponsibleUser, OverdueActionPlans, StatusWiseAnalysisFindings, Top10Findings, FindingDepartmentPage } from 'src/app/core/models/internal-audit/dashboard/dashboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IADashboardStore } from 'src/app/stores/internal-audit/dashboard/dasboard-store';
import { IADepartmentRiskStore } from 'src/app/stores/internal-audit/dashboard/department-risk-rating-store';

@Injectable({
  providedIn: 'root'
})
export class InternalAuditDashboardService {

  constructor(
    private _http: HttpClient,
  ) { }
  
  getStatusWiseAnalysisFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/internal-audit-findings-count-by-status' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        IADashboardStore.setStatusWiseAnalysisFindings(res)
        return res;
      })
    ))
  }

  getRiskRatingFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/internal-audit-findings-count-by-risk-rating' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        IADashboardStore.setRiskRatingFindings(res)
        return res;
      })
    ))
  }

  getCategoryFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/internal-audit-findings-count-by-category' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        IADashboardStore.setCategoryFindings(res)
        return res;
      })
    ))
  }

  getDivisionFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/internal-audit-findings-count-by-division' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        IADashboardStore.setDivisionFindings(res)
        return res;
      })
    ))
  }

  getDepartmentFindings(getAll: boolean, additionalParams?: string, is_all?: boolean): Observable<DepartmentFindings[]> {
    let params = '';
    if(is_all)
    params = `?is_all=true`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<DepartmentFindings[]>('/dashboard/internal-audit-findings-count-by-department-and-risk-rating' +(params?params:'')).pipe((
      map((res:DepartmentFindings[])=>{
        IADashboardStore.setDepartmentFindings(res)
        return res;
      })
    ))
  }

  getDepartmentFindingsPage(getAll: boolean, additionalParams?: string, is_all?: boolean): Observable<FindingDepartmentPage> {
    let params = '';
    if(!getAll)
      params = `?page=${IADepartmentRiskStore.currentPageDepartmentFindingsPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingDepartmentPage>('/dashboard/internal-audit-findings-count-by-department-and-risk-rating' +(params?params:'')).pipe((
      map((res:FindingDepartmentPage)=>{
        IADepartmentRiskStore.setDepartmentFindingsPage(res)
        return res;
      })
    ))
  }

  getCorrectvieActionByDepartment(getAll: boolean = false, additionalParams?: string): Observable<CorrectiveActionDepartment> {
    let params = '';
    if(!getAll)
      params = `?page=${IADashboardStore.currentPageCorrectiveActionDepartment}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionDepartment>('/dashboard/internal-audit-action-plans-count-by-department-and-risk-rating' +(params?params:'')).pipe((
      map((res:CorrectiveActionDepartment)=>{
        IADashboardStore.setCorrectiveActionDepartment(res)
        return res;
      })
    ))
  }

  getCorrectvieActionByResponsibleUser(getAll: boolean = false, additionalParams?: string): Observable<CorrectiveActionResponsibleUser> {
    let params = '';
    if(!getAll)
      params = `?page=${IADashboardStore.currentPageCorrectiveActionResponsibleUser}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionResponsibleUser>('/dashboard/internal-audit-action-plans-count-by-responsible-person-and-risk-rating' +(params?params:'')).pipe((
      map((res:CorrectiveActionResponsibleUser)=>{
        IADashboardStore.setCorrectiveActionResponsibleUser(res)
        return res;
      })
    ))
  }

  getTop10Findingsss(): Observable<Top10Findings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<Top10Findings[]>('/dashboard/internal-audit-top-open-findings' +(params?params:'')).pipe((
      map((res:Top10Findings[])=>{
        IADashboardStore.setTop10Findings(res)
        return res;
      })
    ))
  }

  getTop10Findings(getAll: boolean=false, additionalParams): Observable<any> {
    let params: string = '';
    if(!getAll)
      params = `?page=${IADashboardStore.currentPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    // params = (params == '') ? params + '?page=2' : params + '&page=2';
    return this._http.get<any>('/dashboard/internal-audit-top-open-findings' +(params ? params : '')).pipe((
      map((res:any)=>{
        IADashboardStore.setFirstTop10(res);
        return res;
      })
    ))
  }

  getSecondTop10Findings(getAll: boolean=false, additionalParams): Observable<any> {
    let params: string = '';
    if(!getAll)
      params = `?page=${IADashboardStore.currentSecondPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    // params = (params == '') ? params + '?page=2' : params + '&page=2';
    return this._http.get<any>('/dashboard/internal-audit-top-open-findings' +(params ? params : '')).pipe((
      map((res:any)=>{
        IADashboardStore.setSecondTop10(res);
        return res;
      })
    ))
  }

  getCorrectiveActionOpenCloseCount(): Observable<CorrectiveActionOpenCloseCount> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionOpenCloseCount>('/dashboard/internal-audit-action-plans-count-by-open-closed-status' +(params?params:'')).pipe((
      map((res:CorrectiveActionOpenCloseCount)=>{
        IADashboardStore.setCorrectiveActionOpenCloseCount(res)
        return res;
      })
    ))
  }

  getOverdueActionPlan(getAll: boolean = false, additionalParams?: string): Observable<OverdueActionPlans> {
    let params = '';
    if(!getAll)
      params = `?page=${IADashboardStore.currentPageForOverdue}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OverdueActionPlans>('/dashboard/internal-audit-overdue-action-plans' +(params?params:'')).pipe((
      map((res:OverdueActionPlans)=>{
        IADashboardStore.setOverdueActionPlan(res)
        return res;
      })
    ))
  }
}
