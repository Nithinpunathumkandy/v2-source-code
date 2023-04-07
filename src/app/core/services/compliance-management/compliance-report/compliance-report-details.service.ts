import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceReportDetailsPaginationResponse,ComplianceReportPaginationResponse } from 'src/app/core/models/compliance-management/compliance-report/compliance-report';
import { ComplianceReportStore } from 'src/app/stores/compliance-management/compliance-report/compliance-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ComplianceReportDetailsService {

  constructor(
	private _http: HttpClient,
	private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

  // for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<ComplianceReportPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
			return this._http.get<ComplianceReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
				map((res: ComplianceReportPaginationResponse) => {
					ComplianceReportStore.setComplianceReportDetails(res);
					return res;
				})
			);
	}

	// for getting listing data for Report Details page and Risks page

	getComplianceItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<ComplianceReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${ComplianceReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (riskCountListObject.reportType === "compliance") {
			return this._http.get<ComplianceReportDetailsPaginationResponse>(`/reports/compliance?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: ComplianceReportDetailsPaginationResponse) => {
					ComplianceReportStore.setComplianceReportsCountDetails(res);
					return res;
				})
			);
		}
		else {
			return this._http.get<ComplianceReportDetailsPaginationResponse>(`/sla-and-contracts?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: ComplianceReportDetailsPaginationResponse) => {
					ComplianceReportStore.setComplianceReportsCountDetails(res);
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
		if (riskCountObject.reportType === 'compliance') {
			this._http.get(`/compliance-registers/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
		else {
			this._http.get(`/sla-and-contracts/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
				(response: any) => {
					this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
				}
			)
		}
	}
}
