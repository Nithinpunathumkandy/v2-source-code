import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileReport, ReportArray } from 'src/app/core/models/my-profile/profile/profile-report';
import { ProfileReportStore } from 'src/app/stores/my-profile/profile/profile-report-store';

@Injectable({
  providedIn: 'root'
})
export class ProfileReportService {

  constructor(private _http:HttpClient) { }

  getprofileReport(){
    return this._http.get('/users/me/reports').pipe(
      map((res ) => {
        ProfileReportStore.setProfileReport(res);
        return res;
      })
    );
  }

  getItemById(reportId: number): Observable<ReportArray>{
    return this._http.get<ReportArray>('/users/me/reports/' + reportId).pipe(
      map((res: ReportArray) => {
        ProfileReportStore.setReportDetails(res)
      return res;
    }))
  }
}
