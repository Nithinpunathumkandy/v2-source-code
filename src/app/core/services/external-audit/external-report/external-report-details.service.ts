import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ExternalRiskDetailsPaginationResponse, ExternalReportPaginationResponse } from 'src/app/core/models/external-audit/external-report/external-report';
import { ExternalReportStore } from 'src/app/stores/external-audit/external-report/external-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ExternalReportDetailsService {

  constructor(
    private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  // for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<ExternalReportPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		if (riskCountObject.reportType == 'externalAudit') {
			return this._http.get<ExternalReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
				map((res: ExternalReportPaginationResponse) => {
					ExternalReportStore.setExternalRiskDetails(res);
					return res;
				})
			);
		}
		else {
			return this._http.get<ExternalReportPaginationResponse>(`/external-audit/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
				map((res: ExternalReportPaginationResponse) => {
					ExternalReportStore.setExternalRiskDetails(res);
					return res;
				})
			);
		}
	}

	// for getting listing data for Report Details page and Risks page

	getExternalItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<ExternalRiskDetailsPaginationResponse> {
		let params = '';
		params = `&page=${ExternalReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (riskCountListObject.reportType === "externalAudit") {
			return this._http.get<ExternalRiskDetailsPaginationResponse>(`/reports/external-audits?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: ExternalRiskDetailsPaginationResponse) => {
					ExternalReportStore.setExternalRiskCountDetails(res);
					return res;
				})
			);
		}
		else {
			return this._http.get<ExternalRiskDetailsPaginationResponse>(`/external-audit/reports/findings?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: ExternalRiskDetailsPaginationResponse) => {
					ExternalReportStore.setExternalRiskCountDetails(res);
					return res;
				})
			);
		}
	}

	// for exporting functionality

	exportToExcel(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
		if (riskCountObject.reportType === 'externalAudit') {
			this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else {
			this._http.get(`/external-audit/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}

	exportToExcelList(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
		if (riskCountObject.reportType === 'externalAudit') {
			this._http.get(`/external-audits/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else {
			this._http.get(`/external-audit/findings/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
