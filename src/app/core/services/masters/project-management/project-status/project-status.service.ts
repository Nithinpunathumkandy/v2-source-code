import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProjectStatus,ProjectStatusPaginationResponse} from 'src/app/core/models/masters/project-management/project-status';
import{ProjectStatusMasterStore} from 'src/app/stores/masters/project-management/project-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectStatusMasterStore.currentPage}`;
        if (ProjectStatusMasterStore.orderBy) params += `&order_by=${ProjectStatusMasterStore.orderItem}&order=${ProjectStatusMasterStore.orderBy}`;
      }
      if(ProjectStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectStatusPaginationResponse>('/project-statuses' + (params ? params : '')).pipe(
        map((res: ProjectStatusPaginationResponse) => {
          ProjectStatusMasterStore.setProjectStatus(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ProjectStatus[]> {
      return this._http.get<ProjectStatus[]>('/project-statuses').pipe((
        map((res:ProjectStatus[])=>{
          ProjectStatusMasterStore.setAllProjectStatus(res);
          return res;
        })
      ))
    }

    activate(id: number) {
      return this._http.put('/project-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/project-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_status') + ".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/project-statuses/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

   

    sortProjectStatusList(type:string, text:string) {
      if (!ProjectStatusMasterStore.orderBy) {
        ProjectStatusMasterStore.orderBy = 'asc';
        ProjectStatusMasterStore.orderItem = type;
      }
      else{
        if (ProjectStatusMasterStore.orderItem == type) {
          if(ProjectStatusMasterStore.orderBy == 'asc') ProjectStatusMasterStore.orderBy = 'desc';
          else ProjectStatusMasterStore.orderBy = 'asc'
        }
        else{
          ProjectStatusMasterStore.orderBy = 'asc';
          ProjectStatusMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
