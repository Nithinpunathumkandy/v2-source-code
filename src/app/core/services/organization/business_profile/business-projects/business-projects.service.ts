import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UtilityService } from 'src/app/shared/services/utility.service';

import { BusinessProjects, BusinessProjectsResponse, BusinessProjectDetails } from "src/app/core/models/organization/business_profile/business-projects";
import { BusinessProjectsStore } from "src/app/stores/organization/business_profile/business-projects.store";
import { ProjectStatusResponse } from "src/app/core/models/project-status.model";
import { ProjectStatusStore } from "src/app/stores/general/project-status.store";

@Injectable({
  providedIn: 'root'
})
export class BusinessProjectsService {

  constructor(private _utilityService: UtilityService, private _http: HttpClient) { }

  // Get Request - Get Projects
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<BusinessProjectsResponse> {
    let params = '';
    if (!getAll) {
      params = `?access_all=true&page=${BusinessProjectsStore.currentPage}`;
    }
    if(additionalParams){
      if(params) params = params + `&${additionalParams}`;
      else params = `?${additionalParams}`;
    }
    if(BusinessProjectsStore.searchText != ''){
      if(params) params = params + `&q=${BusinessProjectsStore.searchText}`;
      else params = `?q=${BusinessProjectsStore.searchText}`;
    }
    if(is_all) params += '&status=all';
    return this._http.get<BusinessProjectsResponse>('/projects' + (params ? params : '')).pipe(
      map((res: BusinessProjectsResponse) => {
        for(let i of res['data']){
          i['view_more'] = false;
        }
        BusinessProjectsStore.setProjectDetails(res);
        return res;
      })
    );
  }

  // Post Request - Save Project
  saveItem(item: BusinessProjects) {
    return this._http.post('/projects', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  // Delete Request - Delete Project
  deleteItem(id: number) {
    return this._http.delete('/projects/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from == null && resp.current_page > 1){
            BusinessProjectsStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  // Put Request - Update Project
  updateItem(id, item: BusinessProjects): Observable<any> {
    return this._http.put('/projects/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  // Get Request - Get details of particular Project
  getItem(id):Observable<BusinessProjectDetails>{
    return this._http.get('/projects/' + id).pipe(
      map((res:BusinessProjectDetails) => {
        BusinessProjectsStore.setSelectedProjectDetails(res);
        return res;
      })
    );
  }

  getProjectStatus():Observable<ProjectStatusResponse>{
    return this._http.get<ProjectStatusResponse>('/project-statuses').pipe(
      map((res: ProjectStatusResponse) => {
        ProjectStatusStore.setProjectStatusList(res);
        return res;
      })
    );
  }

  deactivateItem(id: number){
    return this._http.put('/projects/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activateItem(id: number){
    return this._http.put('/projects/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }


  setImageDetails(imageDetails,url,type){
    BusinessProjectsStore.setFileDetails(imageDetails,url,type);
  }

  getImageDetails(type){
    return BusinessProjectsStore.getFileDetailsByType(type);
  }


  // Generate and Download Template
  generateTemplate() {
    this._http.get('/projects/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('project_template')+'.xlsx');
      }
    )
  }

  // Export to Excel and Download
  exportToExcel() {
    this._http.get('/projects/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._utilityService.translateToUserLanguage('projects')+'.xlsx');
      }
    )
  }

  selectRequiredProject(issues){
   
    BusinessProjectsStore.addSelectedProject(issues);
  }

}
