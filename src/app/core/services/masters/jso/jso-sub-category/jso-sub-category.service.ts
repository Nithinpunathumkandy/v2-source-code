import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsoSubCategory, JsoSubCategoryPaginationResponse } from 'src/app/core/models/masters/jso/jso-sub-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { JsoSubCategoryMasterStore } from 'src/app/stores/masters/jso/jso-sub-category-master-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class JsoSubCategoryService {

  constructor(private _http:HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<JsoSubCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JsoSubCategoryMasterStore.currentPage}`;
      if (JsoSubCategoryMasterStore.orderBy) params += `&order_by=${JsoSubCategoryMasterStore.orderItem}&order=${JsoSubCategoryMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(JsoSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+JsoSubCategoryMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<JsoSubCategoryPaginationResponse>('/jso-sub-categories' + (params ? params : '')).pipe(
      map((res: JsoSubCategoryPaginationResponse) => {
        JsoSubCategoryMasterStore.setJsoSubCategory(res);
        return res;
      })
    );
 
  }
  saveItem(item: JsoSubCategory) {
    return this._http.post('/jso-sub-categories', item).pipe(
      map((res:any )=> {
        JsoSubCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','jso_sub_category_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  updateItem(id:number, item: JsoSubCategory): Observable<any> {
    return this._http.put('/jso-sub-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_sub_category_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/jso-sub-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_sub_category_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            JsoSubCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/jso-sub-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_sub_category_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/jso-sub-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_sub_category_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/jso-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_sub_category_template')+".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/jso-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_sub_category')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/jso-sub-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/jso-sub-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','jso_sub_category_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  sortJsoSubCategorylList(type:string, text:string) {
    if (!JsoSubCategoryMasterStore.orderBy) {
      JsoSubCategoryMasterStore.orderBy = 'asc';
      JsoSubCategoryMasterStore.orderItem = type;
    }
    else{
      if (JsoSubCategoryMasterStore.orderItem == type) {
        if(JsoSubCategoryMasterStore.orderBy == 'asc') JsoSubCategoryMasterStore.orderBy = 'desc';
        else JsoSubCategoryMasterStore.orderBy = 'asc'
      }
      else{
        JsoSubCategoryMasterStore.orderBy = 'asc';
        JsoSubCategoryMasterStore.orderItem = type;
      }
    }
  }
}
