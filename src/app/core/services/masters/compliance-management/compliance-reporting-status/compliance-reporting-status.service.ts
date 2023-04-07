import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceReportingStatusPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-reporting';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceReportingStatusMasterStore } from 'src/app/stores/masters/compliance-management/compliance-reporting-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceReportingStatusService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<ComplianceReportingStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceReportingStatusMasterStore.currentPage}`;
      if (ComplianceReportingStatusMasterStore.orderBy) params += `&order_by=${ComplianceReportingStatusMasterStore.orderItem}&order=${ComplianceReportingStatusMasterStore.orderBy}`;
      if(ComplianceReportingStatusMasterStore.searchTerm) params += `&q=${ComplianceReportingStatusMasterStore.searchTerm}`;
    }
    if(status) params += (params ? '&' : '?')+'status=all';
    if(additionalParams) params += additionalParams;
    return this._http.get<ComplianceReportingStatusPaginationResponse>('/compliance-reporting-statuses' + (params ? params : '')).pipe(
      map((res: ComplianceReportingStatusPaginationResponse) => {
        
        ComplianceReportingStatusMasterStore.setComplianceReportingStatus(res);
        return res;
      })
    );
 
  }
  exportToExcel() {
    this._http.get('/compliance-reporting-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_reporting_status')+".xlsx");
      }
    )
  }

  searchComplianceStatus(params){
    return this.getItems(params ? params : '').pipe(
      map((res: ComplianceReportingStatusPaginationResponse) => {
        ComplianceReportingStatusMasterStore.setComplianceReportingStatus(res);
        return res;
      })
    );
  }

  sortStatusList(type:string, text:string) {
    if (!ComplianceReportingStatusMasterStore.orderBy) {
      ComplianceReportingStatusMasterStore.orderBy = 'asc';
      ComplianceReportingStatusMasterStore.orderItem = type;
    }
    else{
      if (ComplianceReportingStatusMasterStore.orderItem == type) {
        if(ComplianceReportingStatusMasterStore.orderBy == 'asc') ComplianceReportingStatusMasterStore.orderBy = 'desc';
        else ComplianceReportingStatusMasterStore.orderBy = 'asc'
      }
      else{
        ComplianceReportingStatusMasterStore.orderBy = 'asc';
        ComplianceReportingStatusMasterStore.orderItem = type;
      }
    }
  }
}