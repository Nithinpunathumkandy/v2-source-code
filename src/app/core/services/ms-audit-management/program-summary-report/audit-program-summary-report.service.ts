import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { MsauditProgramReoportDetails, MsAuditProgramReoportPaginationResponse } from 'src/app/core/models/ms-audit-management/audit-program-summary-report/audit-program-summary-report';
import { AuditProgramSummaryReportStore } from 'src/app/stores/ms-audit-management/audit-program-summary-report/audit-program-summary-report.store';

@Injectable({
  providedIn: 'root'
})
export class AuditProgramSummaryReportService {

  constructor(  private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<MsAuditProgramReoportPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditProgramSummaryReportStore.currentPage}&status=all`;
        if (AuditProgramSummaryReportStore.orderBy) params += `&order_by=${AuditProgramSummaryReportStore.orderItem}&order=${AuditProgramSummaryReportStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditProgramSummaryReportStore.searchText) params += (params ? '&q=' : '?q=')+AuditProgramSummaryReportStore.searchText;
      // if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_porgrams' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<MsAuditProgramReoportPaginationResponse>('/ms-audit-annual-summary-reports' + (params ? params : '')).pipe(
        map((res: MsAuditProgramReoportPaginationResponse) => {
          AuditProgramSummaryReportStore.setAuditSummaryList(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<MsauditProgramReoportDetails> {
      return this._http.get<MsauditProgramReoportDetails>(`/ms-audit-annual-summary-reports/${id}`).pipe(
        map((res: MsauditProgramReoportDetails) => {
          AuditProgramSummaryReportStore.setIndividualMsAuditPrgramsReportDetails(res);
          return res;
        })
      );
    }

    generateReport(data): Observable<any> {
      return this._http.post(`/ms-audit-annual-summary-reports`, data).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'Audit program report generated successfully');
          return res;
        })
      );
    }

    exportToExcel() {
     
      // if (MsAuditPlansStore.searchText) params += `&q=${MsAuditPlansStore.searchText}`;

      this._http.get('/ms-audit-annual-summary-reports/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_annual_summary_summary')+".xlsx");
        }
      )
    }
}
