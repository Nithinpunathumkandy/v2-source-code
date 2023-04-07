import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CyberRiskDetailsPaginationResponse } from 'src/app/core/models/cyber-incident/cyber-incident-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentReportService {

  constructor(private _http: HttpClient,
		private _utilityService: UtilityService,) { }

  getItems(riskCountObject: any, additionalParams): Observable<CyberRiskDetailsPaginationResponse> {
    let params = '';
    if (additionalParams) params += additionalParams;
    return this._http.get<CyberRiskDetailsPaginationResponse>(`/cyber-incident/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
      map((res: CyberRiskDetailsPaginationResponse) => {
        CyberReportStore.setCyberRiskDetails(res);
        return res;
      })
    );
  }

  // for getting listing data for Report Details page and Risks page

  getProcessItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<CyberRiskDetailsPaginationResponse> {
    let params = '';
    params = `&page=${CyberReportStore.currentPage}`;
    if(additionalParams) params += additionalParams;
    return this._http.get<CyberRiskDetailsPaginationResponse>(`/cyber-incident/reports/process?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
      map((res: CyberRiskDetailsPaginationResponse) => {
        CyberReportStore.setCyberCountDetails(res);
        return res;
      })
    );
  }

  exportToExcel(riskCountObject: any,additionalParams) {
    let params = '';
    params += additionalParams;
    this._http.get(`/cyber-incident/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
      }
    )
  }

  exportToExcelList(riskCountObject: any,additionalParams) {
    let params = '';
		params += additionalParams;
		if(riskCountObject.endurl === "cyber-incident-by-statuses")
      {
        this._http.get(`/cyber-incident/reports/cyber-incident-by-statuses/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }

      else if(riskCountObject.endurl === "cyber-incident-by-classification")
      {
        this._http.get(`/cyber-incident/reports/cyber-incident-by-classification/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }
      else if(riskCountObject.endurl === "cyber-incident-by-department")
      {
        this._http.get(`/cyber-incident/reports/cyber-incident-by-department/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }

      else
      {
        this._http.get(`/cyber-incident/reports/corrective-action-by-corrective-action-statuses/export${(params ? params : '')}&delay_analysis=true`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }


    }

    getCyberItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<CyberRiskDetailsPaginationResponse> {
      let params = '';
      params = `&page=${CyberReportStore.currentPage}`;
      if(additionalParams) params += additionalParams;
      if(riskCountListObject.endurl === "cyber-incident-by-statuses")
      {
        return this._http.get<CyberRiskDetailsPaginationResponse>(`/cyber-incident/cyber-incidents?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: CyberRiskDetailsPaginationResponse) => {
            CyberReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }

      else if(riskCountListObject.endurl === "cyber-incident-by-classification")
      {
        return this._http.get<CyberRiskDetailsPaginationResponse>(`/cyber-incident/cyber-incidents?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: CyberRiskDetailsPaginationResponse) => {
            CyberReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }

      else if(riskCountListObject.endurl === "cyber-incident-by-department")
      {
        return this._http.get<CyberRiskDetailsPaginationResponse>(`/cyber-incident/cyber-incidents?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: CyberRiskDetailsPaginationResponse) => {
            CyberReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
      else{
        return this._http.get<CyberRiskDetailsPaginationResponse>(`/cyber-incident/cyber-incident-corrective-actions?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: CyberRiskDetailsPaginationResponse) => {
            CyberReportStore.setExternalRiskCountDetails(res);
            return res;
          })
        );
      }
    }
}
