import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { OrganizationReportStore } from "src/app/stores/organization/organization-reports/organization-reports-store";
import { OrganizationReportsPaginationResponse} from "src/app/core/models/organization/organization-report/organization-report";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(reportObject: any, additionalParams): Observable<OrganizationReportsPaginationResponse> {
      let params = '';
      if (additionalParams) params += additionalParams;
        return this._http.get<OrganizationReportsPaginationResponse>(`/reports/${reportObject.endurl}${(params ? params : '')}`).pipe(
          map((res: OrganizationReportsPaginationResponse) => {
            OrganizationReportStore.setOrganizationReportDetails(res);
            return res;
          })
        );
    }

  getItemsDetails(id: string, reportObject: any, additionalParams: string): Observable<any> {
    let params = '';
    params = `&page=${OrganizationReportStore.currentPage}`;
    if(additionalParams) params += additionalParams;
    return this._http.get<any>(`/reports/issues?${reportObject.itemId}=${id}${(params ? params : '')}`).pipe(
      map((res: any) => {
        OrganizationReportStore.setOrganizationReportsCountDetails(res);
        return res;
      })
    );
  }

  exportToExcel(reportObject: any,additionalParams) {
    let params = '';
    params += additionalParams;
      this._http.get(`/reports/${reportObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(reportObject.downloadCountFileTitle)+'.xlsx');
        }
      );
  }

  exportToExcelList(reportObject: any,additionalParams) {
    let params = '';
    params += additionalParams;
    this._http.get(`/reports/issues/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(reportObject.downloadFileTitle)+'.xlsx');
      }
    )
  } 

}
