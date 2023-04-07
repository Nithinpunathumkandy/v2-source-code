import { Injectable } from '@angular/core';
import {DocumentSubSubCategoryMasterStore} from 'src/app/stores/masters/knowledge-hub/document-sub-sub-categories-store';
import { DocumentSubSubCategory,DocumentSubSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-sub-categories';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentSubSubCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<DocumentSubSubCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${DocumentSubSubCategoryMasterStore.currentPage}`;
        if (DocumentSubSubCategoryMasterStore.orderBy) params += `&order_by=${DocumentSubSubCategoryMasterStore.orderItem}&order=${DocumentSubSubCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(DocumentSubSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentSubSubCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<DocumentSubSubCategoryPaginationResponse>('/document-sub-sub-categories' + (params ? params : '')).pipe(
        map((res: DocumentSubSubCategoryPaginationResponse) => {
          DocumentSubSubCategoryMasterStore.setDocumentSubSubCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<DocumentSubSubCategory[]>{
      return this._http.get<DocumentSubSubCategory[]>('/document-sub-sub-categories?is_all=true').pipe(
        map((res: DocumentSubSubCategory[]) => {
          
          DocumentSubSubCategoryMasterStore.setAllDocumentSubSubCategories(res);
          return res;
        })
      );
    }

    saveItem(item: DocumentSubSubCategory) {
      return this._http.post('/document-sub-sub-categories', item).pipe(
        map((res:any )=> {
          DocumentSubSubCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'document_sub_sub_category_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: DocumentSubSubCategory): Observable<any> {
      return this._http.put('/document-sub-sub-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_sub_category_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/document-sub-sub-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_sub_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              DocumentSubSubCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/document-sub-sub-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_sub_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/document-sub-sub-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_sub_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/document-sub-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_sub_sub_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/document-sub-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_sub_sub_categories')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/document-sub-sub-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/document-sub-sub-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','document_sub_sub_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortDocumentSubSubCategoryList(type:string, text:string) {
      if (!DocumentSubSubCategoryMasterStore.orderBy) {
        DocumentSubSubCategoryMasterStore.orderBy = 'asc';
        DocumentSubSubCategoryMasterStore.orderItem = type;
      }
      else{
        if (DocumentSubSubCategoryMasterStore.orderItem == type) {
          if(DocumentSubSubCategoryMasterStore.orderBy == 'asc') DocumentSubSubCategoryMasterStore.orderBy = 'desc';
          else DocumentSubSubCategoryMasterStore.orderBy = 'asc'
        }
        else{
          DocumentSubSubCategoryMasterStore.orderBy = 'asc';
          DocumentSubSubCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}





