import { Injectable } from '@angular/core';
import {DocumentSubCategoryMasterStore} from 'src/app/stores/masters/knowledge-hub/document-sub-categories-store';
import { DocumentSubCategory,DocumentSubCategoryPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-sub-categories';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentSubCategoriesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<DocumentSubCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${DocumentSubCategoryMasterStore.currentPage}`;
        if (DocumentSubCategoryMasterStore.orderBy) params += `&order_by=${DocumentSubCategoryMasterStore.orderItem}&order=${DocumentSubCategoryMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(DocumentSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentSubCategoryMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<DocumentSubCategoryPaginationResponse>('/document-sub-categories' + (params ? params : '')).pipe(
        map((res: DocumentSubCategoryPaginationResponse) => {
          DocumentSubCategoryMasterStore.setDocumentSubCategory(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<DocumentSubCategory[]>{
      return this._http.get<DocumentSubCategory[]>('/document-sub-categories?is_all=true').pipe(
        map((res: DocumentSubCategory[]) => {
          
          DocumentSubCategoryMasterStore.setAllDocumentSubCategories(res);
          return res;
        })
      );
    }

    saveItem(item: DocumentSubCategory) {
      return this._http.post('/document-sub-categories', item).pipe(
        map((res:any )=> {
          DocumentSubCategoryMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'document_sub_category_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: DocumentSubCategory): Observable<any> {
      return this._http.put('/document-sub-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_category_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/document-sub-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              DocumentSubCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/document-sub-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/document-sub-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_sub_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/document-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_sub_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/document-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_sub_categories')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/document-sub-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/document-families/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','document_sub_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortDocumentSubCategoryList(type:string, text:string) {
      if (!DocumentSubCategoryMasterStore.orderBy) {
        DocumentSubCategoryMasterStore.orderBy = 'asc';
        DocumentSubCategoryMasterStore.orderItem = type;
      }
      else{
        if (DocumentSubCategoryMasterStore.orderItem == type) {
          if(DocumentSubCategoryMasterStore.orderBy == 'asc') DocumentSubCategoryMasterStore.orderBy = 'desc';
          else DocumentSubCategoryMasterStore.orderBy = 'asc'
        }
        else{
          DocumentSubCategoryMasterStore.orderBy = 'asc';
          DocumentSubCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}





