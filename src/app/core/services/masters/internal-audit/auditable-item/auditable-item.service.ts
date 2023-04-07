import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItem, AuditableItemPaginationResponse } from 'src/app/core/models/masters/internal-audit/auditable-item';
import { AuditableItemMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
@Injectable({
  providedIn: 'root'
})
export class AuditableItemService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditableItemPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditableItemMasterStore.currentPage}&status=all`;
        if (AuditableItemMasterStore.orderBy) params += `order_by=${AuditableItemMasterStore.orderItem}&order=${AuditableItemMasterStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditableItemMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditableItemMasterStore.searchText;
      // if(RightSidebarLayoutStore.filterPageTag == 'audit_item' && RightSidebarLayoutStore.filtersAsQueryString)
      // params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditableItemPaginationResponse>('/auditable-items' + (params ? params : '')).pipe(
        map((res: AuditableItemPaginationResponse) => {
          AuditableItemMasterStore.setAuditableItem(res);
          return res;
        })
      );
    }
  
    getAllItems(): Observable<AuditableItem[]>{
      return this._http.get<AuditableItem[]>('/auditable-items?is_all=true').pipe(
        map((res: AuditableItem[]) => {
          
          AuditableItemMasterStore.setAllAuditableItem(res);
          return res;
        })
      );
    }


    setDocumentDetails(imageDetails,url){
      AuditableItemMasterStore.setDocumentDetails(imageDetails,url);
    }


    getItem(id): Observable<AuditableItem> {
      return this._http.get<AuditableItem>('/auditable-items/'+id).pipe((
        map((res:AuditableItem)=>{
          AuditableItemMasterStore.setIndividualAuditableItem(res);
          return res;
        })
      ))
    }
  
    saveItem(item: AuditableItem) {
      return this._http.post('/auditable-items', item).pipe(
        map((res:any )=> {
          AuditableItemMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'auditable_item_added');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: AuditableItem): Observable<any> {
      return this._http.put('/auditable-items/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'auditable_item_updated');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    
    delete(id: number) {
      return this._http.delete('/auditable-items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'auditable_item_deleted');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditableItemMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
  
          return res;
        })
      );
    }
  
    activate(id: number) {
      return this._http.put('/auditable-items/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'auditable_item_activated');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/auditable-items/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'auditable_item_deactivated');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/auditable-items/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditable_item_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/auditable-items/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditable_item')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/auditable-items/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/auditable-items/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','auditable_item_imported');
          this.getItems().subscribe();
          return res;
        })
      )
    }
  
    sortAuditableItemlList(type:string, text:string) {
      if (!AuditableItemMasterStore.orderBy) {
        AuditableItemMasterStore.orderBy = 'asc';
        AuditableItemMasterStore.orderItem = type;
      }
      else{
        if (AuditableItemMasterStore.orderItem == type) {
          if(AuditableItemMasterStore.orderBy == 'asc') AuditableItemMasterStore.orderBy = 'desc';
          else AuditableItemMasterStore.orderBy = 'asc'
        }
        else{
          AuditableItemMasterStore.orderBy = 'asc';
          AuditableItemMasterStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }
    
  }
  
  
  