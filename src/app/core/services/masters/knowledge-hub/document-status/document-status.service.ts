import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable} from 'rxjs';
import {DocumentStatusMasterStore} from 'src/app/stores/masters/knowledge-hub/document-status-store';
import {DocumentStatus,DocumentStatusPaginationResponse} from 'src/app/core/models/masters/knowledge-hub/document-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentStatusService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false):Observable<DocumentStatusPaginationResponse>{
      let params='';
      if(!getAll){
        params=`?page=${DocumentStatusMasterStore.currentPage}`;
        if(DocumentStatusMasterStore.orderBy) params +=`&order_by=${DocumentStatusMasterStore.orderItem}&order=${DocumentStatusMasterStore.orderBy}`;
      }
      else {
        this.getAllItems();
      }

      if(additionalParams) params += additionalParams;
      if(DocumentStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentStatusMasterStore.searchText;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<DocumentStatusPaginationResponse>('/document-statuses' + (params ? params : '')).pipe(
        map((res: DocumentStatusPaginationResponse) => {
          DocumentStatusMasterStore.setDocumentStatus(res);
          
          
          return res;
        })
      );
    }

    getAllItems(): Observable<DocumentStatus[]>{
      return this._http.get<DocumentStatus[]>('/document-statuses?is_all=true').pipe(
        map((res: DocumentStatus[]) => {    
          DocumentStatusMasterStore.setAllDocumentStatus(res);
          
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/document-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_status')+".xlsx");
        }
      )
    }
    

    sortDocumentStatusList(type:string, text:string) {
      if (!DocumentStatusMasterStore.orderBy) {
        DocumentStatusMasterStore.orderBy = 'asc';
        DocumentStatusMasterStore.orderItem = type;
      }
      else{
        if (DocumentStatusMasterStore.orderItem == type) {
          if(DocumentStatusMasterStore.orderBy == 'asc') DocumentStatusMasterStore.orderBy = 'desc';
          else DocumentStatusMasterStore.orderBy = 'asc'
        }
        else{
          DocumentStatusMasterStore.orderBy = 'asc';
          DocumentStatusMasterStore.orderItem = type;
        }
      }
    }
}
