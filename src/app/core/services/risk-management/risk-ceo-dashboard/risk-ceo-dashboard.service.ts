import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CeoDivisions, CeoRiskCount, CeoRiskCountByCategories, CeoRiskDetailsByDepartment, CeoRiskCountByDivisions, CeoRiskCountByOwners, CeoRiskCountBySection, CeoRiskCountBySource, CeoRiskCountByStatus, CeoRiskHeatMap, CeoRiskList, CeoSecondRiskList, RiskHeatMap, CeoCountByDepartment } from 'src/app/core/models/risk-management/risk-ceo-dashboard/risk-ceo-dashboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { CeoRiskDashboardStore } from 'src/app/stores/risk-management/risk-ceo-dashboard-store.ts/risk-ceo dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class RiskCeoDashboardService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getDivisions(): Observable<CeoDivisions[]> {
    let params = '?is_functional=1' 
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params =  '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoDivisions[]>('/ceo-dashboard/divisions').pipe((
      map((res:CeoDivisions[])=>{
        CeoRiskDashboardStore.setCeoDivisions(res);
        return res;
      })
    ))
  }
  getRisk(addParam:string=""): Observable<CeoRiskList[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
      if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskList[]>('/ceo-dashboard/risk' +(params?params:'')).pipe((
      map((res:CeoRiskList[])=>{
        if(res["data"]){
          CeoRiskDashboardStore.setRiskDetails(res["data"]);
        }else{
          CeoRiskDashboardStore.setRiskDetails(res);
        }
        
        return res;
      })
    ))
  }

  getSecondTopRisk(addParam:string=""): Observable<CeoSecondRiskList[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
    // if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    // params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoSecondRiskList[]>('/ceo-dashboard/risk' +(params?params:'')).pipe((
      map((res:CeoSecondRiskList[])=>{
        if(res["data"]){
          CeoRiskDashboardStore.setSecondRiskDetails(res["data"]);
        }else{
          CeoRiskDashboardStore.setSecondRiskDetails(res);
        }
        return res;
      })
    ))
  }

  getRiskCount(addParam:string=""): Observable<CeoRiskCount> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
      if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskCount>('/ceo-dashboard/risk-count' +(params?params:'')).pipe((
      map((res:CeoRiskCount)=>{
        CeoRiskDashboardStore.setRiskCountDetails(res);
        return res;
      })
    ))
  }

  getRiskCountBySources(): Observable<CeoRiskCountBySource[]> {
    let params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<CeoRiskCountBySource[]>('/ceo-dashboard/risk-count-by-sources' +(params?params:'')).pipe((
      map((res:CeoRiskCountBySource[])=>{
        CeoRiskDashboardStore.setRiskCountBySources(res);
        return res;
      })
    ))
  }

  getRiskCountByDivisions(): Observable<CeoRiskCountByDivisions[]> {
    let params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<CeoRiskCountByDivisions[]>('/ceo-dashboard/risk-count-by-divisions' +(params?params:'')).pipe((
      map((res:CeoRiskCountByDivisions[])=>{
        CeoRiskDashboardStore.setRiskCountByDivisions(res);
        return res;
      })
    ))
  }

  getRiskCountBySections(): Observable<CeoRiskCountBySection[]> {
    let params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<CeoRiskCountBySection[]>('/ceo-dashboard/risk-count-by-sections' +(params?params:'')).pipe((
      map((res:CeoRiskCountBySection[])=>{
        CeoRiskDashboardStore.setRiskCountBySections(res);
        return res;
      })
    ))
  }

  getRiskCountByDepartments(addParam:string=""): Observable<CeoCountByDepartment[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
      if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoCountByDepartment[]>('/ceo-dashboard/risk-count-by-departments' +(params?params:'')).pipe((
      map((res:CeoCountByDepartment[])=>{
        CeoRiskDashboardStore.setRiskCountByDepartments(res);
        return res;
      })
    ))
  }

  getRiskDetailsByDepartments(addParam:string=""): Observable<CeoRiskDetailsByDepartment[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskDetailsByDepartment[]>('/ceo-dashboard/risk-details-by-departments' +(params?params:'')).pipe((
      map((res:CeoRiskDetailsByDepartment[])=>{
        CeoRiskDashboardStore.setRiskDetailsByDepartments(res);
        return res;
      })
    ))
  }

  getRiskCountByStatuses(addParam:string=""): Observable<CeoRiskCountByStatus[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskCountByStatus[]>('/ceo-dashboard/risk-count-by-statuses' +(params?params:'')).pipe((
      map((res:CeoRiskCountByStatus[])=>{
        CeoRiskDashboardStore.setRiskCountByStatuses(res);
        return res;
      })
    ))
  }

  getRiskCountByCategories(addParam:string=""): Observable<CeoRiskCountByCategories[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskCountByCategories[]>('/ceo-dashboard/risk-count-by-categories' +(params?params:'')).pipe((
      map((res:CeoRiskCountByCategories[])=>{
        CeoRiskDashboardStore.setRiskCountByCategories(res);
        return res;
      })
    ))
  }

  getRiskCountByOwners(addParam:string=""): Observable<CeoRiskCountByOwners[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskCountByOwners[]>('/ceo-dashboard/risk-count-by-owners' +(params?params:'')).pipe((
      map((res:CeoRiskCountByOwners[])=>{
        CeoRiskDashboardStore.setRiskCountByOwners(res);
        return res;
      })
    ))
  }

  getRiskHeatMap(): Observable<CeoRiskHeatMap[]> {
    let params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<CeoRiskHeatMap[]>('/ceo-dashboard/risk-heat-map' +(params?params:'')).pipe((
      map((res:CeoRiskHeatMap[])=>{
        CeoRiskDashboardStore.setRiskHeatMapDetails(res);
        return res;
      })
    ))
  }

  getRiskHeatMapByStatus(addParam:string=""): Observable<RiskHeatMap[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<RiskHeatMap[]>('/ceo-dashboard/risk-heat-map/by-statuses' +(params?params:'')).pipe((
      map((res:RiskHeatMap[])=>{
        CeoRiskDashboardStore.unsetHeatMapByCategoryDetails()
        CeoRiskDashboardStore.setHeatMapByCategoryDetails(res);
        CeoRiskDashboardStore.categoryLoaded=false;
        CeoRiskDashboardStore.sourceLoaded=false;
        CeoRiskDashboardStore.statusLoaded=true;
        return res;
      })
    ))
  }

  getRiskHeatMapBySources(addParam:string=""): Observable<RiskHeatMap[]> {
    let params=addParam?addParam+'&is_functional=1':'?is_functional=1'
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<RiskHeatMap[]>('/ceo-dashboard/risk-heat-map/by-risk-sources' +(params?params:'')).pipe((
      map((res:RiskHeatMap[])=>{
        CeoRiskDashboardStore.unsetHeatMapByCategoryDetails()
        CeoRiskDashboardStore.setHeatMapByCategoryDetails(res);
        CeoRiskDashboardStore.statusLoaded=false;
        CeoRiskDashboardStore.categoryLoaded=false;
        CeoRiskDashboardStore.sourceLoaded=true;
        return res;
      })
    ))
  }

  getRiskHeatMapByCategories(addParam:string=""): Observable<RiskHeatMap[]> {
    let params=addParam?addParam+'&is_functional=1':'?is_functional=1'
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<RiskHeatMap[]>('/ceo-dashboard/risk-heat-map/by-categories' +(params?params:'')).pipe((
      map((res:RiskHeatMap[])=>{
        CeoRiskDashboardStore.unsetHeatMapByCategoryDetails()
        CeoRiskDashboardStore.setHeatMapByCategoryDetails(res);
        CeoRiskDashboardStore.statusLoaded=false;
        CeoRiskDashboardStore.sourceLoaded=false;
        CeoRiskDashboardStore.categoryLoaded=true;
        return res;
      })
    ))
  }

  getRiskCountByInherentRiskRatings(addParam:string=""): Observable<any[]> {
    let params = addParam?addParam+'&is_functional=1':'?is_functional=1';
      if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = addParam?addParam+'&' + RightSidebarLayoutStore.filtersAsQueryString : '?' + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http.get<any[]>('/ceo-dashboard/risk-count-by-inherent-risk-ratings' +(params?params:'')).pipe((
      map((res:any[])=>{
        CeoRiskDashboardStore.setRiskCountByInherentRiskRatings(res);
        return res;
      })
    ))
  }

  getRiskCountByResidualRiskRatings(): Observable<any[]> {
    let params = '?is_functional=1';
    if(RightSidebarLayoutStore.filterPageTag == 'risk_ceo_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = '?' + RightSidebarLayoutStore.filtersAsQueryString
    return this._http.get<any[]>('/ceo-dashboard/risk-count-by-residual-risk-ratings' +(params?params:'')).pipe((
      map((res:any[])=>{
        CeoRiskDashboardStore.setRiskCountByResidualRiskRatings(res);
        return res;
      })
    ))
  }
}
