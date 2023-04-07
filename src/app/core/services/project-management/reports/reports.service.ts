import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TimeTrackerReportStore } from 'src/app/stores/project-management/reports/reports.store';
import { TimeTrackerReportPaginationResponse } from 'src/app/core/models/project-management/reports/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }
   
    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<TimeTrackerReportPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${TimeTrackerReportStore.currentPage}`;
        if (TimeTrackerReportStore.orderBy) params += `&order_by=${TimeTrackerReportStore.orderItem}&order=${TimeTrackerReportStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(TimeTrackerReportStore.searchText) params += (params ? '&q=' : '?q=')+TimeTrackerReportStore.searchText;
      return this._http.get<TimeTrackerReportPaginationResponse>('/reports/project-time-tracker' + (params ? params : '')).pipe(
        map((res: TimeTrackerReportPaginationResponse) => {
          TimeTrackerReportStore.setTimeTrackerReport(res);
          return res;
        })
      );
    }

    exportToExcel(params) {
      this._http.get('/reports/project-time-tracker/export?'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_time_tracker') + ".xlsx");
        }
      )
    }

    sortTimeTrackerReportList(type:string, text:string) {
      if (!TimeTrackerReportStore.orderBy) {
        TimeTrackerReportStore.orderBy = 'asc';
        TimeTrackerReportStore.orderItem = type;
      }
      else{
        if (TimeTrackerReportStore.orderItem == type) {
          if(TimeTrackerReportStore.orderBy == 'asc') TimeTrackerReportStore.orderBy = 'desc';
          else TimeTrackerReportStore.orderBy = 'asc'
        }
        else{
          TimeTrackerReportStore.orderBy = 'asc';
          TimeTrackerReportStore.orderItem = type;
        }
      }
    }
}
