import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { JsoReportDetailsPaginationResponse,JsoReportPaginationResponse } from 'src/app/core/models/jso/jso-report/jso-report';
import { JsoReportStore } from 'src/app/stores/jso/jso-report/jso-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class JsoReportDetailsService {

  constructor(
    private _http: HttpClient,
	private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

  // for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<JsoReportPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
			return this._http.get<JsoReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
				map((res: JsoReportPaginationResponse) => {
					JsoReportStore.setJsoReportDetails(res);
					return res;
				})
			);
	}

	// for getting listing data for Report Details page and Risks page

	getExternalItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<JsoReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${JsoReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (riskCountListObject.type === "jso-by-categories") {
			return this._http.get<JsoReportDetailsPaginationResponse>(`/jso-observation-unsafe-actions?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: JsoReportDetailsPaginationResponse) => {
					JsoReportStore.setJsoReportsCountDetails(res);
					return res;
				})
			);
		}
		else {
			return this._http.get<JsoReportDetailsPaginationResponse>(`/reports/jso?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: JsoReportDetailsPaginationResponse) => {
					JsoReportStore.setJsoReportsCountDetails(res);
					return res;
				})
			);
		}
	}

	// for exporting functionality

	exportToExcel(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
			this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			);
	}

	exportToExcelList(riskCountObject: any,additionalParams) {
		let params = '';
		params += additionalParams;
		if (riskCountObject.reportType === 'jso') {
			this._http.get(`/jso-observations/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else {
			this._http.get(`/jso-observation-unsafe-actions/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
