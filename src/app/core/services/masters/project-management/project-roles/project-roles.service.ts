import { ProjectRoles, ProjectRolesRespones } from 'src/app/core/models/masters/project-management/project-roles';
import { ProjectRolesMasterStore } from 'src/app/stores/masters/project-management/project-roles';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectRolesService {

  constructor(private _http:HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll:boolean=false,additionalParams?:string,status:boolean=false):Observable<ProjectRolesRespones>{
    
    let params = '';
        if (!getAll) {
          params = `?page=${ProjectRolesMasterStore.currentPage}`;
            if (ProjectRolesMasterStore.orderBy) params += `&order_by=${ProjectRolesMasterStore.orderItem}&order=${ProjectRolesMasterStore.orderBy}`;
        }
        if(ProjectRolesMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectRolesMasterStore.searchText;
        if(additionalParams) params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
        if(status) params += (params ? '&' : '?')+'status=all';
     
    return this._http.get<ProjectRolesRespones>('/project-roles' + (params ? params : '')).pipe(
      map((res:ProjectRolesRespones)=>{
          ProjectRolesMasterStore.setProjectRoles(res);
        return res;
      })
    );
  }

  getItem(id): Observable<ProjectRoles> {
   
    return this._http.get<ProjectRoles>('/project-roles/'+id).pipe((
      map((res:ProjectRoles)=>{
          ProjectRolesMasterStore.setIndividualProjectRoles(res);
        return res;
      })
    ))
  }


  saveItem(item) {
    return this._http.post('/project-roles', item).pipe(
      map((res:any )=> {
          ProjectRolesMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('Success!', 'project_roles_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: ProjectRoles): Observable<any> {
    return this._http.put('/project-roles/' + id, item).pipe(
      map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_roles_updated');
          this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/project-roles/' + id).pipe(
      map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_roles_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ProjectRolesMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/project-roles/' + id + '/activate', null).pipe(
      map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_roles_activated');
          this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-roles/' + id + '/deactivate', null).pipe(
      map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_roles_deactivated');
          this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/project-roles/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_role_template') + ".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-roles/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_roles') + ".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/project-roles/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/project-roles/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','project_roles_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortProjectRoleslList(type:string, text:string) {

    if (!ProjectRolesMasterStore.orderBy) {
      ProjectRolesMasterStore.orderBy = 'asc';
      ProjectRolesMasterStore.orderItem = type;
    }
    else{
      if (ProjectRolesMasterStore.orderItem == type) {
        if(ProjectRolesMasterStore.orderBy == 'asc') ProjectRolesMasterStore.orderBy = 'desc';
        else ProjectRolesMasterStore.orderBy = 'asc'
      }
      else{
        ProjectRolesMasterStore.orderBy = 'asc';
        ProjectRolesMasterStore.orderItem = type;
      }
    }
  }

}
