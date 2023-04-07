import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Training, TrainingAttendies, TrainingBarCompetency, TrainingBarCompetencyGroup, TrainingBarDepartment, TrainingBarYears, TrainingCount, TrainingPaginationResponse, TrainingPieStatus } from 'src/app/core/models/training/training-dashboard/training-dashboard';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { TrainingDashboardStore } from 'src/app/stores/training/training-dashboard/training-dashboard-store';

@Injectable({
  providedIn: 'root'
})
export class TrainingDashboardService {

  constructor(
    private _http: HttpClient,
  ) { }

  getTraining(getAll: boolean=false, additionalParams): Observable<TrainingPaginationResponse> {
    let params='?page=1'
    // if (!getAll) {
    //   params = `?page=${TrainingDashboardStore.currentPage}`;
    //   // if (TrainingDashboardStore.orderBy) params += `&order=${TrainingsStore.orderBy}`;
    //   // if (TrainingsStore.orderItem) params += `&order_by=${TrainingsStore.orderItem}`;
    // }
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    return this._http.get<TrainingPaginationResponse>('/dashboard/trainings' +(params ? params : '')).pipe((
      map((res:TrainingPaginationResponse)=>{
        TrainingDashboardStore.setTraining(res);
        return res;
      })
    ))
  }

  getSecondTraining(getAll: boolean=false, additionalParams): Observable<TrainingPaginationResponse> {
    let params='?page=2'
    // if (!getAll) {
    //   params = `?page=${TrainingDashboardStore.currentPage}`;
    //   // if (TrainingDashboardStore.orderBy) params += `&order=${TrainingsStore.orderBy}`;
    //   // if (TrainingsStore.orderItem) params += `&order_by=${TrainingsStore.orderItem}`;
    // }
    if(additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5') : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString + '&limit=5');
    return this._http.get<TrainingPaginationResponse>('/dashboard/trainings' +(params ? params : '')).pipe((
      map((res:TrainingPaginationResponse)=>{
        TrainingDashboardStore.setSecondTraining(res);
        return res;
      })
    ))
  }

  getTrainingCount(): Observable<TrainingCount> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingCount>('/dashboard/training-count').pipe((
      map((res:TrainingCount)=>{
        TrainingDashboardStore.setTrainingCount(res);
        return res;
      })
    ))
  }

  getTrainingAttendies(): Observable<TrainingAttendies> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingAttendies>('/dashboard/training-attendees').pipe((
      map((res:TrainingAttendies)=>{
        TrainingDashboardStore.setTrainingAttendies(res);
        return res;
      })
    ))
  }

  getTrainingPieStatus(): Observable<TrainingPieStatus[]> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingPieStatus[]>('/dashboard/training-count-by-statuses').pipe((
      map((res:TrainingPieStatus[])=>{
        TrainingDashboardStore.setTrainingPieStatus(res);
        return res;
      })
    ))
  }

  getTrainingBarCompetency(): Observable<TrainingBarCompetency[]> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingBarCompetency[]>('/dashboard/training-count-by-competencies').pipe((
      map((res:TrainingBarCompetency[])=>{
        TrainingDashboardStore.setTrainingBarCompetency(res);
        return res;
      })
    ))
  }

  getTrainingBarCompetencyGroup(): Observable<TrainingBarCompetencyGroup[]> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingBarCompetencyGroup[]>('/dashboard/training-count-by-competency-groups').pipe((
      map((res:TrainingBarCompetencyGroup[])=>{
        TrainingDashboardStore.setTrainingBarCompetencyGroup(res);
        return res;
      })
    ))
  }

  getTrainingBarDepartment(): Observable<TrainingBarDepartment[]> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingBarDepartment[]>('/dashboard/training-count-by-departments').pipe((
      map((res:TrainingBarDepartment[])=>{
        TrainingDashboardStore.setTrainingBarDepartment(res);
        return res;
      })
    ))
  }

  getTrainingBarYears(): Observable<TrainingBarYears[]> {
    let params
    if (RightSidebarLayoutStore.filterPageTag == 'trainings_dashbord' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<TrainingBarYears[]>('/dashboard/training-count-by-years').pipe((
      map((res:TrainingBarYears[])=>{
        TrainingDashboardStore.setTrainingBarYears(res);
        return res;
      })
    ))
  }
}
