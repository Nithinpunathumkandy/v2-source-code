import { Injectable } from '@angular/core';
import { DocumentChangeRequestType , DocumentChangeRequestTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-change-request-type';
import {DocumentChangeRequestTypesMasterStore} from 'src/app/stores/masters/knowledge-hub/document-change-request-type-store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentChangeRequestTypeService {

  constructor(private _http: HttpClient) { }

  getAllItems(getAll:boolean = false, additionalParams?:string,is_all: boolean = false): Observable<DocumentChangeRequestTypePaginationResponse> {
    let params = '';
    if(!getAll){
      params = `?page=${DocumentChangeRequestTypesMasterStore.currentPage}`;
      if(DocumentChangeRequestTypesMasterStore.orderBy) params+= `&order_by=${DocumentChangeRequestTypesMasterStore.orderItem}&order=${DocumentChangeRequestTypesMasterStore.orderBy}`;
    }

    if(additionalParams) params+=additionalParams;
    if(DocumentChangeRequestTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentChangeRequestTypesMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<DocumentChangeRequestTypePaginationResponse>('/document-change-request-types' + (params ? params : '')).pipe((
      map((res:DocumentChangeRequestTypePaginationResponse)=>{
        DocumentChangeRequestTypesMasterStore.setDocumentChangeRequestType(res);
        return res;
      })
    ))
  }



  sortDocumentChangeRequestTypesList(type:string, text:string) {
    if (!DocumentChangeRequestTypesMasterStore.orderBy) {
      DocumentChangeRequestTypesMasterStore.orderBy = 'asc';
      DocumentChangeRequestTypesMasterStore.orderItem = type;
    }
    else {
      if (DocumentChangeRequestTypesMasterStore.orderItem == type) {
        if (DocumentChangeRequestTypesMasterStore.orderBy == 'asc') DocumentChangeRequestTypesMasterStore.orderBy = 'desc';
        else DocumentChangeRequestTypesMasterStore.orderBy = 'asc'
      }
      else {
        DocumentChangeRequestTypesMasterStore.orderBy = 'asc';
        DocumentChangeRequestTypesMasterStore.orderItem = type;
      }
    }
    // if (!text)
    //   this.getAllItems().subscribe();
    // else
    //   this.getAllItems(false, `&q=${text}`).subscribe();
  }

}

