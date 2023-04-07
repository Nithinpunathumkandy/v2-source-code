import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Department,DepartmentDetails,DepartmentPaginationResponse } from 'src/app/core/models/masters/organization/department';
import{DepartmentMasterStore} from 'src/app/stores/masters/organization/department-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<DepartmentPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${DepartmentMasterStore.currentPage}&limit=${DepartmentMasterStore.itemsPerPage}`;
        if (DepartmentMasterStore.orderBy) params += `&order_by=${DepartmentMasterStore.orderItem}&order=${DepartmentMasterStore.orderBy}`;

      }
      if(DepartmentMasterStore.searchText) params += (params ? '&q=' : '?q=')+DepartmentMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'department' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<DepartmentPaginationResponse>('/departments' + (params ? params : '')).pipe(
        map((res: DepartmentPaginationResponse) => {
          DepartmentMasterStore.setDepartment(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Department[]> {
      return this._http.get<Department[]>('/departments').pipe((
        map((res:Department[])=>{
          DepartmentMasterStore.setAllDepartment(res);
          return res;
        })
      ))
    }

    getItem(id): Observable<DepartmentDetails> {
      return this._http.get<DepartmentDetails>('/departments/'+id).pipe((
        map((res:DepartmentDetails)=>{
          DepartmentMasterStore.setIndividualDepartment(res);
          return res;
        })
      ))
    }

    saveItem(item: Department) {
      return this._http.post('/departments', item).pipe(
        map((res:any )=> {
          DepartmentMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: Department): Observable<any> {
      return this._http.put('/departments/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/departments/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              DepartmentMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/departments/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'department_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/departments/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/departments/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('department_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
		if (DepartmentMasterStore.orderBy) params += `?order=${DepartmentMasterStore.orderBy}`;
		if (DepartmentMasterStore.orderItem) params += `&order_by=${DepartmentMasterStore.orderItem}`;
		if(RightSidebarLayoutStore.filterPageTag == 'department' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/departments/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('department')+".xlsx");
        }
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/departments/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(null).subscribe();
          return res;
        })
      )
    }

    searchDepartment(params){
      return this.getItems(params ? params : '').pipe(
        map((res: DepartmentPaginationResponse) => {
          DepartmentMasterStore.setDepartment(res);
          return res;
        })
      );
    }

    sortDepartmentlList(type:string, text:string) {
      if (!DepartmentMasterStore.orderBy) {
        DepartmentMasterStore.orderBy = 'asc';
        DepartmentMasterStore.orderItem = type;
      }
      else{
        if (DepartmentMasterStore.orderItem == type) {
          if(DepartmentMasterStore.orderBy == 'asc') DepartmentMasterStore.orderBy = 'desc';
          else DepartmentMasterStore.orderBy = 'asc'
        }
        else{
          DepartmentMasterStore.orderBy = 'asc';
          DepartmentMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
   
    getLastInserted(){
      return DepartmentMasterStore.LastInsertedId
     
    }

}

