import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CorrectiveActionOpenCloseCount, DepartmentFindings, CorrectiveActionDepartment, CorrectiveActionResponsibleUser, AuditMsTypeCount, AuditTypeCount, OverdueActionPlans, StatusWiseAnalysisFindings, Top10Findings, FindingDepartmentPage } from 'src/app/core/models/external-audit/dashboard/dashboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ExternalAuditDashboardStore } from 'src/app/stores/external-audit/dashboard/dasboard-store';
import { EADepartmentRiskStore } from 'src/app/stores/external-audit/dashboard/department-risk-rating-store';

@Injectable({
  providedIn: 'root'
})
export class ExternalAuditDashboardService {

  constructor(
    private _http: HttpClient,
  ) { }

  getStatusWiseAnalysisFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/external-audit-findings-count-by-status' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        ExternalAuditDashboardStore.setStatusWiseAnalysisFindings(res);
        return res;
      })
    ))
  }

  getAuditByTypesCount(): Observable<AuditTypeCount[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditTypeCount[]>('/dashboard/external-audit-count-by-type' +(params?params:'')).pipe((
      map((res:AuditTypeCount[])=>{
        console.log(res,'resp')
        ExternalAuditDashboardStore.setAuditByTypes(res);
        console.log(ExternalAuditDashboardStore.AuditByTypeCount,'d');
        return res;
      })
    ))
  }

  getRiskRatingFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/external-audit-findings-count-by-risk-rating' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        ExternalAuditDashboardStore.setRiskRatingFindings(res)
        return res;
      })
    ))
  }

  getCategoryFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/external-audit-findings-count-by-category' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        ExternalAuditDashboardStore.setCategoryFindings(res)
        return res;
      })
    ))
  }

  getMsTypes(): Observable<AuditMsTypeCount[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditMsTypeCount[]>('/dashboard/external-audit-count-by-ms-type' +(params?params:'')).pipe((
      map((res:AuditMsTypeCount[])=>{
        ExternalAuditDashboardStore.setAuditMsTypes(res)
        return res;
      })
    ))
  }

  getDivisionFindings(): Observable<StatusWiseAnalysisFindings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StatusWiseAnalysisFindings[]>('/dashboard/external-audit-findings-count-by-division' +(params?params:'')).pipe((
      map((res:StatusWiseAnalysisFindings[])=>{
        ExternalAuditDashboardStore.setDivisionFindings(res)
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
    return this._http.get<DepartmentFindings[]>('/dashboard/external-audit-findings-count-by-department-and-risk-rating' +(params?params:'')).pipe((
      map((res:DepartmentFindings[])=>{
        ExternalAuditDashboardStore.setDepartmentFindings(res)
        return res;
      })
    ))
  }

  getDepartmentFindingsPage(getAll: boolean, additionalParams?: string, is_all?: boolean): Observable<FindingDepartmentPage> {
    let params = '';
    if(!getAll)
      params = `?page=${EADepartmentRiskStore.currentPageDepartmentFindingsPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingDepartmentPage>('/dashboard/external-audit-findings-count-by-department-and-risk-rating' +(params?params:'')).pipe((
      map((res:FindingDepartmentPage)=>{
        EADepartmentRiskStore.setDepartmentFindingsPage(res)
        return res;
      })
    ))
  }

  getCorrectvieActionByDepartment(getAll: boolean = false, additionalParams?: string): Observable<CorrectiveActionDepartment> {
    let params = '';
    if(!getAll)
      params = `?page=${ExternalAuditDashboardStore.currentPageCorrectiveActionDepartment}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionDepartment>('/dashboard/external-audit-findings-count-by-department-and-risk-rating' +(params?params:'')).pipe((
      map((res:CorrectiveActionDepartment)=>{
        ExternalAuditDashboardStore.setCorrectiveActionDepartment(res)
        return res;
      })
    ))
  }

  getCorrectvieActionByResponsibleUser(getAll: boolean = false, additionalParams?: string): Observable<CorrectiveActionResponsibleUser> {
    let params = '';
    if(!getAll)
      params = `?page=${ExternalAuditDashboardStore.currentPageCorrectiveActionResponsibleUser}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionResponsibleUser>('/dashboard/external-audit-action-plans-count-by-responsible-person-and-risk-rating' +(params?params:'')).pipe((
      map((res:CorrectiveActionResponsibleUser)=>{
        ExternalAuditDashboardStore.setCorrectiveActionResponsibleUser(res)
        return res;
      })
    ))
  }

  getTop10Findingsss(): Observable<Top10Findings[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<Top10Findings[]>('/dashboard/external-audit-top-open-findings' +(params?params:'')).pipe((
      map((res:Top10Findings[])=>{
        ExternalAuditDashboardStore.setTop10Findings(res)
        return res;
      })
    ))
  }

  getTop10Findings(getAll: boolean=false, additionalParams): Observable<any> {
    let params: string = '';
    if(!getAll)
      params = `?page=${ExternalAuditDashboardStore.currentPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    // params = (params == '') ? params + '?page=2' : params + '&page=2';
    return this._http.get<any>('/dashboard/external-audit-top-open-findings' +(params ? params : '')).pipe((
      map((res:any)=>{
        ExternalAuditDashboardStore.setFirstTop10(res);
        return res;
      })
    ))
  }

  getSecondTop10Findings(getAll: boolean=false, additionalParams): Observable<any> {
    let params: string = '';
    if(!getAll)
      params = `?page=${ExternalAuditDashboardStore.currentSecondPage}&limit=5`;
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'bpm_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    // params = (params == '') ? params + '?page=2' : params + '&page=2';
    return this._http.get<any>('/dashboard/external-audit-top-open-findings' +(params ? params : '')).pipe((
      map((res:any)=>{
        ExternalAuditDashboardStore.setSecondTop10(res);
        return res;
      })
    ))
  }

  getCorrectiveActionOpenCloseCount(): Observable<CorrectiveActionOpenCloseCount> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionOpenCloseCount>('/dashboard/external-audit-action-plans-count-by-open-closed-status' +(params?params:'')).pipe((
      map((res:CorrectiveActionOpenCloseCount)=>{
        ExternalAuditDashboardStore.setCorrectiveActionOpenCloseCount(res)
        return res;
      })
    ))
  }

  getOverdueActionPlan(getAll: boolean = false, additionalParams?: string): Observable<OverdueActionPlans> {
    let params = '';
    if(!getAll)
      params = `?page=${ExternalAuditDashboardStore.currentPageForOverdue}&limit=5`;
    if(additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OverdueActionPlans>('/dashboard/external-audit-overdue-action-plans' +(params?params:'')).pipe((
      map((res:OverdueActionPlans)=>{
        ExternalAuditDashboardStore.setOverdueActionPlan(res)
        return res;
      })
    ))
  }
}
