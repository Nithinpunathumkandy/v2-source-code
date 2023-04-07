import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReportItemsPaginationResponse } from "src/app/core/models/hira/reports/reports";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HiraReportStore } from "src/app/stores/hira/reports/hira-reports.store";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private _http: HttpClient,
		private _utilityService: UtilityService,
  ) { }

  getRiskItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<ReportItemsPaginationResponse> {
		let params = '';
		params = `&page=${HiraReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;
		if (riskCountListObject.type === "risk-by-treatment-responsible-user" || riskCountListObject.type === "risk-by-treatment-status")
    {
      return this._http.get<ReportItemsPaginationResponse>(`/reports/risk-treatments?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
        map((res: ReportItemsPaginationResponse) => {
          HiraReportStore.setRiskCountDetails(res);
          return res;
        })
      );
    }
		return this._http.get<ReportItemsPaginationResponse>(`/reports/risks?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
			map((res: ReportItemsPaginationResponse) => {
				HiraReportStore.setRiskCountDetails(res);
				return res;
			})
		);
	}

  getItems(riskCountObject: any, additionalParams): Observable<ReportItemsPaginationResponse> {
		let params = '';
		if (additionalParams) params += additionalParams;
		return this._http.get<ReportItemsPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
			map((res: ReportItemsPaginationResponse) => {
				HiraReportStore.setRiskDetails(res);
				return res;
			})
		);
	}

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
