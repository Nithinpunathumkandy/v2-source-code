import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Report } from 'src/app/core/models/human-capital/users/user-report';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UserReportStore } from 'src/app/stores/human-capital/users/user-report.store';


@Injectable({
  providedIn: 'root'
})
export class UserReportService {

  constructor(private _http: HttpClient,private _utilityService: UtilityService) { }

  getAllItem(params?:string,reportId?:number,id?:number): Observable<Report[]> {
    return this._http.get<Report[]>('/users/'+(id?id:UsersStore.user_id)+'/user-reports'+(params?params:'')).pipe(
      map((res: Report[]) => { 
          
        if(reportId){
          this.getItem(reportId).subscribe();
        }
        UserReportStore.setReports(res);
        return res;
      })
    );
  }

  getItem(params?:number,id?:number): Observable<Report[]> {
    return this._http.get<Report[]>('/users/'+(id?id:UsersStore.user_id)+'/user-reports/'+(params?params:'')).pipe(
      map((res: Report[]) => {  
        UserReportStore.setIndividualReportDetails(res,(params?params:''));
        return res;
      })
    );
  }

  updateItem(id, item: Report): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/user-reports/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getAllItem('?status=all&order_by=report_frequency_id').subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/users/'+UsersStore.user_id+'/user-reports', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getAllItem('?order_by=report_frequency_id',res['id']).subscribe();
        return res;
      })
    );
  }

  updateStatus(status:string,user,id){
    return this._http.put('/users/'+UsersStore.user_id+'/user-reports/'+id+'/'+status, user).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        //this.getAllItems('?page=1&designation_ids=1&limit=16').subscribe();
        this.getAllItem('?status=all&order_by=report_frequency_id',id).subscribe();
        return res;
      })
    );
  }

 

  addSubmitted(id,item) {
    return this._http.put('/users/'+UsersStore.user_id+'/user-reports/'+id+'/submitted-to-users', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getAllItem('?status=all&order_by=report_frequency_id',res['id']).subscribe();
        return res;
      })
    );
  }



  delete(id: number) {
    return this._http.delete('/users/'+UsersStore.user_id+'/user-reports/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getAllItem('?status=all&order_by=report_frequency_id').subscribe();
        return res;
      })
    );
  }

  deleteSubmitted(report_id: number,submitted_id:number) {
    return this._http.delete('/users/'+UsersStore.user_id+'/user-reports/' + report_id+'/submitted-to-users/'+submitted_id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getAllItem('?status=all&order_by=report_frequency_id').subscribe();
        return res;
      })
    );
  }

  searchReport(params,id){
    return this.getAllItem(params ? params : '',null,id).pipe(
      map((res: Report[]) => {
        UserReportStore.setReports(res);
        return res;
      })
    );
  }

}
