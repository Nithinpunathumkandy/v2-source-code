import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ControlSubcategory,ControlSubcategoryPaginationResponse } from '../../../../models/masters/bpm/control-subcategory';
import { ControlSubcategoryMasterStore } from 'src/app/stores/masters/bpm/control-subcategory.master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ControlSubcategoryService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }



  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ControlSubcategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlSubcategoryMasterStore.currentPage}`;
      if (ControlSubcategoryMasterStore.orderBy) params += `&order_by=${ControlSubcategoryMasterStore.orderItem}&order=${ControlSubcategoryMasterStore.orderBy}`;
    }
    else{
      this.getAllItems();
    }
    if(additionalParams) params += additionalParams;
    if(ControlSubcategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ControlSubcategoryMasterStore.searchText;
    if(is_all) params += '&status=all'
    return this._http.get<ControlSubcategoryPaginationResponse>('/control-sub-categories' + (params ? params : '')).pipe(
      map((res: ControlSubcategoryPaginationResponse) => {
        ControlSubcategoryMasterStore.setControlSubCategories(res);
        return res;
      })
    );
  }

  getSubCategoryByCategory(id: number): Observable<ControlSubcategory[]>{
    let param = id?`?control_category_ids=${id}`:'';
    return this._http.get<ControlSubcategory[]>('/control-sub-categories'+param).pipe(
      map((res: ControlSubcategory[]) => {
        ControlSubcategoryMasterStore.setAllControlSubCategories(res["data"]);
        return res;
      })
    );
    }

    getAllItems(): Observable<ControlSubcategory[]>{
      return this._http.get<ControlSubcategory[]>('/control-sub-categories?is_all=true').pipe(
        map((res: ControlSubcategory[]) => {
          ControlSubcategoryMasterStore.setAllControlSubCategories(res);
          return res;
        })
      );
    }

    updateItem(id, item: ControlSubcategory): Observable<any> {
      return this._http.put('/control-sub-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    saveItem(item:ControlSubcategory){
      return this._http.post('/control-sub-categories', item).pipe(map(res => {
        ControlSubcategoryMasterStore.setLastInsertedcontrolSubCategory(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true);
        else this.getItems().subscribe();
        return res;
      }))
  
    }

    delete(id: number) {
      return this._http.delete('/control-sub-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','delete_success');
          this.getItems(false,null,true).subscribe(resp=>{

            if(resp.from == null){
              ControlSubcategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/control-sub-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/control-sub-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/control-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_sub_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/control-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_sub_category')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/control-sub-categories/share',data).pipe(
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
      return this._http.post('/control-sub-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }
  
    sortControlSubCategoryList(type:string, text:string) {
      if (!ControlSubcategoryMasterStore.orderBy) {
        ControlSubcategoryMasterStore.orderBy = 'asc';
        ControlSubcategoryMasterStore.orderItem = type;
      }
      else{
        if (ControlSubcategoryMasterStore.orderItem == type) {
          if(ControlSubcategoryMasterStore.orderBy == 'asc') ControlSubcategoryMasterStore.orderBy = 'desc';
          else ControlSubcategoryMasterStore.orderBy = 'asc'
        }
        else{
          ControlSubcategoryMasterStore.orderBy = 'asc';
          ControlSubcategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
 
}
