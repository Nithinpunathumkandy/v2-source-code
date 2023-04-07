import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IncidentReport, IncidentReportPaginationResponse } from 'src/app/core/models/incident-management/report/incident-report';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentReportStore } from 'src/app/stores/incident-management/report/incident-report.store';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';


@Injectable({
  providedIn: 'root'
})
export class IncidentReportService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getAllinvestigation(getAll: boolean = false,additionalParams?:string,is_all:boolean = false){
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentReportStore.currentPage}`;
      if (IncidentReportStore.reportorderBy) params += `&order_by=${IncidentReportStore.reportorderItem}&order=${IncidentReportStore.reportorderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(IncidentReportStore.searchText) params += (params ? '&q=' : '?q=')+IncidentReportStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<IncidentReportPaginationResponse>('/incident-reports'  + (params ? params : '')).pipe(
      map((res: IncidentReportPaginationResponse ) => {
        IncidentReportStore.setIncidentReport(res);
        return res;
      })
    );

  }

  getIncidentReport(getAll: boolean = false,additionalParams?:string,is_all:boolean = false){
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentReportStore.currentPage}`;
      if (IncidentReportStore.reportorderBy) params += `&order_by=${IncidentReportStore.reportorderItem}&order=${IncidentReportStore.reportorderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(IncidentReportStore.searchText) params += (params ? '&q=' : '?q=')+IncidentReportStore.searchText;
    if(is_all) params += '&status=all';
    return this._http.get<IncidentReportPaginationResponse>('/incident-reports?incident_ids='+[IncidentStore.selectedId]  + (params ? params : '')).pipe(
      map((res: IncidentReportPaginationResponse ) => {
        IncidentReportStore.setIncidentReport(res);
        if(res.data.length > 0) IncidentReportStore.reportId = res.data[0].id;
        return res;
      })
    );

  }

  saveReport(item: any,) {
    return this._http.post('/incident-reports', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_report_added');
        return res;
      })
    );
  }

  updateReport(item: any,id) {
    return this._http.post('/incident-reports'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'incident_report_updated');
        return res;
      })
    );
  }

  getItem(id): Observable<IncidentReport> {
    return this._http.get<IncidentReport>('/incident-reports/'+id).pipe((
      map((res:IncidentReport)=>{
        IncidentReportStore.setIndividualIncidentReport(res);
        return res;
      })
    ))
  }

  delete(id: number,report_id?) {
    return this._http.delete('/incident-reports/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_incident_report');
        // this.getAllinvestigation().subscribe(resp=>{
        //   // if(resp.from==null){
        //   //   IncidentStore.setCurrentPage(resp.current_page != 1 ? resp.current_page-1 : 1);
        //   //   this.getItems().subscribe();
        //   // }
        // });
        if(report_id){
          this.getIncidentReport().subscribe();
        }else{
          this.getAllinvestigation().subscribe();
        }
        

        return res;
      })
    );
  }

  sortReportList(type, callList: boolean = true) {
    if (!IncidentReportStore.reportorderBy) {
      IncidentReportStore.reportorderBy = 'asc';
      IncidentReportStore.reportorderItem = type;
    }
    else{
      if (IncidentReportStore.reportorderItem == type) {
        if(IncidentReportStore.reportorderBy == 'asc') IncidentReportStore.reportorderBy = 'desc';
        else IncidentReportStore.reportorderBy = 'asc'
      }
      else{
        IncidentReportStore.reportorderBy = 'asc';
        IncidentReportStore.reportorderItem = type;
      }
    }
}
}
