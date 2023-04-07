import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuditableItemCategory,AuditableItemCategoryPaginationResponse} from 'src/app/core/models/masters/internal-audit/auditable-item-category';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import{AuditItemCategoryMasterStore} from 'src/app/stores/masters/internal-audit/audit-item-category-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuditableItemCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<AuditableItemCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditItemCategoryMasterStore.currentPage}`;
        if (AuditItemCategoryMasterStore.orderBy) params += `&order_by=${AuditItemCategoryMasterStore.orderItem}&order=${AuditItemCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(AuditItemCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditItemCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<AuditableItemCategoryPaginationResponse>('/auditable-item-categories' + (params ? params : '')).pipe(
        map((res: AuditableItemCategoryPaginationResponse) => {
          AuditItemCategoryMasterStore.setAuditItemCategories(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AuditableItemCategory[]>{
      return this._http.get<AuditableItemCategory[]>('/auditable-item-categories?is_all=true').pipe(
        map((res: AuditableItemCategory[]) => {
          
          AuditItemCategoryMasterStore.setAllAuditItemCategories(res);
          return res;
        })
      );
    }

    saveItem(item: AuditableItemCategory) {
      return this._http.post('/auditable-item-categories', item).pipe(
        map((res:any )=> {
          AuditItemCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: AuditableItemCategory): Observable<any> {
      return this._http.put('/auditable-item-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/auditable-item-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              AuditItemCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/auditable-item-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/auditable-item-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/auditable-item-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditable_item_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/auditable-item-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditable_item_categories')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/auditable-item-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/auditable-item-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortAuditlList(type:string, text:string) {
      if (!AuditItemCategoryMasterStore.orderBy) {
        AuditItemCategoryMasterStore.orderBy = 'asc';
        AuditItemCategoryMasterStore.orderItem = type;
      }
      else{
        if (AuditItemCategoryMasterStore.orderItem == type) {
          if(AuditItemCategoryMasterStore.orderBy == 'asc') AuditItemCategoryMasterStore.orderBy = 'desc';
          else AuditItemCategoryMasterStore.orderBy = 'asc'
        }
        else{
          AuditItemCategoryMasterStore.orderBy = 'asc';
          AuditItemCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    
}
