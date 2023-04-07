import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Designation,DesignationPaginationResponse,DesignationCompetency } from '../../../../models/masters/human-capital/designation';
import { map } from 'rxjs/operators';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getItems(getAll:boolean = false,additionalParams?:string,status:boolean=false): Observable<DesignationPaginationResponse> {
    let params = '';
    if(!getAll)
      params = `?page=${DesignationMasterStore.currentPage}`;
    else params = '?is_all=true';
    if(UsersStore.searchText){  
      if(params) params += `&user_search=${UsersStore.searchText}`;
      else params += `?user_search=${UsersStore.searchText}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'users' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
   
    if (DesignationMasterStore.orderBy) params += (params ? '&' :'?') + `order_by=${DesignationMasterStore.orderItem}&order=${DesignationMasterStore.orderBy}`;
    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    if(DesignationMasterStore.searchText) params += (params ? '&q=' : '?q=')+DesignationMasterStore.searchText;
    if(status) params += (params? '&':'?')+'status=all';

    return this._http.get<DesignationPaginationResponse>('/designations' + (params ? params : '')).pipe(
      map((res: DesignationPaginationResponse) => {
        if(!getAll)
          DesignationMasterStore.setDesignations(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<Designation> {
    return this._http.get<Designation>('/designations/' + id).pipe(
      map((res: Designation) => {
        DesignationMasterStore.updateDesignation(res)
        return res;
      })
    );
  }

  getItemsWithoutFilter(params:string=''): Observable<DesignationPaginationResponse>{
    return this._http.get<DesignationPaginationResponse>('/designations' + (params ? params : '')).pipe(
      map((res: DesignationPaginationResponse) => {
        DesignationMasterStore.designationFilterList = res.data;
        return res;
      })
    );
  }

  updateItem(id, item: Designation): Observable<any> {
    return this._http.put('/designations/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: Designation) {
    return this._http.post('/designations', item).pipe(
      map(res => {
        DesignationMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateCompetency(id, item): Observable<any> {
    return this._http.post('/designations/' + id+'/competencies', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getCompetencies(id).subscribe();
        return res;
      })
    );
  }

  getCompetencies(id): Observable<any>{
    return this._http.get<DesignationCompetency[]>('/designations/' + id+'/competencies').pipe(
      map((res: DesignationCompetency[]) => {
        DesignationMasterStore.setCompetencies(res);
        return res;
      })
    );
  }



  generateTemplate() {
    this._http.get('/designations/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/designations/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('designation')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/designations/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/designations/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/designations/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/designations/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/designations/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            DesignationMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  searchDesignation(params){
    return this.getItems(params ? params : '').pipe(
      map((res: DesignationPaginationResponse) => {
        DesignationMasterStore.setDesignations(res);
        return res;
      })
    );
  }
}
