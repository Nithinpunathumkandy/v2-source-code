import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportPaginationResponse ,ReportDetails,Reports} from 'src/app/core/models/mrm/meeting-report/meeting-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ReportStore } from 'src/app/stores/mrm/meeting-report/meeting-report.store'
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class MeetingReportService {
  RightSidebarLayoutStore=RightSidebarLayoutStore
  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ReportPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ReportStore.currentPage}&status=all`;
      if (ReportStore.orderBy) params += `&order_by=${ReportStore.orderItem}&order=${ReportStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(ReportStore.searchText) params += (params ? '&q=' : '?q=')+ReportStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'meeting_list' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);

    return this._http.get<ReportPaginationResponse>('/meeting-reports' + (params ? params : '')).pipe(
      map((res: ReportPaginationResponse) => {
        ReportStore.setMeetingReports(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<ReportDetails> {
    return this._http.get<ReportDetails>('/meeting-reports/' + id).pipe(
      map((res: ReportDetails) => {
        ReportStore.setMeetingReportDetails(res);
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post('/meeting-reports', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_report_created_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(report_id:number, data: Reports): Observable<any> {
    return this._http.put('/meeting-reports/'+ report_id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_report_updated_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/meeting-reports/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_report_deleted_successfully');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            ReportStore.setCurrentPage(resp.current_page-1);
            this.getItems().subscribe();
          }
        });
        return res;
      })
    );
  }

  sortMeetingReport(type:string, text:string) {
    if (!ReportStore.orderBy) {
      ReportStore.orderBy = 'desc';
      ReportStore.orderItem = type;
    }
    else{
      if (ReportStore.orderItem == type) {
        if(ReportStore.orderBy == 'desc') ReportStore.orderBy = 'asc';
        else ReportStore.orderBy = 'desc'
      }
      else{
        ReportStore.orderBy = 'desc';
        ReportStore.orderItem = type;
      }
    }
  }

  generateTemplate() {
    this._http.get('/meeting-report-templates/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meeting_report_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (ReportStore.orderBy) params += `?order=${ReportStore.orderBy}`;
    if (ReportStore.orderItem) params += `&order_by=${ReportStore.orderItem}`;
    // if (ReportStore.searchText) params += `&q=${ReportStore.searchText}`;
    // if(RightSidebarLayoutStore.filterPageTag == 'action_plan' && RightSidebarLayoutStore.filtersAsQueryString)
    //   params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/meeting-report-templates/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meeting_report')+".xlsx");
      }
    )
  }

  exportToPdf(id:number) {
    this._http.get('/meeting-reports/'+ id + '/export-pdf', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Meeting Report.pdf");
      }
    )
  }


}
