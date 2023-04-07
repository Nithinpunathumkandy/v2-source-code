import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiReportDetailsPaginationResponse, KpiReportPaginationResponse } from 'src/app/core/models/kpi-management/report/kpi-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiReportStore } from 'src/app/stores/kpi-management/report/kpi-report-store';

@Injectable({
  providedIn: 'root'
})
export class KpiReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }
  
  getItems(riskCountObject: any, additionalParams): Observable<KpiReportPaginationResponse> {
  let params = '';
  if (additionalParams) params += additionalParams;
    return this._http.get<KpiReportPaginationResponse>(`/kpi-management/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
      map((res: KpiReportPaginationResponse) => {
        KpiReportStore.setKpiReportDetails(res);
        return res;
      })
    );
  }
  
  // for getting listing data for Report Details page and Risks page

	getKpiItemsDetails(id: string, kpiCountListObject: any, additionalParams: string): Observable<KpiReportDetailsPaginationResponse> {
		let params = '';
		params = `&page=${KpiReportStore.currentPage}`;
		if(additionalParams) params += additionalParams;

    let url='';
    if(kpiCountListObject.type === "kpi-score-count-by-status"){
      url='kpi-scores';
    }else{
      url='kpis';
    }

		return this._http.get<KpiReportDetailsPaginationResponse>(`/kpi-management/${url}?${kpiCountListObject.kpiItemId}=${id}${(params ? params : '')}`).pipe(
			map((res: KpiReportDetailsPaginationResponse) => {
				KpiReportStore.setKpiReportsCountDetails(res);
				return res;
			})
		);
	}

  exportToExcel(kpiCountObject: any,additionalParams) {
    let params = '';
    params += additionalParams;
      this._http.get(`/kpi-management/reports/${kpiCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(kpiCountObject.title)+'.xlsx');
        }
      );
  }


  exportTolistExcel(kpiCountObject: any, additionalParams) {
		let params = '';
		params += additionalParams;

    let url='';
    if(kpiCountObject.type === "kpi-score-count-by-status"){
      url='kpi-scores';
    }else{
      url='kpis';
    }

    this._http.get(`/kpi-management/${url}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(kpiCountObject.title)+'.xlsx');
      }
    )
	}
    
}
