import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditDocumentTypes, AmAuditDocumentTypesPaginationResponse, AmAuditSingle } from 'src/app/core/models/masters/audit-management/am-audit-document-types';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditDocumentTypesMasterStore } from 'src/app/stores/masters/audit-management/am-audit-document-types-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditDocumentTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  
  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AmAuditDocumentTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditDocumentTypesMasterStore.currentPage}`;
      if (AmAuditDocumentTypesMasterStore.orderBy) params += `&order_by=${AmAuditDocumentTypesMasterStore.orderItem}&order=${AmAuditDocumentTypesMasterStore.orderBy}`;
    }
    if(AmAuditDocumentTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+AmAuditDocumentTypesMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AmAuditDocumentTypesPaginationResponse>('/am-audit-document-types'+ (params ? params : '')).pipe(
      map((res: AmAuditDocumentTypesPaginationResponse) => {
        AmAuditDocumentTypesMasterStore.setAmAuditDocumentTypes(res);
        return res;
      })
    );
  }
  
  getAllItems(): Observable<AmAuditDocumentTypes[]> {
    return this._http.get<AmAuditDocumentTypes[]>('/am-audit-document-types?is_all=true').pipe(
      map((res: AmAuditDocumentTypes[]) => {

        AmAuditDocumentTypesMasterStore.setAllAmAuditDocumentTypes(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<AmAuditSingle> {
    return this._http.get<AmAuditSingle>('/am-audit-document-types/' + id).pipe(
      map((res: AmAuditSingle) => {
        AmAuditDocumentTypesMasterStore.setindividualAmAudit(res)
        return res;
      })
    );
  }

  
  updateItem(id, item: any): Observable<any> {
    return this._http.put('/am-audit-document-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }
  
  
  saveItem(item: any) {
    return this._http.post('/am-audit-document-types', item).pipe(
      map(res => {
        console.log(res);
        AmAuditDocumentTypesMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/am-audit-document-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_document_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/am-audit-document-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_document_types')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/am-audit-document-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-audit-document-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/am-audit-document-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/am-audit-document-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-document-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp => {
          if (resp.from == null) {
            AmAuditDocumentTypesMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortAuditDocumentList(type: string, text: string) {
    if (!AmAuditDocumentTypesMasterStore.orderBy) {
      AmAuditDocumentTypesMasterStore.orderBy = 'asc';
      AmAuditDocumentTypesMasterStore.orderItem = type;
    }
    else {
      if (AmAuditDocumentTypesMasterStore.orderItem == type) {
        if (AmAuditDocumentTypesMasterStore.orderBy == 'asc') AmAuditDocumentTypesMasterStore.orderBy = 'desc';
        else AmAuditDocumentTypesMasterStore.orderBy = 'asc'
      }
      else {
        AmAuditDocumentTypesMasterStore.orderBy = 'asc';
        AmAuditDocumentTypesMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }

  searchAuditDocumentType(params) {
    return this.getItems(false, params ? params : '').pipe(
      map((res: AmAuditDocumentTypesPaginationResponse) => {
        AmAuditDocumentTypesMasterStore.setAmAuditDocumentTypes(res);
        return res;
      })
    );
  }
}