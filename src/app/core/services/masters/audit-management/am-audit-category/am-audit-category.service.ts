import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditCategory, AuditCategoryPaginationResponse } from 'src/app/core/models/masters/audit-management/am-audit-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditCategoryMasterStore } from 'src/app/stores/masters/audit-management/am-audit-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditCategoryService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AuditCategoryPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditCategoryMasterStore.currentPage}`;
      if (AmAuditCategoryMasterStore.orderBy) params += `&order_by=${AmAuditCategoryMasterStore.orderItem}&order=${AmAuditCategoryMasterStore.orderBy}`;
    }
    if(AmAuditCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+AmAuditCategoryMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AuditCategoryPaginationResponse>('/am-audit-categories' + (params ? params : '')).pipe(
      map((res: AuditCategoryPaginationResponse) => {
        AmAuditCategoryMasterStore.setAuditCategory(res);
        return res;
      })
    );
  }

  saveItem(item: any) {
    return this._http.post('/am-audit-categories', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/am-audit-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/am-audit-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            AmAuditCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/am-audit-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/am-audit-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/am-audit-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/am-audit-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_category')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/am-audit-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-audit-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }
  searchAuditCategory(params){
    return this.getItems(params ? params : '').pipe(
      map((res: AuditCategoryPaginationResponse) => {
        AmAuditCategoryMasterStore.setAuditCategory(res);
        return res;
      })
    );
  }

  sortAmAuditCategoryList(type:string, text:string) {
    if (!AmAuditCategoryMasterStore.orderBy) {
      AmAuditCategoryMasterStore.orderBy = 'asc';
      AmAuditCategoryMasterStore.orderItem = type;
    }
    else{
      if (AmAuditCategoryMasterStore.orderItem == type) {
        if(AmAuditCategoryMasterStore.orderBy == 'asc') AmAuditCategoryMasterStore.orderBy = 'desc';
        else AmAuditCategoryMasterStore.orderBy = 'asc'
      }
      else{
        AmAuditCategoryMasterStore.orderBy = 'asc';
        AmAuditCategoryMasterStore.orderItem = type;
      }
    }
  }
}

