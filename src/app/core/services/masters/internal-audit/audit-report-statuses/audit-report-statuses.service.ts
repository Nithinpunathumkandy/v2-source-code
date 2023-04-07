import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditReportStatus, AuditReportStatusPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-report-statuses';
import { AuditReportStatusMasterStore } from 'src/app/stores/masters/internal-audit/audit-report-statuses-store';

@Injectable({
  providedIn: 'root'
})
export class AuditReportStatusesService {
  constructor(private _http: HttpClient) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<AuditReportStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditReportStatusMasterStore.currentPage}`;
      if (AuditReportStatusMasterStore.orderBy) params += `order_by=${AuditReportStatusMasterStore.orderItem}&order=${AuditReportStatusMasterStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(AuditReportStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditReportStatusMasterStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<AuditReportStatusPaginationResponse>('/audit-report-statuses' + (params ? params : '')).pipe(
      map((res: AuditReportStatusPaginationResponse) => {
        AuditReportStatusMasterStore.setAuditReportStatus(res);
        return res;
      })
    );
  }
  sortAuditReportStatusList(type:string, text:string) {
    if (!AuditReportStatusMasterStore.orderBy) {
      AuditReportStatusMasterStore.orderBy = 'asc';
      AuditReportStatusMasterStore.orderItem = type;
    }
    else{
      if (AuditReportStatusMasterStore.orderItem == type) {
        if(AuditReportStatusMasterStore.orderBy == 'asc') AuditReportStatusMasterStore.orderBy = 'desc';
        else AuditReportStatusMasterStore.orderBy = 'asc'
      }
      else{
        AuditReportStatusMasterStore.orderBy = 'asc';
        AuditReportStatusMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
