import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProjectObjective,ProjectObjectivePaginationResponse,ProjectObjectiveSingle} from 'src/app/core/models/masters/project-monitoring/project-objective'
import {ProjectObjectiveMasterStore} from 'src/app/stores/masters/project-monitoring/project-objective-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectObjectiveService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectObjectivePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectObjectiveMasterStore.currentPage}`;
      if (ProjectObjectiveMasterStore.orderBy)
        params += `&order_by=${ProjectObjectiveMasterStore.orderItem}&order=${ProjectObjectiveMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ProjectObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectObjectiveMasterStore.searchText;

    
    return this._http
      .get<ProjectObjectivePaginationResponse>('/project-objectives'+(params ? params : ''))
      .pipe(
        map((res: ProjectObjectivePaginationResponse) => {
          ProjectObjectiveMasterStore.setProjectObjective(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ProjectObjectiveSingle> {
		return this._http.get<ProjectObjectiveSingle>('/project-objectives/' + id).pipe(
			map((res: ProjectObjectiveSingle) => {
				ProjectObjectiveMasterStore.setIndividualProjectObjective(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/project-objectives/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/project-objectives', item).pipe(
      map(res => {
        ProjectObjectiveMasterStore.setLastInsertedprojectObjective(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/project-objectives/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_objective_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-objectives/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_objective')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/project-objectives/share',data).pipe(
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
    return this._http.post('/project-objectives/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/project-objectives/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-objectives/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/project-objectives/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProjectObjectiveMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortProjectObjectiveList(type:string, text:string) {
    if (!ProjectObjectiveMasterStore.orderBy) {
      ProjectObjectiveMasterStore.orderBy = 'asc';
      ProjectObjectiveMasterStore.orderItem = type;
    }
    else{
      if (ProjectObjectiveMasterStore.orderItem == type) {
        if(ProjectObjectiveMasterStore.orderBy == 'asc') ProjectObjectiveMasterStore.orderBy = 'desc';
        else ProjectObjectiveMasterStore.orderBy = 'asc'
      }
      else{
        ProjectObjectiveMasterStore.orderBy = 'asc';
        ProjectObjectiveMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
