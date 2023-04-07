import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentManagementReportDetailsPaginationResponse, IncidentManagementReportPaginationResponse } from 'src/app/core/models/incident-management/incident-report/incident-report';
import { IncidentManagementReportStore } from 'src/app/stores/incident-management/incident-report/incident-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
	providedIn: 'root'
})
export class IncidentReportDetailsService {

	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }

	// for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<IncidentManagementReportPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		return this._http.get<IncidentManagementReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
			map((res: IncidentManagementReportPaginationResponse) => {
				IncidentManagementReportStore.setIncidentManagementReportDetails(res);
				return res;
			})
		);
	}

	// for getting listing data for Report Details page and Risks page

	getIncidentItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<IncidentManagementReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${IncidentManagementReportStore.currentPage}`;
		if (additionalParams) params += additionalParams;
		if (riskCountListObject.reportType === "incident") {
			return this._http.get<IncidentManagementReportDetailsPaginationResponse>(`/reports/incidents?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: IncidentManagementReportDetailsPaginationResponse) => {
					IncidentManagementReportStore.setIncidentManagementReportsCountDetails(res);
					return res;
				})
			);
		}
		else if (riskCountListObject.reportType === "investigation") {
			return this._http.get<IncidentManagementReportDetailsPaginationResponse>(`/reports/investigations?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: IncidentManagementReportDetailsPaginationResponse) => {
					IncidentManagementReportStore.setIncidentManagementReportsCountDetails(res);
					return res;
				})
			);
		}
		else {
			return this._http.get<IncidentManagementReportDetailsPaginationResponse>(`/reports/corrective-actions?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: IncidentManagementReportDetailsPaginationResponse) => {
					IncidentManagementReportStore.setIncidentManagementReportsCountDetails(res);
					return res;
				})
			);
		}
	}

	// for exporting functionality

	exportToExcel(riskCountObject: any, additionalParams) {
		let params = '';
		params += additionalParams;
		this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
			}
		);
	}

	exportToExcelList(riskCountObject: any, additionalParams) {
		let params = '';
		params += additionalParams;
		if (riskCountObject.reportType === 'incident') {
			this._http.get(`/incidents/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else if (riskCountObject.reportType === 'investigation') {
			this._http.get(`/incident-investigations/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else {
			this._http.get(`/incident-corrective-actions/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
