import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectReportDetailsPaginationResponse,ProjectReportPaginationResponse } from 'src/app/core/models/project-monitoring/project-report';
import { ProjectReportStore } from 'src/app/stores/project-monitoring/project-report-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ProjectReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(riskCountObject: any, additionalParams): Observable<ProjectReportPaginationResponse> {
      let params = '';
      if (additionalParams) params += additionalParams;
      return this._http.get<ProjectReportPaginationResponse>(`/project-monitor/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
        map((res: ProjectReportPaginationResponse) => {
          ProjectReportStore.setProjectReportDetails(res);
          return res;
        })
      );
    }

    getProjectItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<ProjectReportDetailsPaginationResponse> {
      let params = '';
      params = `&page=${ProjectReportStore.currentPage}`;
      if (additionalParams) params += additionalParams;
      if (riskCountListObject.reportType === "project") {
        return this._http.get<ProjectReportDetailsPaginationResponse>(`/project-monitor/reports/projects?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: ProjectReportDetailsPaginationResponse) => {
            ProjectReportStore.setProjectReportsCountDetails(res);
            return res;
          })
        );
      }
      else if (riskCountListObject.reportType === "change_request") {
        return this._http.get<ProjectReportDetailsPaginationResponse>(`/project-monitor/reports/project-change-requests?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: ProjectReportDetailsPaginationResponse) => {
            ProjectReportStore.setProjectReportsCountDetails(res);
            return res;
          })
        );
      }
      else if(riskCountListObject.reportType === "project_closure") {
        return this._http.get<ProjectReportDetailsPaginationResponse>(`/project-monitor/reports/project-closures?${riskCountListObject.riskItemId}=${id}${(params ? params : '')}`).pipe(
          map((res: ProjectReportDetailsPaginationResponse) => {
            ProjectReportStore.setProjectReportsCountDetails(res);
            return res;
          })
        );
      }
    }

    exportToExcel(riskCountObject: any, additionalParams) {
      let params = '';
      params += additionalParams;
      this._http.get(`/project-monitor/reports/${riskCountObject.endurl}/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
        }
      );
    }

    exportToExcelList(riskCountObject: any,additionalParams) {
      let params = '';
      params += additionalParams;
      if (riskCountObject.reportType === 'project') {
        this._http.get(`/project-monitor/projects/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }
      else if (riskCountObject.reportType === 'change_request') {
        this._http.get(`/project-monitor/project-change-requests/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }
      else if (riskCountObject.reportType === 'project_closure') {
        this._http.get(`/project-monitor/project-closures/export${(params ? params : '')}`, { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response,this._utilityService.translateToUserLanguage(riskCountObject.title)+'.xlsx');
          }
        )
      }
    }
}

