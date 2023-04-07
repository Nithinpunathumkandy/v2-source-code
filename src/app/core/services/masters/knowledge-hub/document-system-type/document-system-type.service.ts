import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentSystemType , DocumentSystemTypePaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-system-type';
import { DocumentSystemTypeStore } from 'src/app/stores/masters/knowledge-hub/document-system-type.store';
@Injectable({
  providedIn: 'root'
})
export class DocumentSystemTypeService {


  constructor(private _http: HttpClient) { }


  getAllItems(getAll:boolean = false, additionalParams?:string,is_all:boolean=false): Observable<DocumentSystemTypePaginationResponse> {
    let params = '';
    if(!getAll){
      params = `?page=${DocumentSystemTypeStore.currentPage}`;
      if(DocumentSystemTypeStore.orderBy) params+= `&order_by=ref_no&order=${DocumentSystemTypeStore.orderBy}`;
    }

    if(additionalParams) params+=additionalParams;
    if(DocumentSystemTypeStore.searchText) params += (params ? '&q=' : '?q=')+DocumentSystemTypeStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<DocumentSystemTypePaginationResponse>('/knowledge-hub-setting-types' + (params ? params : '')).pipe((
      map((res:DocumentSystemTypePaginationResponse)=>{
        DocumentSystemTypeStore.setDocumentSystemType(res);
        return res;
      })
    ))
}

searchDocumentAccessTypes(params){
  return this.getAllItems(false,params ? params : '').pipe(
    map((res: DocumentSystemTypePaginationResponse) => {
      DocumentSystemTypeStore.setAllDocumentSystemTypes(res['data']);
      return res;
    })
  );
}



  sortDocumentAccessTypesList(type:string, text:string) {
    if (!DocumentSystemTypeStore.orderBy) {
      DocumentSystemTypeStore.orderBy = 'asc';
      DocumentSystemTypeStore.orderItem = type;
    }
    else {
      if (DocumentSystemTypeStore.orderItem == type) {
        if (DocumentSystemTypeStore.orderBy == 'asc') DocumentSystemTypeStore.orderBy = 'desc';
        else DocumentSystemTypeStore.orderBy = 'asc'
      }
      else {
        DocumentSystemTypeStore.orderBy = 'asc';
        DocumentSystemTypeStore.orderItem = type;
      }
    }
   this.getAllItems(false, `&q=${text}`).subscribe();
  }
}
