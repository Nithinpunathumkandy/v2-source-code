import { Injectable } from '@angular/core';
import { Report } from 'src/app/core/models/human-capital/user-report/user-actual-report';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UserReportStore } from 'src/app/stores/human-capital/users/user-report.store';
import { UserActualReportStore } from 'src/app/stores/human-capital/user-report/user-actual-report.store';
import { ReportPaginationResponse } from 'src/app/core/models/human-capital/user-report/user-actual-report';


@Injectable({
  providedIn: 'root'
})
export class UserActualReportService {

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  // getAllItem(user_id,params?:string): Observable<Report[]> {
  //   return this._http.get<Report[]>('/users/'+user_id+'/user-actual-reports'+(params?params:'')).pipe(
  //     map((res: Report[]) => {  
  //       UserActualReportStore.setReports(res);
  //       return res;
  //     })
  //   );
  // }

  

  getDocuments(params?:string): Observable<ReportPaginationResponse> {
    return this._http.get<ReportPaginationResponse>('/user-actual-report-documents'+(params?params:'')).pipe(
      map((res: ReportPaginationResponse) => {  
        UserActualReportStore.setUserReportDetails(res);
        return res;
      })
    );
  }

  getItem(params?:string): Observable<Report> {
    return this._http.get<Report>('/user-actual-report-documents/'+(params?params:'')).pipe(
      map((res: Report) => {  
        UserActualReportStore.setIndividualReportDetails(res);
        return res;
      })
    );
  }

  setDocumentDetails(imageDetails,url){
    UserActualReportStore.setDocumentDetails(imageDetails,url);
  }

  updateItem(user_id,id, item: Report): Observable<any> {
    return this._http.put('/users/'+user_id+'/user-actual-reports/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        // this.getDocuments().subscribe();
        return res;
      })
    );
  }

  saveItem(user_id,item) {
    return this._http.post('/users/'+user_id+'/user-actual-reports', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        // this.getDocuments().subscribe();
        return res;
      })
    );
  }

  delete(user_id,id: number) {
    return this._http.delete('/users/'+user_id+'/user-actual-reports/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        // this.getDocuments().subscribe();
        return res;
      })
    );
  }





}


