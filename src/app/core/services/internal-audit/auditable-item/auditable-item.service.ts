import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItem, AuditableItemPaginationResponse ,ImportProcess, ImportRisk } from 'src/app/core/models/internal-audit/auditable-item/auditable-item';
import { AuditableItemMasterStore } from 'src/app/stores/internal-audit/auditable-item/auditable-item-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
@Injectable({
  providedIn: 'root'
})
export class AuditableItemService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


    getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditableItemPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditableItemMasterStore.currentPage}&status=all`;
        if (AuditableItemMasterStore.orderBy) params += `&order_by=${AuditableItemMasterStore.orderItem}&order=${AuditableItemMasterStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditableItemMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditableItemMasterStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_item' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditableItemPaginationResponse>('/auditable-items' + (params ? params : '')).pipe(
        map((res: AuditableItemPaginationResponse) => {
          AuditableItemMasterStore.setAuditableItem(res);
          return res;
        })
      );
    }


    getItemsForAuditProgam(getAll: boolean = false, additionalParams?: string): Observable<AuditableItemPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditableItemMasterStore.currentPage}&status=active`;
        if (AuditableItemMasterStore.orderBy) params += `&order_by=${AuditableItemMasterStore.orderItem}&order=${AuditableItemMasterStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditableItemMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditableItemMasterStore.searchText;

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

    setAuditableItemId(id){
      AuditableItemMasterStore.setAuditableItemId(id)
    }


    getItem(id): Observable<AuditableItem> {
      return this._http.get<AuditableItem>('/auditable-items/'+id).pipe((
        map((res:AuditableItem)=>{
          AuditableItemMasterStore.setIndividualAuditableItem(res);
          return res;
        })
      ))
    }

    selectRequiredControls(controls) {
      
      var controlsToDisplay = [];
      for(let i of controls){
          let obj = { id:i.id,reference_code:i.reference_code,title: i.title, control_category_title: i.control_category_title,control_type_title: i.control_type_title, is_accordion_active:false}
            controlsToDisplay.push(obj);
     }
    
     AuditableItemMasterStore.addSelectedControls(controls,controlsToDisplay);
    }

    selectRequiredCheckList(checklist){
      var checklistToDisplay = [];
      for(let i of checklist){
        let obj = { id:i.id,title: i.title}
          checklistToDisplay.push(obj);
   }
   AuditableItemMasterStore.addSelectedChecklist(checklist,checklistToDisplay);

    }
  
    saveItem(item: any) {
      return this._http.post('/auditable-items', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'created_auditable_item');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    saveImportProcess(item:ImportProcess){
      return this._http.post('/auditable-items/processes/import', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );

    }

    saveImportRisk(item: ImportRisk){

      return this._http.post('/auditable-items/risks/import', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );

    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/auditable-items/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'updated_auditable_item');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    
    delete(id: number) {
      return this._http.delete('/auditable-items/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deleted_auditable_item');
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
          this._utilityService.showSuccessMessage('success', 'activate_auditable_item');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/auditable-items/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_auditable_item');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/auditable-items/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "AuditableItemTemplate.xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (AuditableItemMasterStore.orderBy) params += `?order=${AuditableItemMasterStore.orderBy}`;
      if (AuditableItemMasterStore.orderItem) params += `&order_by=${AuditableItemMasterStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_item' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/auditable-items/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "AuditableItem.xlsx");
        }
      )
    }

    importData(data){  
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/auditable-items/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('successfully','auditable_item_imported');
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
  
  
  