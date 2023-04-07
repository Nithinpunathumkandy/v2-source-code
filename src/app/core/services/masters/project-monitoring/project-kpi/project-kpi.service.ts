import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProjectKpi,ProjectKpiPaginationResponse,ProjectKpiSingle} from 'src/app/core/models/masters/project-monitoring/project-kpi'
import {ProjectKpiMasterStore} from 'src/app/stores/masters/project-monitoring/project-kpi-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectKpiService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectKpiPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectKpiMasterStore.currentPage}`;
      if (ProjectKpiMasterStore.orderBy)
        params += `&order_by=${ProjectKpiMasterStore.orderItem}&order=${ProjectKpiMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ProjectKpiMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectKpiMasterStore.searchText;

    
    return this._http
      .get<ProjectKpiPaginationResponse>('/project-kpis'+(params ? params : ''))
      .pipe(
        map((res: ProjectKpiPaginationResponse) => {
          ProjectKpiMasterStore.setProjectKpi(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ProjectKpiSingle> {
		return this._http.get<ProjectKpiSingle>('/project-kpis/' + id).pipe(
			map((res: ProjectKpiSingle) => {
				ProjectKpiMasterStore.setIndividualProjectKpi(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/project-kpis/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/project-kpis', item).pipe(
      map(res => {
        ProjectKpiMasterStore.setLastInsertedprojectKpi(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/project-kpis/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_kpi_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-kpis/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_kpi')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/project-kpis/share',data).pipe(
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
    return this._http.post('/project-kpis/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/project-kpis/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-kpis/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/project-kpis/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProjectKpiMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortProjectKpiList(type:string, text:string) {
    if (!ProjectKpiMasterStore.orderBy) {
      ProjectKpiMasterStore.orderBy = 'asc';
      ProjectKpiMasterStore.orderItem = type;
    }
    else{
      if (ProjectKpiMasterStore.orderItem == type) {
        if(ProjectKpiMasterStore.orderBy == 'asc') ProjectKpiMasterStore.orderBy = 'desc';
        else ProjectKpiMasterStore.orderBy = 'asc'
      }
      else{
        ProjectKpiMasterStore.orderBy = 'asc';
        ProjectKpiMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
