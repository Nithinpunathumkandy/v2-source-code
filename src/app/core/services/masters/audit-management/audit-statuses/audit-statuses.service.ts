import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditStatusesPaginationResponse } from 'src/app/core/models/masters/audit-management/audit-statuses';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditStatusesMasterStore } from 'src/app/stores/masters/audit-management/audit-statuses-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuditStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AuditStatusesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditStatusesMasterStore.currentPage}`;
      if (AuditStatusesMasterStore.orderBy) params += `&order_by=${AuditStatusesMasterStore.orderItem}&order=${AuditStatusesMasterStore.orderBy}`;
    }
    if(AuditStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditStatusesMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AuditStatusesPaginationResponse>('/am-audit-statuses' + (params ? params : '')).pipe(
      map((res: AuditStatusesPaginationResponse) => {
        AuditStatusesMasterStore.setAuditStatuses(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/am-audit-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_statuses')+".xlsx");
      }
    )
  }
  
  sortAuditStatusesList(type:string, text:string) {
    if (!AuditStatusesMasterStore.orderBy) {
      AuditStatusesMasterStore.orderBy = 'asc';
      AuditStatusesMasterStore.orderItem = type;
    }
    else{
      if (AuditStatusesMasterStore.orderItem == type) {
        if(AuditStatusesMasterStore.orderBy == 'asc') AuditStatusesMasterStore.orderBy = 'desc';
        else AuditStatusesMasterStore.orderBy = 'asc'
      }
      else{
        AuditStatusesMasterStore.orderBy = 'asc';
        AuditStatusesMasterStore.orderItem = type;
      }
    }
  }
}
