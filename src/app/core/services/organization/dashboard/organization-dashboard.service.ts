import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganizationCount, OrganizationIssueCategories, OrganizationIssueDepartments, OrganizationIssueDomain, OrganizationIssuePestel, OrganizationIssueSwot, OrganizationIssueType, OrganizationIssueYear, OrganizationTopTenSwotIssues } from 'src/app/core/models/organization/dashboard/organization-dashboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationDashboardStore } from 'src/app/stores/organization/dashboard/organization-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class OrganizationDashboardService {

  constructor(
    private _http: HttpClient,

  ) { }

   /**
   * @description
   * This method is used for getting organization related counts.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */
  getOrganizationCount(): Observable<OrganizationCount> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationCount>('/dashboard/organization-counts' +(params ? params : '')).pipe(
      map((res: OrganizationCount) => {
        OrganizationDashboardStore.setOrganizationCount(res)
        return res;
      })
    );
  }

   /**
   * @description
   * This method is used for getting organization issue swots.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */
  getOrganizationIssueSwot(): Observable<OrganizationIssueSwot[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssueSwot[]>('/dashboard/organization-issue-count-by-swot' +(params ? params : '')).pipe((
      map((res:any[])=>{
        OrganizationDashboardStore.setOrganizationIssueSwot(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting organization issue categories.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */
  getOrganizationIssueCategories(): Observable<OrganizationIssueCategories[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssueCategories[]>('/dashboard/organization-issue-count-by-categories' +(params ? params : '')).pipe((
      map((res:any[])=>{
        OrganizationDashboardStore.setOrganizationIssueCategories(res);
        return res;
      })
    ))
  }


   /**
   * @description
   * This method is used for getting organization top ten swot issues.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */
    getOrganizationTopTenSwotIssues(getAll: boolean=false, additionalParams): Observable<OrganizationTopTenSwotIssues> {
      let params: string = '';
      if(!getAll)
        params = `?page=${OrganizationDashboardStore.currentPage}&limit=5`;
        if(additionalParams) params += additionalParams;     
      if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<OrganizationTopTenSwotIssues>('/dashboard/organization-top-ten-swot-issues' +(params ? params : '')).pipe((
        map((res:OrganizationTopTenSwotIssues)=>{
          OrganizationDashboardStore.setOrganizationTopTenSwotIssues(res);
          return res;
        })
      ))
    }

       /**
   * @description
   * This method is used for getting organization top ten swot issues.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */
        getOrganizationTopTenSecondSwotIssues(getAll: boolean=false, additionalParams): Observable<OrganizationTopTenSwotIssues> {
          let params: string = '';
          if(!getAll)
            params = `?page=${OrganizationDashboardStore.currentSecondPage}&limit=5`;
            if(additionalParams) params += additionalParams;
          if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
           params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
          return this._http.get<OrganizationTopTenSwotIssues>('/dashboard/organization-top-ten-swot-issues' +(params ? params : '')).pipe((
            map((res:OrganizationTopTenSwotIssues)=>{
              OrganizationDashboardStore.setOrganizationTopTenSwotIssues(res);
              return res;
            })
          ))
        }


   /**
   * @description
   * This method is used for getting organization issue pestels.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */  
  getOrganizationIssuePestel(): Observable<OrganizationIssuePestel[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssuePestel[]>('/dashboard/organization-issue-count-by-pestel' +(params ? params : '')).pipe((
      map((res:OrganizationIssuePestel[])=>{
        OrganizationDashboardStore.setOrganizationIssuePestel(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting organization issue departments.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */
  getOrganizationIssueDepartments(): Observable<OrganizationIssueDepartments[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssueDepartments[]>('/dashboard/organization-issue-count-by-departments' +(params ? params : '')).pipe((
      map((res:OrganizationIssueDepartments[])=>{
        OrganizationDashboardStore.setOrganizationIssueDepartments(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting organization issue types.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */  
  getOrganizationIssueType(): Observable<OrganizationIssueType[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssueType[]>('/dashboard/organization-issue-count-by-types' +(params ? params : '')).pipe((
      map((res:OrganizationIssueType[])=>{
        OrganizationDashboardStore.setOrganizationIssueType(res);
        return res;
      })
    ))
  }

   /**
   * @description
   * This method is used for getting organization issue years.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */  
  getOrganizationIssueYear(): Observable<OrganizationIssueYear[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssueYear[]>('/dashboard/organization-issue-count-by-year' +(params ? params : '')).pipe((
      map((res:OrganizationIssueYear[])=>{
        OrganizationDashboardStore.setOrganizationIssueYear(res);
        return res;
      })
    ))
  }

 
   /**
   * @description
   * This method is used for getting organization issue domains.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof OrganizationDashboardService
   */  
  getOrganizationIssueDomain(): Observable<OrganizationIssueDomain[]> {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'org_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<OrganizationIssueDomain[]>('/dashboard/organization-issue-count-by-domains' +(params ? params : '')).pipe((
      map((res:OrganizationIssueDomain[])=>{
        OrganizationDashboardStore.setOrganizationIssueDomains(res);
        return res;
      })
    ))
  }
}
