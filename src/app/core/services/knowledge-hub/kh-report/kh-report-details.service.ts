import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KHRiskDetailsPaginationResponse, KHReportPaginationResponse } from 'src/app/core/models/knowledge-hub/kh-report/kh-report';
import { KHReportStore } from 'src/app/stores/knowledge-hub/kh-report/kh-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class KhReportDetailsService {

  constructor(
	private _http: HttpClient,
	private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

  // for getting the Report page data
	getItems(riskCountObject: any, additionalParams): Observable<KHReportPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		
			return this._http.get<KHReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
				map((res: KHReportPaginationResponse) => {
					KHReportStore.setKHRiskDetails(res);
					return res;
				})
			);
	}

	// for getting listing data for Report Details page and Risks page

	getKHItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<KHRiskDetailsPaginationResponse> {
		let params = '';
		params = `&page=${KHReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
			return this._http.get<KHRiskDetailsPaginationResponse>(`/reports/documents?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
				map((res: KHRiskDetailsPaginationResponse) => {
					KHReportStore.setKHRiskCountDetails(res);
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
}
