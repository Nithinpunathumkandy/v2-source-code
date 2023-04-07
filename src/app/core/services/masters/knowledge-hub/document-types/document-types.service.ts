import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {DocumentTypeMasterStore} from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypes,DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string,status: boolean = false): Observable<DocumentTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${DocumentTypeMasterStore.currentPage}`;
        if (DocumentTypeMasterStore.orderBy) params += `&order_by=d${DocumentTypeMasterStore.orderItem}&order=${DocumentTypeMasterStore.orderBy}`;

      }
      else{
        this.getAllItems();
      }
     
      if(additionalParams) {
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(DocumentTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentTypeMasterStore.searchText;

      return this._http.get<DocumentTypesPaginationResponse>('/document-types' + (params ? params : '')).pipe(
        map((res: DocumentTypesPaginationResponse) => {
          DocumentTypeMasterStore.setDocumentType(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<DocumentTypes[]>{
      return this._http.get<DocumentTypes[]>('/document-types?is_all=true').pipe(
        map((res: DocumentTypes[]) => {
          
          DocumentTypeMasterStore.setAllDocumenTypes(res);
          return res;
        })
      );
    }

    saveItem(item: DocumentTypes) {
      return this._http.post('/document-types', item).pipe(
        map((res:any )=> {
          DocumentTypeMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'document_type_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: DocumentTypes): Observable<any> {
      return this._http.put('/document-types/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_type_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/document-types/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_type_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              DocumentTypeMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/document-types/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_type_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/document-types/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_type_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/document-types/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_type_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/document-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_types')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/document-types/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/document-types/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','document_type_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }


    sortDocumentTypesList(type:string, text:string) {
      if (!DocumentTypeMasterStore.orderBy) {
        DocumentTypeMasterStore.orderBy = 'asc';
        DocumentTypeMasterStore.orderItem = type;
      }
      else{
        if (DocumentTypeMasterStore.orderItem == type) {
          if(DocumentTypeMasterStore.orderBy == 'asc') DocumentTypeMasterStore.orderBy = 'desc';
          else DocumentTypeMasterStore.orderBy = 'asc'
        }
        else{
          DocumentTypeMasterStore.orderBy = 'asc';
          DocumentTypeMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}



