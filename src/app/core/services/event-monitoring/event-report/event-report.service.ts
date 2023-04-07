import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventDetails, ReportsPaginationResponse, EventDetailsPaginationResponse,Reports,ReportList } from "src/app/core/models/event-monitoring/event-report";
import { EventReportStore } from 'src/app/stores/event-monitoring/event-report-store';
@Injectable({
  providedIn: 'root'
})
export class EventReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(riskCountObject: any, additionalParams): Observable<ReportsPaginationResponse> {
    let params = '';
    if (additionalParams) params += additionalParams;
    return this._http.get<ReportsPaginationResponse>(`/reports/${riskCountObject.endurl}${(params ? params : '')}`).pipe(
      map((res: ReportsPaginationResponse) => {
        EventReportStore.setEventDetails(res);
        return res;
      })
    );
  }

  getProjectItemsDetails(id: string, riskCountListObject: any, additionalParams: string): Observable<EventDetailsPaginationResponse> {
    let params = '';
    params = `&page=${EventReportStore.currentPage}`;
    if (additionalParams) params += additionalParams;
    if (riskCountListObject.reportType === "eventRegister") {
      return this._http.get<EventDetailsPaginationResponse>(`/reports/events?${riskCountListObject.eventItemId}=${id}${(params ? params : '')}`).pipe(
        map((res: EventDetailsPaginationResponse) => {
          EventReportStore.setEventCountDetails(res);
          return res;
        })
      );
    }
    else if (riskCountListObject.reportType === "eventTreatment") {
      return this._http.get<EventDetailsPaginationResponse>(`/reports/event-change-requests?${riskCountListObject.eventItemId}=${id}${(params ? params : '')}`).pipe(
        map((res: EventDetailsPaginationResponse) => {
          EventReportStore.setEventCountDetails(res);
          return res;
        })
      );
    }
    else if(riskCountListObject.reportType === "eventClosure") {
      return this._http.get<EventDetailsPaginationResponse>(`/reports/event-closures?${riskCountListObject.eventItemId}=${id}${(params ? params : '')}`).pipe(
        map((res: EventDetailsPaginationResponse) => {
          EventReportStore.setEventCountDetails(res);
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
