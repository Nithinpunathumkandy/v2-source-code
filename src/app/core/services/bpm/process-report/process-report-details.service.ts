import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProcessRiskDetailsPaginationResponse, ProcessReportsPaginationResponse } from 'src/app/core/models/bpm/process-report/process-report';
import { ProcessReportStore } from 'src/app/stores/bpm/process-report/process-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
	providedIn: 'root'
})
export class ProcessReportDetailsService {

	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }
	// for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<ProcessReportsPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		return this._http.get<ProcessReportsPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
			map((res: ProcessReportsPaginationResponse) => {
				ProcessReportStore.setProcessRiskDetails(res);
				return res;
			})
		);
	}

	// for getting listing data for Report Details page and Risks page

	getProcessItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<ProcessRiskDetailsPaginationResponse> {
		let params = '';
		params = `&page=${ProcessReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		return this._http.get<ProcessRiskDetailsPaginationResponse>(`/reports/process?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
			map((res: ProcessRiskDetailsPaginationResponse) => {
				ProcessReportStore.setProcessRiskCountDetails(res);
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
		this._http.get(`/processes/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
			}
		)
	}
}
