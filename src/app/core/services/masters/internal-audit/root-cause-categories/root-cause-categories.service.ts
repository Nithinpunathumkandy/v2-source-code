import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RootCauseCategory,RootCauseCategoryPaginationResponse } from 'src/app/core/models/masters/internal-audit/root-cause-categories';
import{RootCauseCategoryMasterStore} from 'src/app/stores/masters/internal-audit/root-cause-categories-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class RootCauseCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, is_all: boolean = false): Observable<RootCauseCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RootCauseCategoryMasterStore.currentPage}`;
        if (RootCauseCategoryMasterStore.orderBy) params += `&order_by=${RootCauseCategoryMasterStore.orderItem}&order=${RootCauseCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(RootCauseCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+RootCauseCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<RootCauseCategoryPaginationResponse>('/root-cause-categories' + (params ? params : '')).pipe(
        map((res: RootCauseCategoryPaginationResponse) => {
          RootCauseCategoryMasterStore.setRootCauseCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<RootCauseCategory[]> {
      return this._http.get<RootCauseCategory[]>('/root-cause-categories').pipe((
        map((res:RootCauseCategory[])=>{
          RootCauseCategoryMasterStore.setAllRootCauseCategory(res);
          return res;
        })
      ))
    }

    saveItem(item: RootCauseCategory) {
      return this._http.post('/root-cause-categories', item).pipe(
        map((res:any )=> {
          RootCauseCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: RootCauseCategory): Observable<any> {
      return this._http.put('/root-cause-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/root-cause-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RootCauseCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/root-cause-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/root-cause-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/root-cause-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/root-cause-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('root_cause_categories')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/root-cause-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/root-cause-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortRootCauseCategorylList(type:string, text:string) {
      if (!RootCauseCategoryMasterStore.orderBy) {
        RootCauseCategoryMasterStore.orderBy = 'asc';
        RootCauseCategoryMasterStore.orderItem = type;
      }
      else{
        if (RootCauseCategoryMasterStore.orderItem == type) {
          if(RootCauseCategoryMasterStore.orderBy == 'asc') RootCauseCategoryMasterStore.orderBy = 'desc';
          else RootCauseCategoryMasterStore.orderBy = 'asc'
        }
        else{
          RootCauseCategoryMasterStore.orderBy = 'asc';
          RootCauseCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
   
    getLastInserted(){
      return RootCauseCategoryMasterStore.LastInsertedId
     
    }

}
