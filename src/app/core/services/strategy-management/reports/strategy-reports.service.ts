import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyManagementReportDetailsPaginationResponse, StrategyManagementReportPaginationResponse } from 'src/app/core/models/strategy-management/report.model';
import { StrategyReportStore } from 'src/app/stores/strategy-management/strategy-report.store';



@Injectable({
  providedIn: 'root'
})
export class StrategyReportsService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(riskCountObject: any, additionalParams): Observable<StrategyManagementReportPaginationResponse> {
      let params = '';
      if (additionalParams) params += additionalParams;
      return this._http.get<StrategyManagementReportPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
        map((res: StrategyManagementReportPaginationResponse) => {
          StrategyReportStore.setStrategyManagementReportDetails(res);
          return res;
        })
      );
    }

    getIncidentItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<StrategyManagementReportDetailsPaginationResponse> {
      let params = '';
      params = `&page=${StrategyReportStore.currentPage}`;
      if (additionalParams) params += additionalParams;
      if (riskCountListObject.reportType === "profile") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-profiles?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      }
      else if (riskCountListObject.reportType === "focus_area") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-profile-focus-areas?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.reportType === "objective") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-profile-objectives?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.reportType === "kpi") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-profile-objective-kpis?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.reportType === "initiative") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-initiatives?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      } else if(riskCountListObject.reportType === "milestone") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-initiative-milestones?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      }else if(riskCountListObject.reportType === "action_plan") {
        return this._http.get<StrategyManagementReportDetailsPaginationResponse>(`/reports/strategy-initiative-action-plans?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: StrategyManagementReportDetailsPaginationResponse) => {
            StrategyReportStore.setStrategyManagementReportsCountDetails(res);
            return res;
          })
        );
      }
    }

    exportToExcel(riskCountObject: any, additionalParams) {
      let params = '';
      params += additionalParams;
      this._http.get(`/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
        }
      );
    }
}
