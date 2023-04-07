import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {DocumentCategoryMasterStore} from 'src/app/stores/masters/knowledge-hub/document-category-store';
import { DocumentCategory,DocumentCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all: boolean = false): Observable<DocumentCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${DocumentCategoryMasterStore.currentPage}`;
        if (DocumentCategoryMasterStore.orderBy) params += `&order_by=${DocumentCategoryMasterStore.orderItem}&order=${DocumentCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(DocumentCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<DocumentCategoryPaginationResponse>('/document-categories' + (params ? params : '')).pipe(
        map((res: DocumentCategoryPaginationResponse) => {
          DocumentCategoryMasterStore.setDocumentCategories(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<DocumentCategory[]>{
      return this._http.get<DocumentCategory[]>('/document-categories?is_all=true').pipe(
        map((res: DocumentCategory[]) => {
          
          DocumentCategoryMasterStore.setAllDocumentCategories(res);
          return res;
        })
      );
    }

    saveItem(item: DocumentCategory) {
      return this._http.post('/document-categories', item).pipe(
        map((res:any )=> {
          DocumentCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'document_category_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe()
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: DocumentCategory): Observable<any> {
      return this._http.put('/document-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_category_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/document-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              DocumentCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/document-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/document-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/document-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/document-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_categories')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/document-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/document-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','document_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortDocumentCategorylList(type:string, text:string) {
      if (!DocumentCategoryMasterStore.orderBy) {
        DocumentCategoryMasterStore.orderBy = 'asc';
        DocumentCategoryMasterStore.orderItem = type;
      }
      else{
        if (DocumentCategoryMasterStore.orderItem == type) {
          if(DocumentCategoryMasterStore.orderBy == 'asc') DocumentCategoryMasterStore.orderBy = 'desc';
          else DocumentCategoryMasterStore.orderBy = 'asc'
        }
        else{
          DocumentCategoryMasterStore.orderBy = 'asc';
          DocumentCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}


