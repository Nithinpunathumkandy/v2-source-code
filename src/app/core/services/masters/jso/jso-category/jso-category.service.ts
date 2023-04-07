import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { JsoCategory, JsoCategoryPaginationResponse, JsoCategorySaveResponse} from 'src/app/core/models/masters/jso/jso-category';
import { JsoCategoryMasterStore} from 'src/app/stores/masters/jso/jso-category-master-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class JsoCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<JsoCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${JsoCategoryMasterStore.currentPage}`;
      if (JsoCategoryMasterStore.orderBy) params += `&order_by=${JsoCategoryMasterStore.orderItem}&order=${JsoCategoryMasterStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(JsoCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+JsoCategoryMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<JsoCategoryPaginationResponse>('/jso-categories' + (params ? params : '')).pipe(
      map((res: JsoCategoryPaginationResponse) => {
        JsoCategoryMasterStore.setJsoCategory(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<JsoCategory[]>{
    return this._http.get<JsoCategory[]>('/jso-categories?is_all=true').pipe(
      map((res: JsoCategory[]) => {
        
        JsoCategoryMasterStore.setAllJsoCategory(res);
        return res;
      })
    );
  }


  saveItem(item: JsoCategory,setlastInserted = false) {
    return this._http.post('/jso-categories', item).pipe(
      map((res: JsoCategorySaveResponse) => {
        if(setlastInserted) JsoCategoryMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','jso_category_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: JsoCategory): Observable<any> {
    return this._http.put('/jso-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_category_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/jso-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_category_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            JsoCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/jso-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_category_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/jso-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'jso_category_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/jso-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_category_template')+".xlsx");
      }
    )
  }
  exportToExcel() {
    this._http.get('/jso-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('jso_category')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/jso-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/jso-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','jso_category_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }


  sortJsoCategorylList(type:string, text:string) {
    if (!JsoCategoryMasterStore.orderBy) {
      JsoCategoryMasterStore.orderBy = 'asc';
      JsoCategoryMasterStore.orderItem = type;
    }
    else{
      if (JsoCategoryMasterStore.orderItem == type) {
        if(JsoCategoryMasterStore.orderBy == 'asc') JsoCategoryMasterStore.orderBy = 'desc';
        else JsoCategoryMasterStore.orderBy = 'asc'
      }
      else{
        JsoCategoryMasterStore.orderBy = 'asc';
        JsoCategoryMasterStore.orderItem = type;
      }
    }
  }
}
