import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProjectTheme,ProjectThemePaginationResponse,ProjectThemeSingle} from 'src/app/core/models/masters/project-monitoring/project-theme'
import {ProjectThemeMasterStore} from 'src/app/stores/masters/project-monitoring/project-theme-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectThemeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  // getItems(getAll: boolean = false): Observable<ProjectThemePaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${ProjectThemeMasterStore.currentPage}&status=all`;
  //     if (ProjectThemeMasterStore.orderBy) params += `&order_by=designation_zones.title&order=${ProjectThemeMasterStore.orderBy}`;
  //   }
    

  //   return this._http.get<ProjectThemePaginationResponse>('/project-themes' + (params ? params : '')).pipe(
  //     map((res: ProjectThemePaginationResponse) => {
  //       ProjectThemeMasterStore.setProjectTheme(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectThemePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectThemeMasterStore.currentPage}`;
      if (ProjectThemeMasterStore.orderBy)
        params += `&order_by=${ProjectThemeMasterStore.orderItem}&order=${ProjectThemeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ProjectThemeMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectThemeMasterStore.searchText;

    
    return this._http
      .get<ProjectThemePaginationResponse>('/project-themes'+(params ? params : ''))
      .pipe(
        map((res: ProjectThemePaginationResponse) => {
          ProjectThemeMasterStore.setProjectTheme(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ProjectThemeSingle> {
		return this._http.get<ProjectThemeSingle>('/project-themes/' + id).pipe(
			map((res: ProjectThemeSingle) => {
				ProjectThemeMasterStore.setIndividualProjectTheme(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/project-themes/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/project-themes', item).pipe(
      map(res => {
        ProjectThemeMasterStore.setLastInsertedprojectTheme(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/project-themes/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_theme_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-themes/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_theme')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/project-themes/share',data).pipe(
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
    return this._http.post('/project-themes/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/project-themes/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-themes/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/project-themes/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProjectThemeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortProjectThemeList(type:string, text:string) {
    if (!ProjectThemeMasterStore.orderBy) {
      ProjectThemeMasterStore.orderBy = 'asc';
      ProjectThemeMasterStore.orderItem = type;
    }
    else{
      if (ProjectThemeMasterStore.orderItem == type) {
        if(ProjectThemeMasterStore.orderBy == 'asc') ProjectThemeMasterStore.orderBy = 'desc';
        else ProjectThemeMasterStore.orderBy = 'asc'
      }
      else{
        ProjectThemeMasterStore.orderBy = 'asc';
        ProjectThemeMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
