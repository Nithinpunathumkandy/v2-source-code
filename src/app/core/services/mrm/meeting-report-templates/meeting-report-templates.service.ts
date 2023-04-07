import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportTemplates, ReportTemplatesResponse } from 'src/app/core/models/mrm/meeting-report-templates/meeting-report-templates';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MeetingReportTemeplates } from 'src/app/stores/mrm/meeting-report-templates/meeting-report-templates';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingReportTemplatesService {

  constructor(private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status?:string): Observable<ReportTemplatesResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MeetingReportTemeplates.currentPage}&status=${status? status:'all'}`;
      if (MeetingReportTemeplates.orderBy) params += `&order_by=${MeetingReportTemeplates.orderItem}&order=${MeetingReportTemeplates.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MeetingReportTemeplates.searchText) params += (params ? '&q=' : '?q=')+MeetingReportTemeplates.searchText;

    return this._http.get<ReportTemplatesResponse>('/meeting-report-templates' + (params ? params : '')).pipe(
      map((res: ReportTemplatesResponse) => {
        MeetingReportTemeplates.setMeetingReportTemplates(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<ReportTemplates> {
    return this._http.get<ReportTemplates>('/meeting-report-templates/' + id).pipe(
      map((res: ReportTemplates) => {
        MeetingReportTemeplates.setMeetingReportTemplatesDetails(res);
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post('/meeting-report-templates', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_templates_is_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(report_id:number, data: ReportTemplates): Observable<any> {
    return this._http.put('/meeting-report-templates/'+ report_id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_templates_has_been_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/meeting-report-templates/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_templates_has_been_deleted');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            MeetingReportTemeplates.setCurrentPage(resp.current_page-1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/meeting-report-templates/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_templates_has_been_activated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/meeting-report-templates/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_templates_has_been_deactivated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getSearchItems(additionalParams:string){
    let params='';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    return this._http.get<ReportTemplatesResponse>('/meeting-report-templates' + (params ? params : '')).pipe(
      map((res: ReportTemplatesResponse) => {
        MeetingReportTemeplates.setMeetingReportTemplates(res);

        return res;
      })
    );
  }

  sortMeetingReportTemplatesList(type:string, text:string) {
    if (!MeetingReportTemeplates.orderBy) {
      MeetingReportTemeplates.orderBy = 'desc';
      MeetingReportTemeplates.orderItem = type;
    }
    else{
      if (MeetingReportTemeplates.orderItem == type) {
        if(MeetingReportTemeplates.orderBy == 'desc') MeetingReportTemeplates.orderBy = 'asc';
        else MeetingReportTemeplates.orderBy = 'desc'
      }
      else{
        MeetingReportTemeplates.orderBy = 'desc';
        MeetingReportTemeplates.orderItem = type;
      }
    }
  }

  generateTemplate() {
    this._http.get('/meeting-report-templates/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meeting_template_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/meeting-report-templates/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mrm_meeting_template')+".xlsx");
      }
    )
  }

  saveMeetingReportTemplates(templateId,pageId,data): Observable<any> {
    return this._http.put('/meeting-report-templates/'+templateId+'/pages/'+pageId, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_template_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  setDocumentDetails(imageDetails,url){
    MeetingReportTemeplates.setDocumentDetails(imageDetails,url);
  }

}
