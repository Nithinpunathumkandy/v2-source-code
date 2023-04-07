import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReportsPaginationResponse, RiskDetailsPaginationResponse } from 'src/app/core/models/risk-management/reports/report-details';
import { RiskReportStore } from 'src/app/stores/risk-management/reports/report-details-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
	providedIn: 'root'
})
export class ReportDetailsService {

	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }

// for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<ReportsPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		return this._http.get<ReportsPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
			map((res: ReportsPaginationResponse) => {
				RiskReportStore.setRiskDetails(res);
				return res;
			})
		);
	}

// for getting listing data for Report Details page and Risks page

	getRiskItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<RiskDetailsPaginationResponse> {
		let params = '';
		params = `&page=${RiskReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (riskCountListObject.type === "risk-by-treatment-responsible-user" || riskCountListObject.type === "risk-by-treatment-status")
			{
				return this._http.get<RiskDetailsPaginationResponse>(`/reports/risk-treatments?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
					map((res: RiskDetailsPaginationResponse) => {
						RiskReportStore.setRiskCountDetails(res);
						return res;
					})
				);
			}
		return this._http.get<RiskDetailsPaginationResponse>(`/reports/risks?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
			map((res: RiskDetailsPaginationResponse) => {
				RiskReportStore.setRiskCountDetails(res);
				return res;
			})
		);
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

	exportTolistExcel(riskCountObject: any, additionalParams) {
		let params = '';
		params += additionalParams;
		if (riskCountObject.reportType == 'riskRegister') {
			this._http.get(`/risks/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
