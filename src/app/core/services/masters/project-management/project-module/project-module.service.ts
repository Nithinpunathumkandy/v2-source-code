import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProjectModule,ProjectModulePaginationResponse} from 'src/app/core/models/masters/project-management/project-module';
import{ProjectModuleMasterStore} from 'src/app/stores/masters/project-management/project-module-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectModuleService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectModulePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectModuleMasterStore.currentPage}`;
        if (ProjectModuleMasterStore.orderBy) params += `&order_by=${ProjectModuleMasterStore.orderItem}&order=${ProjectModuleMasterStore.orderBy}`;
      }
      if(ProjectModuleMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectModuleMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectModulePaginationResponse>('/project-modules' + (params ? params : '')).pipe(
        map((res: ProjectModulePaginationResponse) => {
          ProjectModuleMasterStore.setProjectModule(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ProjectModule[]> {
      return this._http.get<ProjectModule[]>('/project-modules').pipe((
        map((res:ProjectModule[])=>{
          ProjectModuleMasterStore.setAllProjectModule(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/project-modules/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_module_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-modules/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_module_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/project-modules/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_module')+".xlsx");
        }
      )
    }

   

    sortProjectStatusList(type:string, text:string) {
      if (!ProjectModuleMasterStore.orderBy) {
        ProjectModuleMasterStore.orderBy = 'asc';
        ProjectModuleMasterStore.orderItem = type;
      }
      else{
        if (ProjectModuleMasterStore.orderItem == type) {
          if(ProjectModuleMasterStore.orderBy == 'asc') ProjectModuleMasterStore.orderBy = 'desc';
          else ProjectModuleMasterStore.orderBy = 'asc'
        }
        else{
          ProjectModuleMasterStore.orderBy = 'asc';
          ProjectModuleMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
