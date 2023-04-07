import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DocumentAccessTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-access-type';
import {DocumentAccessTypeMasterStore} from 'src/app/stores/masters/knowledge-hub/document-access-type-store';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DocumentAccessTypeService {

  constructor(private _http: HttpClient) { }


    getAllItems(getAll:boolean = false, additionalParams?:string,is_all:boolean=false): Observable<DocumentAccessTypePaginationResponse> {
      let params = '';
      if(!getAll){
        params = `?page=${DocumentAccessTypeMasterStore.currentPage}`;
        if(DocumentAccessTypeMasterStore.orderBy) params+= `&order_by=${DocumentAccessTypeMasterStore.orderItem}&order=${DocumentAccessTypeMasterStore.orderBy}`;
      }

      if(additionalParams) params+=additionalParams;
      if(DocumentAccessTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentAccessTypeMasterStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<DocumentAccessTypePaginationResponse>('/document-access-types' + (params ? params : '')).pipe((
        map((res:DocumentAccessTypePaginationResponse)=>{
          DocumentAccessTypeMasterStore.setDocumentAccessType(res);
          return res;
        })
      ))
  }
  
  searchDocumentAccessTypes(params){
    return this.getAllItems(false,params ? params : '').pipe(
      map((res: DocumentAccessTypePaginationResponse) => {
        DocumentAccessTypeMasterStore.setAllDocumentAccessTypes(res['data']);
        return res;
      })
    );
  }



    sortDocumentAccessTypesList(type:string, text:string) {
      if (!DocumentAccessTypeMasterStore.orderBy) {
        DocumentAccessTypeMasterStore.orderBy = 'asc';
        DocumentAccessTypeMasterStore.orderItem = type;
      }
      else {
        if (DocumentAccessTypeMasterStore.orderItem == type) {
          if (DocumentAccessTypeMasterStore.orderBy == 'asc') DocumentAccessTypeMasterStore.orderBy = 'desc';
          else DocumentAccessTypeMasterStore.orderBy = 'asc'
        }
        else {
          DocumentAccessTypeMasterStore.orderBy = 'asc';
          DocumentAccessTypeMasterStore.orderItem = type;
        }
      }
      // if (!text)
      //   this.getAllItems().subscribe();
      // else
      //   this.getAllItems(false, `&q=${text}`).subscribe();
    }

}

