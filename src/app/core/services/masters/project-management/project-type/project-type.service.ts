import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProjectType,ProjectTypePaginationResponse} from 'src/app/core/models/masters/project-management/project-type';
import{ProjectTypeMasterStore} from 'src/app/stores/masters/project-management/project-type-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectTypeMasterStore.currentPage}`;
        if (ProjectTypeMasterStore.orderBy) params += `&order_by=${ProjectTypeMasterStore.orderItem}&order=${ProjectTypeMasterStore.orderBy}`;
      }
      if(ProjectTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectTypeMasterStore.searchText;
      if(additionalParams) params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectTypePaginationResponse>('/project-types' + (params ? params : '')).pipe(
        map((res: ProjectTypePaginationResponse) => {
          ProjectTypeMasterStore.setProjectType(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ProjectType[]> {
      return this._http.get<ProjectType[]>('/project-types').pipe((
        map((res:ProjectType[])=>{
          ProjectTypeMasterStore.setAllProjectType(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/project-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_type_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_type_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/project-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_types') + ".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/project-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }
   

    sortProjectTypeList(type:string, text:string) {
      if (!ProjectTypeMasterStore.orderBy) {
        ProjectTypeMasterStore.orderBy = 'asc';
        ProjectTypeMasterStore.orderItem = type;
      }
      else{
        if (ProjectTypeMasterStore.orderItem == type) {
          if(ProjectTypeMasterStore.orderBy == 'asc') ProjectTypeMasterStore.orderBy = 'desc';
          else ProjectTypeMasterStore.orderBy = 'asc'
        }
        else{
          ProjectTypeMasterStore.orderBy = 'asc';
          ProjectTypeMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
