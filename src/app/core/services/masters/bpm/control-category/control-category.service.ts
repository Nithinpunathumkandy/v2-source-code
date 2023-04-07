import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ControlCategory,ControlCategoryPaginationResponse} from '../../../../models/masters/bpm/conrol-category'
import {ControlCategoryMasterStore} from '../../../../../stores/masters/bpm/control-category.master.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ControlCategoryService {

  
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ControlCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlCategoryMasterStore.currentPage}`;
      if (ControlCategoryMasterStore.orderBy) params += `&order_by=${ControlCategoryMasterStore.orderItem}&order=${ControlCategoryMasterStore.orderBy}`;
    }
    else{
      this.getAllItems();
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(ControlCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ControlCategoryMasterStore.searchText;
    return this._http.get<ControlCategoryPaginationResponse>('/control-categories' + (params ? params : '')).pipe(
      map((res: ControlCategoryPaginationResponse) => {
        ControlCategoryMasterStore.setControlCategories(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<ControlCategory[]>{
    return this._http.get<ControlCategory[]>('/control-categories?is_all=true').pipe(
      map((res: ControlCategory[]) => {
        
        ControlCategoryMasterStore.setAllControlCategories(res);
        return res;
      })
    );
  }


  updateItem(id,item:ControlCategory):Observable<any>{
    return this._http.put('/control-categories/'+id,item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','update_success');
      this.getItems(false,null,true).subscribe()
      return res;
    }))
  }

  saveItem(item:ControlCategory){
    return this._http.post('/control-categories', item).pipe(map(res => {
      ControlCategoryMasterStore.setLastInsertedcontrolCategory(res['id']);
      this._utilityService.showSuccessMessage('success','create_success');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    }))

  }
  
  delete(id:number){
    return this._http.delete('/control-categories/'+id).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','delete_success');
      this.getItems(false,null,true).subscribe(resp=>{
        if (resp.from==null){
          ControlCategoryMasterStore.setCurrentPage(resp.current_page-1);
          this.getItems(false,null,true).subscribe();
        }
      })
      return res;
    }))
  }

  activate(id:number){
    return this._http.put('/control-categories/' + id + '/activate',null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
    }))
  }

  deactivate(id:number){
    return this._http.put('/control-categories/' + id + '/deactivate',null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','deactivate_success');
      this.getItems(false,null,true).subscribe();
      return res;
    }))
  }

  generateTemplate() {
    this._http.get('/control-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/control-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_category')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/control-categories/share',data).pipe(
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
    return this._http.post('/control-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortControlCategoryList(type:string, text:string) {
    if (!ControlCategoryMasterStore.orderBy) {
      ControlCategoryMasterStore.orderBy = 'asc';
      ControlCategoryMasterStore.orderItem = type;
    }
    else{
      if (ControlCategoryMasterStore.orderItem == type) {
        if(ControlCategoryMasterStore.orderBy == 'asc') ControlCategoryMasterStore.orderBy = 'desc';
        else ControlCategoryMasterStore.orderBy = 'asc'
      }
      else{
        ControlCategoryMasterStore.orderBy = 'asc';
        ControlCategoryMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }

}
