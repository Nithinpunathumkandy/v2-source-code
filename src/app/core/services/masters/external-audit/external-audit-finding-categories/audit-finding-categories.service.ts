import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { AuditFindingCategory,AuditFindingCategoryPaginationResponse } from 'src/app/core/models/masters/external-audit/audit-finding-categories';
import { AuditFindingCategoryMasterStore} from 'src/app/stores/masters/external-audit/audit-finding-categories-store';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class AuditFindingCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<AuditFindingCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditFindingCategoryMasterStore.currentPage}`;
        if (AuditFindingCategoryMasterStore.orderBy) params += `&order_by=${AuditFindingCategoryMasterStore.orderItem}&order=${AuditFindingCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(AuditFindingCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditFindingCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<AuditFindingCategoryPaginationResponse>('/external-audit/finding-categories' + (params ? params : '')).pipe(
        map((res: AuditFindingCategoryPaginationResponse) => {
          AuditFindingCategoryMasterStore.setAuditFindingCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<AuditFindingCategory[]> {
      return this._http.get<AuditFindingCategory[]>('/external-audit/finding-categories').pipe((
        map((res:AuditFindingCategory[])=>{
          AuditFindingCategoryMasterStore.setAllAuditFindingCategory(res);
          return res;
        })
      ))
    }

    saveItem(item: AuditFindingCategory) {
      return this._http.post('/external-audit/finding-categories', item).pipe(
        map((res:any )=> {
           AuditFindingCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: AuditFindingCategory): Observable<any> {
      return this._http.put('/external-audit/finding-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/external-audit/finding-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from == null){
              AuditFindingCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();

            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/external-audit/finding-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/external-audit/finding-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/external-audit/finding-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/external-audit/finding-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding_category')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/external-audit/finding-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'share_success');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/external-audit/finding-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortAuditFindinglList(type:string, text:string) {
      if (!AuditFindingCategoryMasterStore.orderBy) {
        AuditFindingCategoryMasterStore.orderBy = 'asc';
        AuditFindingCategoryMasterStore.orderItem = type;
      }
      else{
        if (AuditFindingCategoryMasterStore.orderItem == type) {
          if(AuditFindingCategoryMasterStore.orderBy == 'asc') AuditFindingCategoryMasterStore.orderBy = 'desc';
          else AuditFindingCategoryMasterStore.orderBy = 'asc'
        }
        else{
          AuditFindingCategoryMasterStore.orderBy = 'asc';
          AuditFindingCategoryMasterStore.orderItem = type;
        }
      }
    }

}

