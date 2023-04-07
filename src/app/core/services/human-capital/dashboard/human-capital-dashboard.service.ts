import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HumanCapitalDashboardStore } from 'src/app/stores/human-capital/dashboard/dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class HumanCapitalDashboardService {

  constructor(
    private http:HttpClient
  ) { }

getTotalCounts(){
  let params = '';
  if(RightSidebarLayoutStore.filterPageTag == 'hc_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
  return this.http.get('/dashboard/human-capital-counts'+ (params ? params : '')).pipe(
    map((res)=>{
      HumanCapitalDashboardStore.setToalCount(res)
      return res
    })
  )
}

getUserCountByDepartment(){
  let params = '';
  if(RightSidebarLayoutStore.filterPageTag == 'hc_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
  return this.http.get('/dashboard/user-count-by-departments'+ (params ? params : '')).pipe(
    map((res)=>{
      HumanCapitalDashboardStore.setCountByDepartment(res)
      return res
    })
  )
}

getUserCountByRole(){
  let params = '';
  if(RightSidebarLayoutStore.filterPageTag == 'hc_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
  return this.http.get('/dashboard/user-count-by-roles'+ (params ? params : '')).pipe(
    map((res)=>{
      HumanCapitalDashboardStore.setCountByRole(res)
      return res
    })
  )
}

getUserCountByDesignation(){
  let params = '';
  if(RightSidebarLayoutStore.filterPageTag == 'hc_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
  params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
  return this.http.get('/dashboard/user-count-by-designations'+ (params ? params : '')).pipe(
    map((res)=>{
      HumanCapitalDashboardStore.setCountByDesignation(res)
      return res
    })
  )
}

}
