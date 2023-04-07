import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsAuditReportsPaginationResponse, MsAuditDetailsPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-report/ms-audit-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditReportStore } from 'src/app/stores/ms-audit-management/ms-audit-report/ms-audit-report.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { MsAuditRiskDetailsPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-report';

@Injectable({
  providedIn: 'root'
})
export class MsAuditReportService {
  constructor(		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    getItems(riskCountObject: any, additionalParams): Observable<MsAuditReportsPaginationResponse> {
      let params = '';
      if (additionalParams) params += additionalParams;
      return this._http.get<MsAuditReportsPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
        map((res: MsAuditReportsPaginationResponse) => {
          AuditReportStore.setAuditRiskDetails(res);
          return res;
        })
      );
    }
  
    // for getting listing data for Report Details page and Risks page
  
    getProcessItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<MsAuditDetailsPaginationResponse> {
      let params = '';
      params = `&page=${AuditReportStore.currentPage}`;
      if(additionalParams) params += additionalParams;
      return this._http.get<MsAuditDetailsPaginationResponse>(`/reports/process?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
        map((res: MsAuditDetailsPaginationResponse) => {
          AuditReportStore.setAuditCountDetails(res);
          return res;
        })
      );
    }
  
    // for exporting functionality
  
    exportToExcel(riskCountObject: any,additionalParams) {
      let params = '';
      params += additionalParams;
      this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
        }
      )
    }
  
    
    exportToExcelList(riskCountObject: any,additionalParams) {
    let params = '';
		params += additionalParams;
		if (riskCountObject.endurl == "ms-audit-plan-count-by-departments" || riskCountObject.endurl == "ms-audit-plan-count-by-statuses" || riskCountObject.endurl == "ms-audit-plan-count-by-lead-auditors") {
			this._http.get(`/ms-audit-plans/export${(params ? params+'&is_not_preplan=true' : '&is_not_preplan=true')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else if(riskCountObject.endurl === "ms-audit-finding-count-by-statuses")
      {
        this._http.get(`/ms-audit-findings/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }

      else if(riskCountObject.endurl === "ms-audit-finding-count-by-departments")
      {
        this._http.get(`/ms-audit-findings/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }
      else if(riskCountObject.endurl === "ms-audit-finding-corrective-action-count-by-departments")
      {
        this._http.get(`/ms-audit/corrective-actions/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }

      else if(riskCountObject.endurl === "ms-audit-finding-corrective-action-delay-analysis-by-departments")
      {
        this._http.get(`/ms-audit/corrective-actions/export${(params ? params : '')}&delay_analysis=true`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }
      else{
        this._http.get(`/ms-audits/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }


    }

    getMsAuditItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<MsAuditRiskDetailsPaginationResponse> {
      let params = '';
      params = `&page=${AuditReportStore.currentPage}`;
      if(additionalParams) params += additionalParams;
      if(riskCountListObject.endurl == "ms-audit-plan-count-by-departments" || riskCountListObject.endurl == "ms-audit-plan-count-by-statuses" || riskCountListObject.endurl == "ms-audit-plan-count-by-lead-auditors") 
      {
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/reports/ms-audit-plans?${riskCountListObject.riskItemId}=${id}${(params ? params+'&is_not_preplan=true' : '&is_not_preplan=true')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.endurl === "ms-audit-finding-count-by-statuses")
      {
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/reports/ms-audit-findings?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }

      else if(riskCountListObject.endurl === "ms-audit-corrective-action-count-by-departments")
      {
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/reports/ms-audit-finding-corrective-action-count-by-departments?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }

      else if(riskCountListObject.endurl === "ms-audit-finding-count-by-departments")
      {
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/reports/ms-audit-findings?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.endurl === "ms-audit-finding-corrective-action-count-by-departments")
      {
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/reports/ms-audit-finding-corrective-actions?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.endurl === "ms-audit-finding-corrective-action-delay-analysis-by-departments")
      {
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/ms-audit/corrective-actions?delay_analysis=true&${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
      else{
        return this._http.get<MsAuditRiskDetailsPaginationResponse>(`/reports/ms-audits?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: MsAuditRiskDetailsPaginationResponse) => {
            AuditReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
        
      

    }
}
