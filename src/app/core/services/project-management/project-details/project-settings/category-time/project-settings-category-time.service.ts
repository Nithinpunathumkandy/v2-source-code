import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectSettingsIssueCategory, ProjectSettingsIssueCategoryPaginationResponse } from 'src/app/core/models/project-management/project-details/project-settings/project-setting-issue-category';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../../general/helper-service/helper-service.service';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { ProjectSettingsCategoryTimeStore } from 'src/app/stores/project-management/project-details/project-settings/category-time/pm-category-time.store';


@Injectable({
  providedIn: 'root'
})
export class ProjectSettingsCategoryTimeService {

  ProjectsStore = ProjectsStore;
  ProjectSettingsCategoryTimeStore=ProjectSettingsCategoryTimeStore;
  constructor(private _http: HttpClient, private _utilityService:UtilityService,private _helperService:HelperServiceService) { }
  getItems(getAll: boolean = false, additionalParams?: string): Observable<ProjectSettingsIssueCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectSettingsCategoryTimeStore.currentPage}`;
      if (ProjectSettingsCategoryTimeStore.orderBy) params += `&order=${ProjectSettingsCategoryTimeStore.orderBy}`;
      if (ProjectSettingsCategoryTimeStore.orderItem) params += `&order_by=${ProjectSettingsCategoryTimeStore.orderItem}`;
      if (ProjectSettingsCategoryTimeStore.searchText) params += `&q=${ProjectSettingsCategoryTimeStore.searchText}`;
    }
    if(additionalParams){
      params = params+additionalParams;
    }
    //if(RightSidebarLayoutStore.filterPageTag == 'asset_maintenance' && RightSidebarLayoutStore.filtersAsQueryString)
    //params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectSettingsIssueCategoryPaginationResponse>('/projects/'+this.ProjectsStore.selectedProjectID+'/project-time-categories' + (params ? params : '')).pipe(
      map((res: ProjectSettingsIssueCategoryPaginationResponse) => {
       //console.log(res);
       ProjectSettingsCategoryTimeStore.setIssueCategory(res);
        return res;
      })
    );

  }

  searchTextIssueCategory(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectSettingsIssueCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectSettingsCategoryTimeStore.currentPage}`;
      if (ProjectSettingsCategoryTimeStore.orderBy) params += `&order_by=''&order=${ProjectSettingsCategoryTimeStore.orderBy}`;
    }
    if(ProjectSettingsCategoryTimeStore.searchText) params += (params ? '&q=' : '?q=')+ProjectSettingsCategoryTimeStore.searchText;
    if(additionalParams)
      params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ProjectSettingsIssueCategoryPaginationResponse>('/project-time-categories' + (params ? params : '')).pipe(
      map((res: ProjectSettingsIssueCategoryPaginationResponse) => {

        return res;
      })
    );
  }

  sortTaskCategryList(type:string) {
    if (!ProjectSettingsCategoryTimeStore.orderBy) {
      ProjectSettingsCategoryTimeStore.orderBy = 'desc';
      ProjectSettingsCategoryTimeStore.orderItem = type;
    }
    else{
      if (ProjectSettingsCategoryTimeStore.orderItem == type) {
        if(ProjectSettingsCategoryTimeStore.orderBy == 'desc') ProjectSettingsCategoryTimeStore.orderBy = 'asc';
        else ProjectSettingsCategoryTimeStore.orderBy = 'desc'
      }
      else{
        ProjectSettingsCategoryTimeStore.orderBy = 'desc';
        ProjectSettingsCategoryTimeStore.orderItem = type;
      }
    }
  }


  deleteIssueCategory(id: number,params?): Observable<any> {
		return this._http.delete('/projects/'+this.ProjectsStore.selectedProjectID+'/project-time-categories/'+id).pipe(map(res => {
			this._utilityService.showSuccessMessage('success', 'category_time_deleted');
			this.getItems(false,(params?params:'')).subscribe();
			return res;
		}))
	}

  addIssueCategory(data)
  {
    let item={project_time_category_ids:data}
    return this._http.post<any>('/projects/'+this.ProjectsStore.selectedProjectID+'/project-time-categories',item).pipe(
      map((res: any) => {

        return res;
      })
    );
  }

}
