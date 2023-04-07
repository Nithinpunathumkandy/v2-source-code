import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualProjectClosure, ProjectClosurePaginationResponse } from 'src/app/core/models/project-management/project-details/project-closure/project-closure';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectClosureService {

  constructor(private _http:HttpClient,private _helperService : HelperServiceService,
              private _utilityService:UtilityService) { }



   /**
   * @description
   * This method is used for getting project closure.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProjectClosureService
   */              
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectClosurePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectClosureStore.currentPage}`;
      if (ProjectClosureStore.orderBy) params += `&order_by=${ProjectClosureStore.orderItem}&order=${ProjectClosureStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ProjectClosureStore.searchText) params += (params ? '&q=' : '?q=')+ProjectClosureStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_closure' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectClosurePaginationResponse>(`/project-monitor/projects/${ProjectMonitoringStore.selectedProjectId}/closure` + (params ? params : '')).pipe(
      map((res: ProjectClosurePaginationResponse) => {
        ProjectClosureStore.setProjectClosure(res);
        return res;
      })
    );
 
  }

   /**
   * @description
   * This method is used for getting individual project closure details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectClosureService
   */
    getItem(projectId: number,closureId: number) : Observable<IndividualProjectClosure>{
      return this._http.get<IndividualProjectClosure>(`/project-monitor/projects/${projectId}/closure/${closureId}`).pipe(
        map((res: IndividualProjectClosure) => {
          ProjectClosureStore.setIndividualProjectClosure(res)
          return res;
        })
      );
    }  
    exportToExcel(params:string='') {
      this._http.get('/project-monitor/project-closures/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Closure') +".xlsx");
        }
      )
    }
   /**
   * @description
   * this method is used for creating project closure
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectClosureService
   */  
  saveProjectDocument(projectId: number,item: any){
    return this._http.post(`/project-monitor/projects/${projectId}/closure`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','project_closure_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating project closure
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectClosureService
   */  
  updateItem(projectId: number, documentId: number, item: any): Observable<any> {
    return this._http.put(`/project-monitor/projects/${projectId}/closure/${documentId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_closure_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for deleting project closure
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ProjectClosureService
   */  
  delete(projectId: number, documentId: number){
    return this._http.delete(`/project-monitor/projects/${projectId}/closure/${documentId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_closure_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getAllItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectClosurePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectClosureStore.currentPage}`;
      if (ProjectClosureStore.orderBy) params += `&order_by=${ProjectClosureStore.orderItem}&order=${ProjectClosureStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ProjectClosureStore.searchText) params += (params ? '&q=' : '?q=')+ProjectClosureStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_closure' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectClosurePaginationResponse>(`/project-monitor/project-closures` + (params ? params : '')).pipe(
      map((res: ProjectClosurePaginationResponse) => {
        ProjectClosureStore.setProjectClosure(res);
        return res;
      })
    );
 
  }



  sortProjectClosureList(type:string, text:string) {
    if (!ProjectClosureStore.orderBy) {
      ProjectClosureStore.orderBy = 'asc';
      ProjectClosureStore.orderItem = type;
    }
    else{
      if (ProjectClosureStore.orderItem == type) {
        if(ProjectClosureStore.orderBy == 'asc') ProjectClosureStore.orderBy = 'desc';
        else ProjectClosureStore.orderBy = 'asc'
      }
      else{
        ProjectClosureStore.orderBy = 'asc';
        ProjectClosureStore.orderItem = type;
      }
    }
  }

}


