import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Report,Frequency,ReportPaginationResponse } from '../../../../models/masters/human-capital/user-report';
import { map } from 'rxjs/operators';
import { UserDocumentTypeMasterStore } from 'src/app/stores/masters/human-capital/user-document-type-master.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReportMasterStore } from 'src/app/stores/masters/human-capital/report-master.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService
  ) { }

  // getFrequencies(params?:string): Observable<Frequency[]> {
   
  //   return this._http.get<Frequency[]>('/report-frequencies' + (params ? params : '')).pipe(
  //     map((res: Frequency[]) => {
  //       ReportMasterStore.setFrequencies(res['data']);
  //       return res;
  //     })
  //   );
  // }

  getReports(getAll: boolean = false ,additionalParams?: string,status:boolean=false): Observable<ReportPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ReportMasterStore.currentPage}`;
      if (ReportMasterStore.orderBy) params += `&order_by=${ReportMasterStore.orderItem}&order=${ReportMasterStore.orderBy}`;
    }

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }

    if(ReportMasterStore.searchText) params += (params ? '&q=' : '?q=')+ReportMasterStore.searchText;
    if(status) params += (params? '&':'?q=')+'status=all';
    return this._http.get<ReportPaginationResponse>('/user-reports' + (params ? params : '')).pipe(
      map((res: ReportPaginationResponse) => {
        ReportMasterStore.setReports(res);
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/user-reports/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('user_report_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/user-reports/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('user_reports')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/user-reports/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/user-reports/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getReports(false,null,true).subscribe();
        return res;
      })
    )
  }

  setDocumentDetails(imageDetails,url){
    ReportMasterStore.setDocumentDetails(imageDetails,url);
  }

  // searchFrequency(params){
  //   return this.getFrequencies(params ? params : '').pipe(
  //     map((res: Frequency[]) => {
  //       ReportMasterStore.setFrequencies(res);
  //       return res;
  //     })
  //   );
  // }

  updateItem(id, item: Report): Observable<any> {
    return this._http.put('/user-reports/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getReports(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/user-reports', item).pipe(
      map(res => {
        ReportMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getReports(false,null,true).subscribe();
        else this.getReports().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/user-reports/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getReports(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ReportMasterStore.setCurrentPage(resp.current_page-1);
            this.getReports(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/user-reports/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getReports(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/user-reports/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getReports(false,null,true).subscribe();
        return res;
      })
    );
  }

  getIndividualReport(id: number): Observable<Report> {
    return this._http.get<Report>('/user-reports/' + id).pipe(
      map((res: Report) => {
        ReportMasterStore.setIndividualReportDetails(res);
        return res;
      })
    );
  }

  searchReport(params){
    return this.getReports(params ? params : '').pipe(
      map((res: ReportPaginationResponse) => {
        ReportMasterStore.setReports(res);
        return res;
      })
    );
  }

  sortUserReportList(type:string, text:string) {
    if (!ReportMasterStore.orderBy) {
      ReportMasterStore.orderBy = 'asc';
      ReportMasterStore.orderItem = type;
    }
    else{
      if (ReportMasterStore.orderItem == type) {
        if(ReportMasterStore.orderBy == 'asc') ReportMasterStore.orderBy = 'desc';
        else ReportMasterStore.orderBy = 'asc'
      }
      else{
        ReportMasterStore.orderBy = 'asc';
        ReportMasterStore.orderItem = type;
      }
    }
    if(!text)
    this.getReports(false,null,true).subscribe();
  else
  this.getReports(false,`&q=${text}`,true).subscribe();
  }


}
