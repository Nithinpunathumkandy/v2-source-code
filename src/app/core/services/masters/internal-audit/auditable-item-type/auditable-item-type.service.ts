import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditableItemType, AuditableItemTypePaginationResponse } from 'src/app/core/models/masters/internal-audit/auditable-item-type';
import { AuditItemTypeMasterStore } from 'src/app/stores/masters/internal-audit/auditable-item-type';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";



@Injectable({
  providedIn: 'root'
})
export class AuditableItemTypeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


  getAllItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<AuditableItemTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditItemTypeMasterStore.currentPage}`;
      if (AuditItemTypeMasterStore.orderBy) params += `&order_by=${AuditItemTypeMasterStore.orderItem}&order=${AuditItemTypeMasterStore.orderBy}`;

    }

    if (additionalParams) params += additionalParams;
    if(AuditItemTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditItemTypeMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<AuditableItemTypePaginationResponse>('/auditable-item-types' + (params ? params : '')).pipe(
      map((res: AuditableItemTypePaginationResponse) => {

        AuditItemTypeMasterStore.setAuditItemTypes(res);
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/auditable-item-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getAllItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/auditable-item-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getAllItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/auditable-item-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditable_item_type_template')+".xlsx");
      }
    )
  }


  exportToExcel() {
    this._http.get('/auditable-item-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditable_item_types')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/auditable-item-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/auditable-item-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getAllItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  
  sortAuditTypelList(type:string, text:string) {
    if (!AuditItemTypeMasterStore.orderBy) {
      AuditItemTypeMasterStore.orderBy = 'asc';
      AuditItemTypeMasterStore.orderItem = type;
    }
    else {
      if (AuditItemTypeMasterStore.orderItem == type) {
        if (AuditItemTypeMasterStore.orderBy == 'asc') AuditItemTypeMasterStore.orderBy = 'desc';
        else AuditItemTypeMasterStore.orderBy = 'asc'
      }
      else {
        AuditItemTypeMasterStore.orderBy = 'asc';
        AuditItemTypeMasterStore.orderItem = type;
      }
    }
    // if (!text)
    //   this.getAllItems().subscribe();
    // else
    //   this.getAllItems(false, `&q=${text}`).subscribe();
  }

}


