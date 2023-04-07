import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AMAuditDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/am-audit-dashboard.store';
import { AmAnnualPlanCountByAuditors, AmAnnualPlanCountByDepartments, AmAnnualPlanCountByYears, AmAuditCorrectiveActionCountByStatuses, AMAuditCount, AmAuditFindingCountByDepartments, AmAuditFindingCountByStatuses, AmAuditProgramCountByCategory, AuditStatuses, FindingCount } from 'src/app/core/models/audit-management/am-audit-dashboard/am-audit-dashboard';
import { AuditFindingDashboardStore } from 'src/app/stores/audit-management/am-audit-dashboard/audit-finding-dashboard.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';
import { AmAnnualAuditPlanPaginationResponse } from 'src/app/core/models/audit-management/am-audit-plan/am-annual-audit-plan';

@Injectable({
  providedIn: 'root'
})
export class AmAuditDashboardService {

  constructor(
    private _http: HttpClient
  ) { }

  getAuditCount() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AMAuditCount>('/dashboard/audit-counts'+ (params ? params : '')).pipe(
      map((res: AMAuditCount) => {
        AMAuditDashboardStore.setAuditCount(res)
        return res
      })
    )
  }

  getCorrectiveActionCountByStatuses() {
    return this._http.get<AmAuditCorrectiveActionCountByStatuses[]>('/dashboard/am-audit-corrective-action-count-by-statuses').pipe(
      map((res: AmAuditCorrectiveActionCountByStatuses[]) => {
        AMAuditDashboardStore.setCorrectiveActionCountByStatuses(res)
        return res
      })
    )
  }

  getProgramCountByCategories() {
    return this._http.get('/dashboard/am-audit-program-count-by-categories').pipe(
      map((res: AmAuditProgramCountByCategory[]) => {
        AMAuditDashboardStore.setProgramCountByCategory(res)
        return res
      })
    )
  }

  getFindingCountByDepartments() {
    return this._http.get<AmAuditFindingCountByDepartments[]>('/dashboard/am-audit-finding-count-by-departments').pipe(
      map((res: AmAuditFindingCountByDepartments[]) => {
        AMAuditDashboardStore.setFindingCountByDepartments(res)
        return res
      })
    )
  }

  getFindingCountByStatuses() {
    return this._http.get<AmAuditFindingCountByStatuses[]>('/dashboard/am-audit-finding-count-by-statuses').pipe(
      map((res: AmAuditFindingCountByStatuses[]) => {
        AMAuditDashboardStore.setFindingCountByStatuses(res)
        return res
      })
    )
  }

  getAnnualPlanCountByAuditors() {
    return this._http.get<AmAnnualPlanCountByAuditors[]>('/dashboard/am-annual-plan-count-by-auditors').pipe(
      map((res: AmAnnualPlanCountByAuditors[]) => {
        AMAuditDashboardStore.setPlanCountByAuditors(res)
        return res
      })
    )
  }

  getAnnualPlanCountByDepartments() {
    return this._http.get<AmAnnualPlanCountByDepartments[]>('/dashboard/am-annual-plan-count-by-departments').pipe(
      map((res: AmAnnualPlanCountByDepartments[]) => {
        AMAuditDashboardStore.setPlanCountByDepartments(res)
        return res
      })
    )
  }

  getAnnualPlanCountByYears() {
    return this._http.get<AmAnnualPlanCountByYears[]>('/dashboard/am-annual-plan-count-by-years').pipe(
      map((res: AmAnnualPlanCountByYears[]) => {
        AMAuditDashboardStore.setPlanCountByYears(res)
        return res
      })
    )
  }

  getAuditStatuses() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditStatuses[]>('/dashboard/am-audit-statuses'+ (params ? params : '')).pipe(
      map((res: AuditStatuses[]) => {
        AMAuditDashboardStore.setAuditStatuses(res)
        return res
      })
    )
  }

  getAuditPlan() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/dashboard/am-audit-plan-vs-am-audits'+ (params ? params : '')).pipe(
      map((res) => {
        AMAuditDashboardStore.setAuditPlan(res)
        return res
      })
    )
  }

  getFindingRiskRating() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditStatuses[]>('/dashboard/finding-by-risk-ratings' + (params ? params : '')).pipe(
      map((res: AuditStatuses[]) => {
        AMAuditDashboardStore.setFindingRiskRating(res)
        return res
      })
    )
  }

  getCorrectiveAction() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/dashboard/corrective-actions' + (params ? params : '')).pipe(
      map((res) => {
        AMAuditDashboardStore.setCorrectiveAction(res)
        return res
      })
    )
  }

  getAuditDepartment() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AuditStatuses[]>('/dashboard/audit-by-departments' + (params ? params : '')).pipe(
      map((res: AuditStatuses[]) => {
        AMAuditDashboardStore.setAuditDepartment(res)
        return res
      })
    )
  }

  getImpactAnalysis() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/dashboard/impact-analysis' + (params ? params : '')).pipe(
      map((res) => {
        AMAuditDashboardStore.setImpactAnalysis(res)
        return res
      })
    )
  }

  //Findings dashboard starts here

  getFindingsCount() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<FindingCount>('/dashboard/finding-counts' + (params ? params : '')).pipe(
      map((res: FindingCount) => {
        AuditFindingDashboardStore.setFindingsCount(res)
        return res
      })
    )
  }

  getFindingStatuses() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmAuditFindingCountByStatuses[]>('/dashboard/finding-by-statuses' + (params ? params : '')).pipe(
      map((res: AmAuditFindingCountByStatuses[]) => {
        AuditFindingDashboardStore.setFindingCountByStatuses(res)
        return res
      })
    )
  }

  getFindingYears() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmAuditFindingCountByDepartments[]>('/dashboard/finding-by-years' + (params ? params : '')).pipe(
      map((res: AmAuditFindingCountByDepartments[]) => {
        AuditFindingDashboardStore.setFindingCountByYears(res)
        return res
      })
    )
  }

  getActionPlan() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_audit_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/dashboard/action-plans' + (params ? params : '')).pipe(
      map((res) => {
        AuditFindingDashboardStore.setCorrectiveAction(res)
        return res
      })
    )
  }

  getFindingDepartment() {
    return this._http.get<AmAuditFindingCountByDepartments[]>('/dashboard/finding-count-by-departments?by_rating=true').pipe(
      map((res: AmAuditFindingCountByDepartments[]) => {
        AuditFindingDashboardStore.setFindingCountByDepartments(res)
        return res
      })
    )
  }

  getFindingDepartmentStatus() {
    return this._http.get<AmAuditFindingCountByDepartments[]>('/dashboard/finding-count-by-departments?by_status=true').pipe(
      map((res: AmAuditFindingCountByDepartments[]) => {
        AuditFindingDashboardStore.setFindingCountByDepartments(res)
        return res
      })
    )
  }

  getTopFinding() {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'am_top_findings_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/dashboard/top-findings' + (params ? params : '')).pipe(
      map((res) => {
        AuditFindingDashboardStore.setTopFindings(res)
        return res
      })
    )
  }

  getIndividualAuditPlan(getAll: boolean = false, additionalParams?: string){
    let params = '';
    if (!getAll) {
      params = `?page=${AmAnnualAuditPlansStore.currentPage}`;
      if (AmAnnualAuditPlansStore.orderBy) params += `&order=${AmAnnualAuditPlansStore.orderBy}`;
      if (AmAnnualAuditPlansStore.orderItem) params += `&order_by=${AmAnnualAuditPlansStore.orderItem}`;
      if (AmAnnualAuditPlansStore.searchText) params += `&q=${AmAnnualAuditPlansStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_anual_audit_plan_details' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmAnnualAuditPlanPaginationResponse>('/am-individual-audit-plans' + (params ? params : '')).pipe(
        map((res: AmAnnualAuditPlanPaginationResponse) => {
          AmAnnualAuditPlansStore.setAnnualAuditPlanDetails(res);
          return res;
        })
      );
    return this._http.get<any>('/am-individual-audit-plans')
  }

  //Finding dashboard ends here
}
