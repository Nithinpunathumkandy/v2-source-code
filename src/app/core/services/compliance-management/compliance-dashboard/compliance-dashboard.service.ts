import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceByProducts, ComplianceChartDetails, ComplianceCount, ComplianceRequirementType, ComplianceStatusCountByStatus, LevelOfCompliance, SlaByProducts, SlaContractByCategory, SlaContractChartDetails, SlaContractDocumentStatus } from 'src/app/core/models/compliance-management/compliance-dashboard/compliance-dashboard';
import { ComplianceDashboardStore } from 'src/app/stores/compliance-management/compliance-dashboard/compliance-dashboard-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class ComplianceDashboardService {

  constructor(private _http:HttpClient,
              ) { }

  getComplianceCount(): Observable<ComplianceCount> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ComplianceCount>('/dashboard/compliance-counts'+ (params ? params : '') ).pipe((
      map((res:ComplianceCount)=>{
        ComplianceDashboardStore.setComplianceCountDetails(res);
        return res;
      })
    ))
  }
  getComplianceStatusPieGraph(): Observable<ComplianceStatusCountByStatus[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ComplianceStatusCountByStatus[]>('/dashboard/compliance-statuses'+ (params ? params : '')).pipe((
      map((res:ComplianceStatusCountByStatus[])=>{
        ComplianceDashboardStore.setComplianceStatusCountByStatus(res);
        return res;
      })
    ))
  }
  getSlaContractByCategory(): Observable<SlaContractByCategory[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<SlaContractByCategory[]>('/dashboard/sla-by-categories'+ (params ? params : '')).pipe((
      map((res:SlaContractByCategory[])=>{
        ComplianceDashboardStore.setSlaContractByCategory(res);
        return res;
      })
    ))
  }
  getSlaContractDocumentStatus(): Observable<SlaContractDocumentStatus[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<SlaContractDocumentStatus[]>('/dashboard/sla-statuses'+ (params ? params : '')).pipe((
      map((res:SlaContractDocumentStatus[])=>{
        ComplianceDashboardStore.setSlaContractDocumentStatus(res);
        return res;
      })
    ))
  }
  getComplianceRequirementType(): Observable<ComplianceRequirementType[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ComplianceRequirementType[]>('/dashboard/compliance-requirement-types'+ (params ? params : '')).pipe((
      map((res:ComplianceRequirementType[])=>{
        ComplianceDashboardStore.setComplianceRequirementType(res);
        return res;
      })
    ))
  }
  getComplianceForCompliance(): Observable<ComplianceChartDetails[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ComplianceChartDetails[]>('/dashboard/compliance-per-departments'+ (params ? params : '')).pipe((
      map((res:ComplianceChartDetails[])=>{
        ComplianceDashboardStore.setComplianceChartDetails(res);
        return res;
      })
    ))
  }
  getSlaForContract(): Observable<SlaContractChartDetails[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<SlaContractChartDetails[]>('/dashboard/sla-per-departments'+ (params ? params : '')).pipe((
      map((res:SlaContractChartDetails[])=>{
        ComplianceDashboardStore.setSlaContractChartDetails(res);
        return res;
      })
    ))
  }
  getLevelOfCompliance(): Observable<LevelOfCompliance[]> {
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<LevelOfCompliance[]>('/dashboard/level-of-compliance'+ (params ? params : '')).pipe((
      map((res:LevelOfCompliance[])=>{
        ComplianceDashboardStore.setLevelOfCompliance(res);
        return res;
      })
    ))
  }

  getSlaByProducts(){
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<SlaByProducts[]>('/dashboard/sla-per-product'+ (params ? params : '')).pipe((
      map((res:SlaByProducts[])=>{
        ComplianceDashboardStore.setSlaByProducts(res);
        return res;
      })
    ))
  }

  getComplianceByProducts(){
    let params = '';
    if(RightSidebarLayoutStore.filterPageTag == 'compliance_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ComplianceByProducts[]>('/dashboard/compliance-per-product'+ (params ? params : '')).pipe((
      map((res:ComplianceByProducts[])=>{
        ComplianceDashboardStore.setCompliaceByProducts(res);
        return res;
      })
    ))
  }
}
