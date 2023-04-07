import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RootCauseSubCategory,RootCauseSubCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-sub-categories';
import{RootCauseSubCategoryMasterStore} from 'src/app/stores/masters/internal-audit/root-cause-sub-categories-store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class RootCauseSubCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


getItems(getAll: boolean = false,additionalParams?:string, is_all: boolean = false): Observable<RootCauseSubCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RootCauseSubCategoryMasterStore.currentPage}`;
        if (RootCauseSubCategoryMasterStore.orderBy) params += `&order_by=${RootCauseSubCategoryMasterStore.orderItem}&order=${RootCauseSubCategoryMasterStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(RootCauseSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+RootCauseSubCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<RootCauseSubCategoryPaginationResponse>('/root-cause-sub-categories' + (params ? params : '')).pipe(
        map((res: RootCauseSubCategoryPaginationResponse) => {
          RootCauseSubCategoryMasterStore.setRootCauseSubCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<RootCauseSubCategory[]> {
      return this._http.get<RootCauseSubCategory[]>('/root-cause-sub-categories').pipe((
        map((res:RootCauseSubCategory[])=>{
          RootCauseSubCategoryMasterStore.setAllRootCauseSubCategory(res);
          return res;
        })
      ))
    }

    saveItem(item: RootCauseSubCategory) {
      return this._http.post('/root-cause-sub-categories', item).pipe(
        map((res:any )=> {
           RootCauseSubCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: RootCauseSubCategory): Observable<any> {
      return this._http.put('/root-cause-sub-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/root-cause-sub-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RootCauseSubCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/root-cause-sub-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/root-cause-sub-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/root-cause-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_sub_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/root-cause-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_sub_categories')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/root-cause-sub-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/root-cause-sub-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortRootCauseSubCategorylList(type:string, text:string) {
      if (!RootCauseSubCategoryMasterStore.orderBy) {
        RootCauseSubCategoryMasterStore.orderBy = 'asc';
        RootCauseSubCategoryMasterStore.orderItem = type;
      }
      else{
        if (RootCauseSubCategoryMasterStore.orderItem == type) {
          if(RootCauseSubCategoryMasterStore.orderBy == 'asc') RootCauseSubCategoryMasterStore.orderBy = 'desc';
          else RootCauseSubCategoryMasterStore.orderBy = 'asc'
        }
        else{
          RootCauseSubCategoryMasterStore.orderBy = 'asc';
          RootCauseSubCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }

}
