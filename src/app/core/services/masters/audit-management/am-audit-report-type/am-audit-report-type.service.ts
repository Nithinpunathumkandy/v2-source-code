import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditReportTypePaginationResponse } from 'src/app/core/models/masters/audit-management/am-audit-report-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditReportTypeMasterStore } from 'src/app/stores/masters/audit-management/am-audit-report-type.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditReportTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AmAuditReportTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditReportTypeMasterStore.currentPage}`;
      if (AmAuditReportTypeMasterStore.orderBy) params += `&order_by=${AmAuditReportTypeMasterStore.orderItem}&order=${AmAuditReportTypeMasterStore.orderBy}`;
    }
    if(AmAuditReportTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+AmAuditReportTypeMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<AmAuditReportTypePaginationResponse>('/am-audit-report-types' + (params ? params : '')).pipe(
      map((res: AmAuditReportTypePaginationResponse) => {
        AmAuditReportTypeMasterStore.setAuditReportType(res);
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/am-audit-report-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/am-audit-report-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  exportToExcel(){
    this._http.get('/am-audit-report-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_audit_report_type')+".xlsx");
      }
    )
  }
}
