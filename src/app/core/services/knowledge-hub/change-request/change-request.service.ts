import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ChangeRequestPaginationResponse, ChangeRequest,ChangeRequestDetails } from 'src/app/core/models/knowledge-hub/change-request/change-request'
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class ChangeRequestService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }


  getAllItems(getAll: boolean = false, additionalParams: string = '', status: boolean = false): Observable<ChangeRequestPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${changeRequestStore.currentPage}`;
      if (changeRequestStore.orderBy) params += `&order=${changeRequestStore.orderBy}`;
      if (changeRequestStore.orderItem) params += `&order_by=${changeRequestStore.orderItem}`;
      if (changeRequestStore.searchText) params += `&q=${changeRequestStore.searchText}`;
    }
    if (additionalParams) {
      params = (params == '') ? params + '?'+additionalParams : params + '&'+additionalParams;
    }

    if(status) 
    params = (params == '') ? params + '?status=all' : params + '&status=all';
    if(RightSidebarLayoutStore.filterPageTag = 'document-request' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<ChangeRequestPaginationResponse>('/document-change-requests'+  (params ? params : ''))
      .pipe(
        map((res: ChangeRequestPaginationResponse) => {
          changeRequestStore.setChangeRequestData(res);
          return res;
        })
      );
  }

  
  updateItem(id, requestData: ChangeRequest): Observable<any> {
    return this._http.put('/document-change-requests/' + id, requestData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'change_request_updated');
        return res;
      })
    );
  }

  
  saveItem(requestData: ChangeRequest) {
    return this._http.post('/document-change-requests', requestData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'change_request_created');
        return res;
      })
    );
  }



  // getItemById(id:number):Observable<DocumentDetails>{
  //   return this._http.get<DocumentDetails>('/documents/' + id).pipe(map((res: DocumentDetails) => {
  //     DocumentsStore.setDocumentDetails(res)
  //     return res;
  //   }))
  // }
  
  getItemById(id:number):Observable<ChangeRequestDetails>{
    return this._http.get<ChangeRequestDetails>('/document-change-requests/' + id).pipe(map((res:ChangeRequestDetails) => {
      changeRequestStore.setRequestDetails(res)
      return res;
    }))
  }

  
  delete(id: number) {
    return this._http.delete("/document-change-requests/" + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'change_request_deleted');
        this.getAllItems().subscribe(resp => {
          if (resp.from == null) {        
            changeRequestStore.setCurrentPage(resp.current_page-1);
            this.getAllItems().subscribe();
          }
        });
        return res;
      })
    );
  }
  

  generateTemplate() {
    this._http.get('/document-change-requests/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "ChangeRequestTemplate.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/document-change-requests/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_change_requests')+".xlsx");
      }
    )
  }


  // New File (Single)
  setNewDocument(imageDetails, url) {
    changeRequestStore.setNewDocument(imageDetails,url);
  }


  getNewDocument() {
    return changeRequestStore.getNewDocument;
  }


  sortControlList(type, callList: boolean = true){
    if(!changeRequestStore.orderBy){
        changeRequestStore.orderBy = "asc";
        changeRequestStore.orderItem = type
    }else{
      if(changeRequestStore.orderItem == type){
        if(changeRequestStore.orderBy == "asc") changeRequestStore.orderBy = 'desc';
        else changeRequestStore.orderBy = 'asc'
      }else{
        changeRequestStore.orderBy = 'asc';
        changeRequestStore.orderItem = type

      }
    }
    // if (callList)
    // this.getAllItems(false,'&status=all').subscribe();

  }


}
