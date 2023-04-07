import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReportsPaginationResponse, ReportDetailsPaginationResponse } from 'src/app/core/models/isms/report/report-details';
import { IsmsReportStore } from 'src/app/stores/isms/report/report-details-store';
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
	getItems(ismsCountObject: any, additionalParams): Observable<ReportsPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		return this._http.get<ReportsPaginationResponse>(`/reports/${ismsCountObject.endurl}${(params ? params : '')}`).pipe(
			map((res: ReportsPaginationResponse) => {
				IsmsReportStore.setReportDetails(res);
				return res;
			})
		);
	}

// for getting listing data for Report Details page and Risks page

	getRiskItemsDetails(id: string, ismsCountListObject: any, additionalParams: string): Observable<ReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${IsmsReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (ismsCountListObject.type === "isms-risk-by-treatment-responsible-user" || ismsCountListObject.type === "isms-risk-by-treatment-status")
			{
				return this._http.get<ReportDetailsPaginationResponse>(`/reports/isms-risk-treatments?${ismsCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
					map((res: ReportDetailsPaginationResponse) => {
						IsmsReportStore.setRiskCountDetails(res);
						return res;
					})
				);
			}
		return this._http.get<ReportDetailsPaginationResponse>(`/reports/isms-risks?${ismsCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
			map((res: ReportDetailsPaginationResponse) => {
				IsmsReportStore.setRiskCountDetails(res);
				return res;
			})
		);
	}

// for exporting functionality

	exportToExcel(ismsCountObject: any, additionalParams) {

		let params = '';
		params += additionalParams;
		this._http.get(`/reports/${ismsCountObject.endurl}/export?${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(ismsCountObject.title)+'.xlsx');
			}
		)
	}

	exportTolistExcel(ismsCountObject: any, additionalParams) {
		let params = '';
		params += additionalParams;
		if (ismsCountObject.reportType == 'riskRegister') {
			this._http.get(`/isms-risks/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(ismsCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
