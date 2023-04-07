import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditReportsPaginationResponse, AuditRiskDetailsPaginationResponse } from 'src/app/core/models/internal-audit/audit-reports/audit-report';
import { AuditReportStore } from 'src/app/stores/internal-audit/audit-report/audit-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
	providedIn: 'root'
})
export class AuditReportDetailsService {

	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }

	// for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<AuditReportsPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		return this._http.get<AuditReportsPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
			map((res: AuditReportsPaginationResponse) => {
				AuditReportStore.setAuditRiskDetails(res);
				return res;
			})
		);
	}

	// for getting listing data for Report Details page and Risks page

	getInternalItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<AuditRiskDetailsPaginationResponse> {
		let params = '';
		params = `&page=${AuditReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (riskCountListObject.reportType === "auditProgram") {
			return this._http.get<AuditRiskDetailsPaginationResponse>(`/reports/audit-programs?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: AuditRiskDetailsPaginationResponse) => {
					AuditReportStore.setAuditRiskCountDetails(res);
					return res;
				})
			);
		}
		else if (riskCountListObject.reportType === "audit") {
			return this._http.get<AuditRiskDetailsPaginationResponse>(`/reports/audits?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: AuditRiskDetailsPaginationResponse) => {
					AuditReportStore.setAuditRiskCountDetails(res);
					return res;
				})
			);
		}
		else {
			return this._http.get<AuditRiskDetailsPaginationResponse>(`/reports/findings?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: AuditRiskDetailsPaginationResponse) => {
					AuditReportStore.setAuditRiskCountDetails(res);
					return res;
				})
			);
		}
	}

	// for exporting functionality

	exportToExcel(riskCountObject: any, additionalParams) {

		let params = '';
		params += additionalParams;
		this._http.get(`/reports/${riskCountObject.endurl}/export?${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
			}
		)
	}

	exportToExcelList(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
		if (riskCountObject.reportType === 'auditProgram') {
			this._http.get(`/audit-programs/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else if (riskCountObject.reportType === 'audit') {
			this._http.get(`/audits/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else {
			this._http.get(`/findings/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
