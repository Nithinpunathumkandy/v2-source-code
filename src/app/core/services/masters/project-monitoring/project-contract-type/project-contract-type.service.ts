import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ProjectContractType,ProjectContractTypePaginationResponse,ProjectContractTypeSingle} from 'src/app/core/models/masters/project-monitoring/project-contract-type'
import {ProjectContractTypeMasterStore} from 'src/app/stores/masters/project-monitoring/project-contract-type-store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";



@Injectable({
  providedIn: 'root'
})
export class ProjectContractTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  // getItems(getAll: boolean = false): Observable<ProjectContractTypePaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${ProjectContractTypeMasterStore.currentPage}&status=all`;
  //     if (ProjectContractTypeMasterStore.orderBy) params += `&order_by=designation_zones.title&order=${ProjectContractTypeMasterStore.orderBy}`;
  //   }
    

  //   return this._http.get<ProjectContractTypePaginationResponse>('/project-contract-types' + (params ? params : '')).pipe(
  //     map((res: ProjectContractTypePaginationResponse) => {
  //       ProjectContractTypeMasterStore.setProjectContractType(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectContractTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectContractTypeMasterStore.currentPage}`;
      if (ProjectContractTypeMasterStore.orderBy)
        params += `&order_by=${ProjectContractTypeMasterStore.orderItem}&order=${ProjectContractTypeMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(ProjectContractTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectContractTypeMasterStore.searchText;

    
    return this._http
      .get<ProjectContractTypePaginationResponse>('/project-contract-types'+(params ? params : ''))
      .pipe(
        map((res: ProjectContractTypePaginationResponse) => {
          ProjectContractTypeMasterStore.setProjectContractType(res);
          return res;
        })
      );
  }

  getItem(id): Observable<ProjectContractTypeSingle> {
		return this._http.get<ProjectContractTypeSingle>('/project-contract-types/' + id).pipe(
			map((res: ProjectContractTypeSingle) => {
				ProjectContractTypeMasterStore.setIndividualProjectContractType(res)
				return res;
			})
		);
	}


  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/project-contract-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/project-contract-types', item).pipe(
      map(res => {
        ProjectContractTypeMasterStore.setLastInsertedprojectContractType(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/project-contract-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_contract_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/project-contract-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_contract_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/project-contract-types/share',data).pipe(
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
    return this._http.post('/project-contract-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/project-contract-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/project-contract-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/project-contract-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ProjectContractTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortProjectContractTypeList(type:string, text:string) {
    if (!ProjectContractTypeMasterStore.orderBy) {
      ProjectContractTypeMasterStore.orderBy = 'asc';
      ProjectContractTypeMasterStore.orderItem = type;
    }
    else{
      if (ProjectContractTypeMasterStore.orderItem == type) {
        if(ProjectContractTypeMasterStore.orderBy == 'asc') ProjectContractTypeMasterStore.orderBy = 'desc';
        else ProjectContractTypeMasterStore.orderBy = 'asc'
      }
      else{
        ProjectContractTypeMasterStore.orderBy = 'asc';
        ProjectContractTypeMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
