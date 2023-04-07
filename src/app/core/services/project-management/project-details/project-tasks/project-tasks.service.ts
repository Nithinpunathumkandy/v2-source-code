import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualProjectClosure, ProjectClosurePaginationResponse } from 'src/app/core/models/project-management/project-details/project-closure/project-closure';
import { IndividualProjectTasks, ProjectTasksPaginationResponse } from 'src/app/core/models/project-management/project-details/project-tasks/project-tasks';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectTasksStore } from 'src/app/stores/project-management/project-details/project-tasks/project-tasks';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectTasksService {

  constructor(
    private _http:HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService:UtilityService) { }

   /**
   * @description
   * This method is used for getting project tasks.
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof ProjectTasksService
   */              
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectTasksPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectTasksStore.currentPage}`;
      if (ProjectTasksStore.orderBy) params += `&order_by=${ProjectTasksStore.orderItem}&order=${ProjectTasksStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ProjectTasksStore.searchText) params += (params ? '&q=' : '?q=')+ProjectTasksStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_closure' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectTasksPaginationResponse>(`/tasks` + (params ? params : '')).pipe(
      map((res: ProjectTasksPaginationResponse) => {
        ProjectTasksStore.setProjectTasks(res);
        return res;
      })
    );
 
  }

   /**
   * @description
   * This method is used for getting individual project tasks details.
   *
   * @param {number} id
   * @returns this api will return a observalble
   * @memberof ProjectTasksService
   */
    getItem(taskId: number) : Observable<IndividualProjectTasks>{
      return this._http.get<IndividualProjectTasks>(`/tasks/${taskId}`).pipe(
        map((res: IndividualProjectTasks) => {
          ProjectTasksStore.setIndividualProjectTasks(res)
          return res;
        })
      );
    }  

   /**
   * @description
   * this method is used for creating project tasks
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectTasksService
   */  
  saveProjectDocument(item: any){
    return this._http.post(`/tasks`, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','project_tasks_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating project tasks
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof ProjectTasksService
   */  
  updateItem( taskId: number, item: any): Observable<any> {
    return this._http.put(`/tasks/${taskId}`, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_tasks_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   /**
   * @description
   * this method is used for deleting project tasks
   * 
   * @param {*} param
   * @returns this api will return a observalble
   * @memberof ProjectTasksService
   */  
  delete(taskId: number){
    return this._http.delete(`/tasks/${taskId}`).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'project_tasks_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

    /**
  * @description
  * this method is used for export project tasks Data
  *
  * @param {*} [data]
  * @returns this api will return a observalble
  * @memberof ProjectTasksService
  */
     exportToExcel(params: string = '') {
      this._http.get('/tasks/export' + (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_task') + ".xlsx");
        }
      )
    }



  sortProjectClosureList(type:string, text:string) {
    if (!ProjectTasksStore.orderBy) {
      ProjectTasksStore.orderBy = 'asc';
      ProjectTasksStore.orderItem = type;
    }
    else{
      if (ProjectTasksStore.orderItem == type) {
        if(ProjectTasksStore.orderBy == 'asc') ProjectTasksStore.orderBy = 'desc';
        else ProjectTasksStore.orderBy = 'asc'
      }
      else{
        ProjectTasksStore.orderBy = 'asc';
        ProjectTasksStore.orderItem = type;
      }
    }
  }

}


