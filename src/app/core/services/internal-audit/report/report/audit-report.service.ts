import { Injectable } from '@angular/core';
import { AuditReport,AuditReportPaginationResponse } from 'src/app/core/models/internal-audit/report/audit-report';
import {AuditReportsStore} from 'src/app/stores/internal-audit/report/audit-report-store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class AuditReportService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditReportPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditReportsStore.currentPage}`;
        if (AuditReportsStore.orderBy) params += `&order_by=${AuditReportsStore.orderItem}&order=${AuditReportsStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditReportsStore.searchText) params += (params ? '&q=' : '?q=')+AuditReportsStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'ia_report' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditReportPaginationResponse>('/audit-reports' + (params ? params : '')).pipe(
        map((res: AuditReportPaginationResponse) => {
          AuditReportsStore.setAuditReports(res);
          return res;
        })
      );
    }
  
    getAllItems(): Observable<AuditReport[]>{
      return this._http.get<AuditReport[]>('/audit-reports?is_all=true').pipe(
        map((res: AuditReport[]) => {
          
          AuditReportsStore.setAllAuditReports(res);
          return res;
        })
      );
    }


    getItem(id): Observable<AuditReport> {
      return this._http.get<AuditReport>('/audit-reports/'+id).pipe((
        map((res:AuditReport)=>{
          AuditReportsStore.setInvidualReport(res);
          return res;
        })
      ))
    } 

    saveItem(item: any) {
      return this._http.post('/audit-reports', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'generate_report_message');
          AuditReportsStore.setLastInsertedId(res.id);
          this.getItems().subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/audit-reports/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_audit_report_message');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditReportsStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
  
          return res;
        })
      );
    }
    export(id:number) {
      this._http.get('/audit-reports/'+ id + '/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "AuditReport.pdf");
        }
      )
    }

}
