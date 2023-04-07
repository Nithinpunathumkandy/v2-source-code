import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Document, DocumentsFolder, DocumentsPageinationResponse,DocumentTypesPaginationResponse } from 'src/app/core/models/knowledge-hub/documents/documents';
import { DocumentDetails,FolderDetails,DocumentMappingDetails  } from 'src/app/core/models/knowledge-hub/documents/documentDetails';
import { Observable } from "rxjs";
import {DocumentsStore} from 'src/app/stores/knowledge-hub/documents/documents.store'
import { map } from 'rxjs/operators';
import { Documents } from 'src/app/core/models/bpm/process/processes';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }


  
  getAllItems(listType?, getAll: boolean = false, additionalParams: string = ''): Observable<DocumentsPageinationResponse> {
    let params = '';
    if (!getAll) {
      params = `page=${DocumentsStore.currentPage}&limit=${DocumentsStore.itemsPerPage}`;
      if (DocumentsStore.orderBy) params += `&order=${DocumentsStore.orderBy}`;
      if (DocumentsStore.orderItem) params += `&order_by=${DocumentsStore.orderItem}`;
      if (DocumentsStore.searchText) params += `&q=${DocumentsStore.searchText}`;
    }
    if (additionalParams) {
      params = (params == '') ? params + '?'+additionalParams : params + '&'+additionalParams;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'document-list' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<DocumentsPageinationResponse>('/documents'+ (listType?listType:'?') + (params ? params : ''))
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
        DocumentsStore.setDocuments(res);
          return res;
        })
      );
  }

  getItemsInFolder(getAll: boolean = false, resparams: string = '', docId): Observable<DocumentsPageinationResponse> {
    // !Side Menu Param indicates Public | Private(My Documents | Shared)
    let params = "";
    if (!getAll) {
      let lastElement = DocumentsStore.breadCrumbData[DocumentsStore.breadCrumbData.length - 1]
        params = `&page=${lastElement['currentPage']}&${DocumentsStore.itemsPerPage}`;
      if (DocumentsStore.orderBy) params += `&order=${DocumentsStore.orderBy}`;
      if (DocumentsStore.orderItem) params += `&order_by=${DocumentsStore.orderItem}`;
      if (DocumentsStore.searchText) params += `&q=${DocumentsStore.searchText}`;
    }
    if (resparams) {
      params = (params == '') ? params + '?'+resparams : params + '&'+resparams;
    }

    let sideMenu=''
    if (DocumentsStore.selectedSideMenu == 'public' || DocumentsStore.selectedSideMenu == 'private' || DocumentsStore.selectedSideMenu == 'shared') 
      sideMenu = `${DocumentsStore.selectedSideMenu}`
    else
      sideMenu=''
    return this._http
      .get<DocumentsPageinationResponse>('/documents'+(sideMenu?'/'+sideMenu+'?document_ids=':'?document_ids=')+ docId + (params ? params : '')+(resparams ? resparams : '') )
      .pipe(
        map((res: DocumentsPageinationResponse) => {
          DocumentsStore.setDocuments(res);
          return res;
        })
      );
  }

  //   /**
  //  * Update Document
  //  * @param id Isssue Id
  //  * @param document Document Details
  //  */
  updateItem(id, document): Observable<any> {
    return this._http.put('/documents/' + id, document).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_updated');
        // this.getAllItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  /**
   * Save Document
   * @param document Document Details
   */
  saveItem(document: Document) {
    return this._http.post('/documents', document).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_created');
        // this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }



  getItemById(id:number):Observable<DocumentDetails>{
    return this._http.get<DocumentDetails>('/documents/' + id).pipe(map((res: DocumentDetails) => {
      DocumentsStore.setDocumentDetails(res)
      return res;
    }))
  }

  getMappingDetails(id:number):Observable<DocumentMappingDetails>{
    return this._http.get<DocumentMappingDetails>('/documents/' + id+'/mapping').pipe(map((res: DocumentMappingDetails) => {
      DocumentsStore.setDocumentMappingDetails(res)
      return res;
    }))
  }
  
  // New Folder

  addFolder(documentFolder: DocumentsFolder) {
    return this._http.post('/folders',documentFolder).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'folder_created');
      // this.getAllItems("root=true").subscribe();
      return res;
    }))

  }

  // Quick Upload Save
  quickUpload(documents: Documents) {
    return this._http.post('/documents/quick-uploads',documents).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_created');
      return res;
    }))

  }
  
  renameFolder(folderData) {
    return this._http.put('/folders/'+ DocumentsStore.folderId + '/rename',folderData).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'folder_renamed');
      return res;
    }))

  }

  getFolderDetails(folderId:number):Observable<FolderDetails>{
    return this._http.get<FolderDetails>('/folders/' + folderId).pipe(map((res: FolderDetails) => {
      DocumentsStore.setFolderDetails(res)
      return res;
    }))
  }

  // Support File (Array)
  setSupportFile(imageDetails, url) {
    DocumentsStore.setSupportFile(imageDetails,url);
  }

  // Version File (Single)
  setVersionFile(imageDetails, url) {
    DocumentsStore.setVersionFile(imageDetails,url);
  }

  getSupportFiles() {
    return DocumentsStore.getSupportFile;
  }
  getVersionFile() {
    return DocumentsStore.getVersionFile;
  }

  // Delete Folder

  deleteFolder(id: number) {
    return this._http.delete('/folders/' + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "document_folder_deleted"
        );
        return res;
      })
    );
  }

  // Delete Frolder From Trash

  deleteFolderTrash(id: number) {
    return this._http.delete('/folders/' + id+'/delete-from-trash').pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "document_folder_deleted"
        );
        return res;
      })
    );
  }

  // Restore Folder

  restoreFolder(id: number) {
    return this._http.put('/folders/' + id +'/restore',null).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "document_folder_restored"
        );
        return res;
      })
    );
  }

  // Delete Document
  deleteDocument(id: number) {
    return this._http.delete('/documents/' + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "document_deleted"
        );
        return res;
      })
    );
  }

    // Delete Document From Trash
    deleteDocumentTrash(id: number) {
      return this._http.delete('/documents/' + id + '/delete-from-trash').pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "document_deleted"
          );
          return res;
        })
      );
    }

    // Restore Document

    restoreDocument(id: number) {
      return this._http.put('/folders/' + id +'/restore',null).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "document_restored"
          );
          return res;
        })
      );
  }


  // Starr Document

  starDocument(documentId: number) {
    return this._http.put('/documents/' + documentId + '/star', null).pipe(map((res) => {
      this._utilityService.showSuccessMessage(
        "success",
        "document_starred"
      );
      return res
    }))
  }

  // Starr Folder

  starFolder(documentId: number) {
    return this._http.put('/folders/' + documentId + '/star', null).pipe(map((res) => {
      this._utilityService.showSuccessMessage(
        "success",
        "folder_starred"
      );
      return res
    }))
  }

  // Unstarr Document

  unStarDocument(documentId: number) {
    return this._http.put('/documents/' + documentId + '/unstar', null).pipe(map((res) => {
      this._utilityService.showSuccessMessage(
        "success",
        "document_UnStarred"
      );
      return res
    }))
  }

  // Unstarr Folder

  unStarFolder(documentId: number) {
    return this._http.put('/folders/' + documentId + '/unstar', null).pipe(map((res) => {
      this._utilityService.showSuccessMessage(
        "success",
        "folder_UnStarred"
      );
      return res
    }))
  }

   /**
   * Sort Control List
   * @param type Sort By Variable
   */
  sortDocumentList(type, callList: boolean = true, listType) {
    if (!DocumentsStore.orderBy) {
      DocumentsStore.orderBy = 'asc';
      DocumentsStore.orderItem = type;
    }
    else{
      if (DocumentsStore.orderItem == type) {
        if(DocumentsStore.orderBy == 'asc') DocumentsStore.orderBy = 'desc';
        else DocumentsStore.orderBy = 'asc'
      }
      else{
        DocumentsStore.orderBy = 'asc';
        DocumentsStore.orderItem = type;
      }
    }
    
    if (callList) {
      if (DocumentsStore.documentId) {
        this.getItemsInFolder(false,'', DocumentsStore.documentId).subscribe()
      }
      else {
        switch (listType) {
          case "recent":
            this.getAllItems("/recent?").subscribe()
            break;
    
          case "starred":
            this.getAllItems("/starred?").subscribe(); 
            break;
    
          case "new":
            this.getAllItems("/new?").subscribe();
    
            break;
          
            case "doc_type":
              this.getAllItems(`?document_type_ids=${DocumentsStore.documentTypeId}&`).subscribe((res) => {
                  DocumentsStore.documentId = null;
                });  
            break;
            case "public":
              this.getAllItems("/public?public_root=true&").subscribe();
        
              break;
            
              case "private":
              this.getAllItems("/private?root=true&").subscribe();
        
              break;
            
              case "shared":
              this.getAllItems("/shared?shared_root=true&").subscribe();
        
            break;
            case "trash":
              // this.restoreFlag = true;
              this.getAllItems("/trash?").subscribe((res) => {
                  DocumentsStore.documentId = null;
                });
      
              break;
          default:
            break;
          }
      }
        
      } 


      
    }
  

  listDocumentType() {
    return this._http
      .get<DocumentTypesPaginationResponse>('/document-types')
      .pipe(
        map((res: DocumentTypesPaginationResponse) => {
          DocumentsStore.setDocumentTypes(res);
          return res;
        })
      );

  }

  generateTemplate() {
    this._http.get('/documents/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "DocumentTemplate.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/documents/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Document.xlsx");
      }
    )
  }

  importVersionContent(data,documentVersionId){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post(`/document-versions/${documentVersionId}/contents/import`,data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','content_imported');
        return res;
      })
    )
  }

  exportVersionContent(documentVersionId){
    this._http.get(`/document-versions/${documentVersionId}/contents/export`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "DocumentVersionContent.xlsx");
      }
    )
  }

  searchDocument(searchText):Observable<DocumentsPageinationResponse>{
    return this._http.get<DocumentsPageinationResponse>(`/documents?q=${searchText}`).pipe(map((res: DocumentsPageinationResponse) => {
      DocumentsStore.setSearchList(res)
      return res;
    }))
  }

  getAccessibleDocuments(){
    return this._http.get<any>(`/documents`).pipe(map((res: any) => {
      DocumentsStore.setTotalItems(res.total);
      return res;
    }))
  }

  updateFrequentReviewUpdates(comment){
    return this._http.post('/documents/'+`${DocumentsStore.documentId}/frequent-review-updates`,comment).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'kh_document_frequent_updated');
      return res;
    }))
  }

  getFrequentReviewUpdates(){
    return this._http.get<any>('/documents/'+`${DocumentsStore.documentId}/frequent-review-updates`).pipe(map(res=>{
      DocumentsStore.setReviewUpdate(res);
      return res;
    }))
  }

  saveDocumentControl(data){
    return this._http.post('/document-version-controls',data).pipe(map(res=>{
      //this._utilityService.showSuccessMessage('success', 'kh_document_frequent_updated');
      return res;
    }))
  }

  
  deleteDocumentControl(contenId,controlId){
    return this._http.delete('/document-versions/'+DocumentsStore.documentVersionId+'/contents/'+contenId+'/controls/'+controlId).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'kh_document_controls_deleted');
      return res;
    }))
  }

  shareDocument(docId: number, docVersionId: number, data) {
    return this._http.post(`/documents/${docId}/files/${docVersionId}/share`, data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','common_share_toast');
        return res;
      })
    );
  }


  changeDocumentVersion(docId: number, docVersionId: number) {
    return this._http.put(`/documents/${docId}/version/${docVersionId}/change `, null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_version_updated');
        return res;
      })
    );
  }

  // {{url}}/api/v1/document-versions/1330/contents/generate-pdf


  generateToPDF(){
    return this._http.post(`/document-versions/${DocumentsStore.documentVersionId}/contents/generate-pdf`, null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_pdf_generated');
        return res;
      })
    );
  }

  deleteProcessMapping(id) {
    return this._http.put('/documents/' +DocumentsStore.documentId +'/process-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'process_deleted_successfully');
        return res;
      })
    );
  }

  deleteRiskMapping(id) {
    return this._http.put('/documents/' +DocumentsStore.documentId +'/risk-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_deleted_successfully');
        return res;
      })
    );
  }

  deleteIssueMapping(id) {
    return this._http.put('/documents/' +DocumentsStore.documentId +'/issue-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'issue_deleted_successfully');
        return res;
      })
    );
  }

  deleteFindingsMapping(id) {
    return this._http.put('/documents/' +DocumentsStore.documentId +'/finding-mapping',id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'audit_finding_deleted_successfully');
        return res;
      })
    );
  }

  saveIssueForMapping(saveData): Observable<any>{
    
    return this._http.post('/documents/'+ DocumentsStore.documentId +'/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProcessForMapping(saveData): Observable<any>{
    return this._http.post('/documents/'+ DocumentsStore.documentId +'/process-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveRiskForMapping(saveData): Observable<any>{
    return this._http.post('/documents/'+ DocumentsStore.documentId +'/risk-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  

  

  saveFindingsForMapping(saveData): Observable<any>{
    return this._http.post('/documents/'+ DocumentsStore.documentId +'/finding-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  publishDocument(id: number) {
    return this._http.put("/documents/"+ id+'/publish','').pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "documents_published_successfully");

        return res;
      })
    );
  }


}
