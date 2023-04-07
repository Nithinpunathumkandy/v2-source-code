import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserDocumentType, UserDocumentTypePaginationResponse } from '../../../../models/masters/human-capital/user-document-type';
import { map } from 'rxjs/operators';
import { UserDocumentTypeMasterStore } from 'src/app/stores/masters/human-capital/user-document-type-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserDocumentTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, extraParms?: string, status: boolean = false): Observable<UserDocumentTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${UserDocumentTypeMasterStore.currentPage}`;
      if (UserDocumentTypeMasterStore.orderBy) params += `&order_by=${UserDocumentTypeMasterStore.orderItem}&order=${UserDocumentTypeMasterStore.orderBy}`;
    }
    else {
      this.getAllItems();
    }


    if (extraParms) {
      if (params) params += `&${extraParms}`;
      else params += `?${extraParms}`;
    }

    if (UserDocumentTypeMasterStore.searchText) params += (params ? '&q=' : '?q=') + UserDocumentTypeMasterStore.searchText;
    if (status) params += (params ? '&' : '?q=') + 'status=all';

    return this._http.get<UserDocumentTypePaginationResponse>('/user-document-types' + (params ? params : '')).pipe(
      map((res: UserDocumentTypePaginationResponse) => {
        UserDocumentTypeMasterStore.setUserDocumentTypes(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<UserDocumentType[]> {
    return this._http.get<UserDocumentType[]>('/user-document-types?is_all=true').pipe(
      map((res: UserDocumentType[]) => {

        UserDocumentTypeMasterStore.setAllUserDocumentTypes(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<UserDocumentType> {
    return this._http.get<UserDocumentType>('/user-document-types/' + id).pipe(
      map((res: UserDocumentType) => {
        UserDocumentTypeMasterStore.updateUserDocumentType(res)
        return res;
      })
    );
  }

  updateItem(id, item: UserDocumentType): Observable<any> {
    return this._http.put('/user-document-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: UserDocumentType) {
    return this._http.post('/user-document-types', item).pipe(
      map(res => {
        console.log(res);
        UserDocumentTypeMasterStore.setLastInserted(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/user-document-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('user_document_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/user-document-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('user_document_types')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/user-document-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/user-document-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/user-document-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/user-document-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/user-document-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp => {
          if (resp.from == null) {
            UserDocumentTypeMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  sortUserDocumentList(type: string, text: string) {
    if (!UserDocumentTypeMasterStore.orderBy) {
      UserDocumentTypeMasterStore.orderBy = 'asc';
      UserDocumentTypeMasterStore.orderItem = type;
    }
    else {
      if (UserDocumentTypeMasterStore.orderItem == type) {
        if (UserDocumentTypeMasterStore.orderBy == 'asc') UserDocumentTypeMasterStore.orderBy = 'desc';
        else UserDocumentTypeMasterStore.orderBy = 'asc'
      }
      else {
        UserDocumentTypeMasterStore.orderBy = 'asc';
        UserDocumentTypeMasterStore.orderItem = type;
      }
    }
    if (!text)
      this.getItems(false, null, true).subscribe();
    else
      this.getItems(false, `&q=${text}`, true).subscribe();
  }

  searchUserDocumentType(params) {
    return this.getItems(false, params ? params : '').pipe(
      map((res: UserDocumentTypePaginationResponse) => {
        UserDocumentTypeMasterStore.setUserDocumentTypes(res);
        return res;
      })
    );
  }
}
