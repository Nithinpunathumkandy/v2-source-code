import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { EventDashboardStore } from 'src/app/stores/event-monitoring/dashboard/dashboard-store';
import { EventStatuses , TaskCount , MilestoneMonth , EventBudgetByYears} from 'src/app/core/models/event-monitoring/event-dashboard/event-dashboard'
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class EventDashboardService {

  constructor(
    private _http: HttpClient
  ) { }

  getEventByStatuses() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventStatuses[]>("/events/dashboard/event-by-statuses" +(params ? params : '')).pipe(map((res:EventStatuses[]) => {      
      EventDashboardStore.setEventByStatuses(res)
      return res
    }))
  }

  getEventByOverdue() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventStatuses[]>("/events/dashboard/overdue-events" +(params ? params : '')).pipe(map((res:EventStatuses[]) => {      
      EventDashboardStore.setEventByStatuses(res)
      return res
    }))
  }

  getEventByDepartments() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventStatuses[]>("/events/dashboard/event-by-departments" +(params ? params : '')).pipe(map((res:EventStatuses[]) => {      
      EventDashboardStore.setEventByDepartments(res)
      return res      
    }))
  }

  getEventByTypes() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>("/events/dashboard/event-by-types" +(params ? params : '')).pipe(map((res) => {      
      EventDashboardStore.setEventByTypes(res)
      return res
    }))
  }

  getEventByYears() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>("/events/dashboard/event-by-years" +(params ? params : '')).pipe(map((res) => {    
      EventDashboardStore.setEventByYears(res)
      return res
    }))
  }

  getEventBudgetByDepartments() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>("/events/dashboard/event-budget-by-departments" +(params ? params : '')).pipe(map((res) => {      
      EventDashboardStore.setEventBudgetByDepartments(res)
      return res
    }))
  }

  getEventBudgetByYears() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventBudgetByYears[]>("/events/dashboard/event-budget-by-years" +(params ? params : '')).pipe(map((res:EventBudgetByYears[]) => {      
      EventDashboardStore.setEventBudgetByYears(res)
      return res
    }))
  }

  getEventTaskByStatuses() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventStatuses[]>("/events/dashboard/event-task-by-statuses" +(params ? params : '')).pipe(map((res:EventStatuses[]) => {      
      EventDashboardStore.setTaskByStatuses(res)
      return res
    }))
  }

  getTaskCounts() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TaskCount>("/events/dashboard/task-counts" +(params ? params : '')).pipe(map((res:TaskCount) => {      
      EventDashboardStore.setTaskCount(res)
      return res
    }))
  }

  getEventCRByStatuses() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_change_request_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventStatuses[]>("/events/dashboard/event-change-request-by-statuses" +(params ? params : '')).pipe(map((res) => {      
      EventDashboardStore.setEventCRByStatuses(res)
      return res
    }))
  }

  getEventCRByDepartments() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_change_request_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>("/events/dashboard/event-change-request-by-departments" +(params ? params : '')).pipe(map((res) => {      
      EventDashboardStore.setEventCRByDepartments(res)
      return res
    }))
  }

  getEventClosureByStatuses() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_closure_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<EventStatuses[]>("/events/dashboard/event-closure-by-statuses" +(params ? params : '')).pipe(map((res:EventStatuses[]) => {
      EventDashboardStore.setEventClosureByStatuses(res)      
      return res
    }))
  }

  getEventClosureByDepartments() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_closure_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>("/events/dashboard/event-closure-by-departments" +(params ? params : '')).pipe(map((res) => {      
      EventDashboardStore.setEventClosureByDepartments(res)
      return res
    }))
  }

  getEventStakeholder() {
    return this._http.get<any>("/events/dashboard/event-stakeholder-matrix").pipe(map((res) => {      
      return res
    }))
  }

  getMilestoneByMonth() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MilestoneMonth[]>("/events/dashboard/milestone-by-months" +(params ? params : '')).pipe(map((res:MilestoneMonth[]) => {     
    EventDashboardStore.setMilestoneByMonths(res) 
      return res
    }))
  }

  getMilestoneByDepartments() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MilestoneMonth[]>("/events/dashboard/milestone-by-departments" +(params ? params : '')).pipe(map((res:MilestoneMonth[]) => {     
    EventDashboardStore.setMilestoneByDepartments(res) 
      return res
    }))
  }

  getEventCount() {
    let params: string = '';
    if (RightSidebarLayoutStore.filterPageTag == 'event_main_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TaskCount>("/events/dashboard/event-counts" +(params ? params : '')).pipe(map((res:TaskCount) => {     
      EventDashboardStore.setEventCount(res) 
      return res
    }))
  }

}