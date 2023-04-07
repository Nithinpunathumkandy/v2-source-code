import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceRegisterDetails } from 'src/app/core/models/compliance-management/compliance-register/compliance-register';
import { DocumentDetails } from 'src/app/core/models/knowledge-hub/documents/documentDetails';
import { DocumentsPageinationResponse } from 'src/app/core/models/knowledge-hub/documents/documents';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MasterListDocumentStore } from 'src/app/stores/knowledge-hub/master-list-document/masterListDocument.store';

@Injectable({
  providedIn: 'root'
})
export class MdlService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService
  ) { }

  getAllItems(listType?,getAll: boolean = false, additionalParams: string = ''): Observable<DocumentsPageinationResponse> {
    let params = '';
    if (!getAll) {
      params = `page=${MasterListDocumentStore.currentPage}&limit=${MasterListDocumentStore.itemsPerPage}`;
      if (MasterListDocumentStore.orderBy) params += `&order=${MasterListDocumentStore.orderBy}`;
      if (MasterListDocumentStore.orderItem) params += `&order_by=${MasterListDocumentStore.orderItem}`;
      if (MasterListDocumentStore.searchText) params += `&q=${MasterListDocumentStore.searchText}`;
    }
    if (additionalParams) {
      params = (params == '') ? params + '?'+additionalParams : params + '&'+additionalParams;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'document-list' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<DocumentsPageinationResponse>('/master-documents' + (listType?listType:'?')+ (params ? params : ''))
      .pipe(
        map((res: any) => {
          if (res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i]['is_workflow'] = typeof (res.data[i]['is_workflow']) == "string" ? parseInt(res.data[i]['is_workflow']) : res.data[i]['is_workflow'];
                res.data[i]['id'] = typeof (res.data[i]['id']) == "string" ? parseInt(res.data[i]['id']) : res.data[i]['id'];
                res.data[i]['is_folder'] = typeof (res.data[i]['is_folder']) == "string" ? parseInt(res.data[i]['is_folder']) : res.data[i]['is_folder'];
                res.data[i]['document_access_type_id'] = typeof (res.data[i]['document_access_type_id']) == "string" ? parseInt(res.data[i]['document_access_type_id']) : res.data[i]['is_workflow'];
                res.data[i]['document_type_id'] = typeof (res.data[i]['document_type_id']) == "string" ? parseInt(res.data[i]['document_type_id']) : res.data[i]['document_type_id'];
                res.data[i]['document_version_id'] = typeof (res.data[i]['document_version_id']) == "string" ? parseInt(res.data[i]['document_version_id']) : res.data[i]['document_version_id'];
                res.data[i]['size'] = typeof (res.data[i]['size']) == "string" ? parseInt(res.data[i]['size']) : res.data[i]['size'];
                res.data[i]['is_latest'] = typeof (res.data[i]['is_latest']) == "string" ? parseInt(res.data[i]['is_latest']) : res.data[i]['is_latest'];
              }
          }
          MasterListDocumentStore.setDocuments(res);
          return res;
        })
      );
  }

  setDocument(imageDetails,url){
    MasterListDocumentStore.setDocument(imageDetails,url);
  }

  saveItem(document) {
    return this._http.post('/master-documents', document).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_created');
        return res;
      })
    );
  }
  updateDocument(documentId,document) {
    return this._http.put('/master-documents/'+documentId, document).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_updated');
        return res;
      })
    );
  }
  renewDocument(documentId,document: Document) {
    return this._http.put('/master-documents/'+documentId+'/renew', document).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_renewed');
        return res;
      })
    );
  }

  reviewDocument(documentId,document: Document) {
    return this._http.put('/master-documents/'+documentId+'/review', document).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_reviewed');
        return res;
      })
    );
  }

  getDocumentReviewHistory(documentId){
    return this._http.get<ComplianceRegisterDetails>('/master-documents/'+documentId+'/review-history').pipe((
      map((res)=>{
        MasterListDocumentStore.setDocumentHistory(res);
        return res;
      })
    ))
  }

    // Delete Document
    deleteDocument(id: number) {
      return this._http.delete('/master-documents/' + id).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "document_deleted"
          );
          return res;
        })
      );
    }
    exportToExcel() {
      this._http.get('/master-documents/export?order=desc&order_by=documents.id', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "Corporate Documents.xlsx");
        }
      )
    }

  getItemById(id:number):Observable<DocumentDetails>{
    return this._http.get<DocumentDetails>('/master-documents/' + id).pipe(map((res: DocumentDetails) => {

      MasterListDocumentStore.setDocumentDetails(res)
      return res;
    }))
  }

  sortDocumentList(type, callList: boolean = true) {
    if (!MasterListDocumentStore.orderBy) {
      MasterListDocumentStore.orderBy = 'asc';
      MasterListDocumentStore.orderItem = type;
    }
    else{
      if (MasterListDocumentStore.orderItem == type) {
        if(MasterListDocumentStore.orderBy == 'asc') MasterListDocumentStore.orderBy = 'desc';
        else MasterListDocumentStore.orderBy = 'asc'
      }
      else{
        MasterListDocumentStore.orderBy = 'asc';
        MasterListDocumentStore.orderItem = type;
      }
    }
    
    if (callList) {
              this.getAllItems().subscribe();
          }
      
      } 

      searchDocument(searchText):Observable<DocumentsPageinationResponse>{
        return this._http.get<DocumentsPageinationResponse>(`/master-documents?q=${searchText}`).pipe(map((res: DocumentsPageinationResponse) => {
          MasterListDocumentStore.setSearchList(res)
          return res;
        }))
      }

      
    


}
