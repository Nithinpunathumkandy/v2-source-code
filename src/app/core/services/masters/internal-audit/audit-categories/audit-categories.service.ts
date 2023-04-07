import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {AuditCategory,AuditCategoryPaginationResponse} from 'src/app/core/models/masters/internal-audit/audit-categories';
import{AuditCategoryMasterStore} from 'src/app/stores/masters/internal-audit/audit-categories-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuditCategoriesService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<AuditCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditCategoryMasterStore.currentPage}`;
        if (AuditCategoryMasterStore.orderBy) params += `&order_by=${AuditCategoryMasterStore.orderItem}&order=${AuditCategoryMasterStore.orderBy}`;

      }
      if(additionalParams) params += additionalParams;
      if(AuditCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<AuditCategoryPaginationResponse>('/audit-categories' + (params ? params : '')).pipe(
        map((res: AuditCategoryPaginationResponse) => {
          AuditCategoryMasterStore.setAuditCategories(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AuditCategory[]>{
      return this._http.get<AuditCategory[]>('/audit-categories?is_all=true').pipe(
        map((res: AuditCategory[]) => {
          
          AuditCategoryMasterStore.setAllAuditCategories(res);
          return res;
        })
      );
    }

    saveItem(item: AuditCategory) {
      return this._http.post('/audit-categories', item).pipe(
        map((res:any )=> {
          AuditCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: AuditCategory): Observable<any> {
      return this._http.put('/audit-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/audit-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              AuditCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/audit-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/audit-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/audit-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/audit-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_category')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/audit-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/audit-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortAuditCategorylList(type:string, text:string) {
      if (!AuditCategoryMasterStore.orderBy) {
        AuditCategoryMasterStore.orderBy = 'asc';
        AuditCategoryMasterStore.orderItem = type;
      }
      else{
        if (AuditCategoryMasterStore.orderItem == type) {
          if(AuditCategoryMasterStore.orderBy == 'asc') AuditCategoryMasterStore.orderBy = 'desc';
          else AuditCategoryMasterStore.orderBy = 'asc'
        }
        else{
          AuditCategoryMasterStore.orderBy = 'asc';
          AuditCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}

