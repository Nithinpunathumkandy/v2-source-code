import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProjectPriority,ProjectPriorityPaginationResponse,ProjectPrioritySingle} from 'src/app/core/models/masters/project-monitoring/project-priority'
import {ProjectPriorityMasterStore} from 'src/app/stores/masters/project-monitoring/project-priority-store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectPriorityService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  // getItems(getAll: boolean = false): Observable<ProjectPriorityPaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${ProjectPriorityMasterStore.currentPage}&status=all`;
  //     if (ProjectPriorityMasterStore.orderBy) params += `&order_by=designation_zones.title&order=${ProjectPriorityMasterStore.orderBy}`;
  //   }
    

  //   return this._http.get<ProjectPriorityPaginationResponse>('/project_priority' + (params ? params : '')).pipe(
  //     map((res: ProjectPriorityPaginationResponse) => {
  //       ProjectPriorityMasterStore.setProjectPriority(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectPriorityPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectPriorityMasterStore.currentPage}`;
      if (ProjectPriorityMasterStore.orderBy)
        params += `&order_by=${ProjectPriorityMasterStore.orderItem}&order=${ProjectPriorityMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ProjectPriorityMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectPriorityMasterStore.searchText;

    
    return this._http
      .get<ProjectPriorityPaginationResponse>('/project-priorities'+(params ? params : ''))
      .pipe(
        map((res: ProjectPriorityPaginationResponse) => {
          ProjectPriorityMasterStore.setProjectPriority(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ProjectPrioritySingle> {
		return this._http.get<ProjectPrioritySingle>('/project-priorities/' + id).pipe(
			map((res: ProjectPrioritySingle) => {
				ProjectPriorityMasterStore.setIndividualProjectPriority(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/project-priorities/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/project-priorities', item).pipe(
      map(res => {
        ProjectPriorityMasterStore.setLastInsertedprojectPriority(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/project-priorities/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_priority_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-priorities/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_priority')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/project-priorities/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/project-priorities/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/project-priorities/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-priorities/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/project-priorities/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProjectPriorityMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortProjectPriorityList(type:string, text:string) {
    if (!ProjectPriorityMasterStore.orderBy) {
      ProjectPriorityMasterStore.orderBy = 'asc';
      ProjectPriorityMasterStore.orderItem = type;
    }
    else{
      if (ProjectPriorityMasterStore.orderItem == type) {
        if(ProjectPriorityMasterStore.orderBy == 'asc') ProjectPriorityMasterStore.orderBy = 'desc';
        else ProjectPriorityMasterStore.orderBy = 'asc'
      }
      else{
        ProjectPriorityMasterStore.orderBy = 'asc';
        ProjectPriorityMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
