import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectSettingsIssueCategory, ProjectSettingsIssueCategoryPaginationResponse } from 'src/app/core/models/project-management/project-details/project-settings/project-setting-issue-category';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../../general/helper-service/helper-service.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ProjectSettingsIssueCategoryStore } from 'src/app/stores/project-management/project-details/project-settings/project-settings-issue-category/project-settings-issue-category-store';


@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsIssueCategoryService {
  ProjectsStore = ProjectsStore;
  ProjectSettingsIssueCategoryStore=ProjectSettingsIssueCategoryStore;
  constructor(private _http: HttpClient, private _utilityService:UtilityService,private _helperService:HelperServiceService) { }
  getItems(getAll: boolean = false, additionalParams?: string): Observable<ProjectSettingsIssueCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectSettingsIssueCategoryStore.currentPage}`;
      if (ProjectSettingsIssueCategoryStore.orderBy) params += `&order=${ProjectSettingsIssueCategoryStore.orderBy}`;
      if (ProjectSettingsIssueCategoryStore.orderItem) params += `&order_by=${ProjectSettingsIssueCategoryStore.orderItem}`;
      if (ProjectSettingsIssueCategoryStore.searchText) params += `&q=${ProjectSettingsIssueCategoryStore.searchText}`;
    }
    if(additionalParams){
      params = params+additionalParams;
    }
    //if(RightSidebarLayoutStore.filterPageTag == 'asset_maintenance' && RightSidebarLayoutStore.filtersAsQueryString)
    //params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectSettingsIssueCategoryPaginationResponse>('/projects/'+this.ProjectsStore.selectedProjectID+'/task-categories' + (params ? params : '')).pipe(
      map((res: ProjectSettingsIssueCategoryPaginationResponse) => {
       //console.log(res);
       ProjectSettingsIssueCategoryStore.setIssueCategory(res);
        return res;
      })
    );

  }

  searchTextIssueCategory(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectSettingsIssueCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectSettingsIssueCategoryStore.currentPage}`;
      if (ProjectSettingsIssueCategoryStore.orderBy) params += `&order_by=''&order=${ProjectSettingsIssueCategoryStore.orderBy}`;
    }
    if(ProjectSettingsIssueCategoryStore.searchText) params += (params ? '&q=' : '?q=')+ProjectSettingsIssueCategoryStore.searchText;
    if(additionalParams)
      params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ProjectSettingsIssueCategoryPaginationResponse>('/task-categories' + (params ? params : '')).pipe(
      map((res: ProjectSettingsIssueCategoryPaginationResponse) => {

        return res;
      })
    );
  }

  sortTaskCategryList(type:string) {
    if (!ProjectSettingsIssueCategoryStore.orderBy) {
      ProjectSettingsIssueCategoryStore.orderBy = 'desc';
      ProjectSettingsIssueCategoryStore.orderItem = type;
    }
    else{
      if (ProjectSettingsIssueCategoryStore.orderItem == type) {
        if(ProjectSettingsIssueCategoryStore.orderBy == 'desc') ProjectSettingsIssueCategoryStore.orderBy = 'asc';
        else ProjectSettingsIssueCategoryStore.orderBy = 'desc'
      }
      else{
        ProjectSettingsIssueCategoryStore.orderBy = 'desc';
        ProjectSettingsIssueCategoryStore.orderItem = type;
      }
    }
  }


  deleteIssueCategory(id: number,params?): Observable<any> {
		return this._http.delete('/projects/'+this.ProjectsStore.selectedProjectID+'/task-categories/'+id).pipe(map(res => {
			this._utilityService.showSuccessMessage('success', 'issue_category_deleted');
			this.getItems(false,(params?params:'')).subscribe();
			return res;
		}))
	}

  addIssueCategory(data)
  {
    let item={task_categories_id:data}
    return this._http.post<any>('/projects/'+this.ProjectsStore.selectedProjectID+'/task-categories',item).pipe(
      map((res: any) => {

        return res;
      })
    );
  }


}
