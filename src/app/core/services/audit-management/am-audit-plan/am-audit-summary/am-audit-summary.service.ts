import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditSummary, SummaryDepartment } from 'src/app/core/models/audit-management/am-audit-plan/am-audit-summary';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditSummaryStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-summary.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditSummaryService {

  constructor(private _http:HttpClient,private _utilityService:UtilityService) { }

  getItem(id: number): Observable<AmAuditSummary> {
    return this._http.get<AmAuditSummary>('/am-annual-plans/'+ id+'/summaries').pipe(
      map((res: AmAuditSummary) => {
        AmAuditSummaryStore.setAuditSummary(res);
        return res;
      })
    );
  }

  getAuditeeDepartment(id: number): Observable<SummaryDepartment[]> {
    return this._http.get<SummaryDepartment[]>(`/am-annual-plans/${id}/summary/by-auditee-departments`).pipe(
      map((res: SummaryDepartment[]) => {
        AmAuditSummaryStore.setAuditeeDepartment(res);
        return res;
      })
    );
  }

  getAuditors(id: number): Observable<AmAuditSummary> {
    return this._http.get<AmAuditSummary>(`/am-annual-plans/${id}/summary/by-auditors`).pipe(
      map((res: AmAuditSummary) => {
        AmAuditSummaryStore.setAuditors(res);
        return res;
      })
    );
  }

  getAuditCalendar(id: number): Observable<AmAuditSummary> {
    return this._http.get<AmAuditSummary>(`/am-annual-plans/${id}/summary/audit-calendar`).pipe(
      map((res: AmAuditSummary) => {
        AmAuditSummaryStore.setAuditCalendar(res);
        return res;
      })
    );
  }

  getAuditByManager(id:number){
    return this._http.get<AmAuditSummary>(`/am-annual-plans/${id}/summary/by-audit-manager`).pipe(
      map((res: AmAuditSummary) => {
        AmAuditSummaryStore.setAuditByManager(res);
        return res;
      })
    );
  }

  export(id){
    return this._http.get(`/am-annual-plans/${id}/summary-export`,{ responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        this._utilityService.downloadFile(res,'Summary-report.pdf');
        return res;
      })
    );
  }
}
