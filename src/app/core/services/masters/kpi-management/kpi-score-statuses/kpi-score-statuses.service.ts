import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiScoreStatus, KpiScoreStatusPaginationResponse } from 'src/app/core/models/masters/kpi-management/kpi-score-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiScoreStatusMasterStore } from 'src/app/stores/masters/kpi-management/kpi-score-status';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiScoreStatusesService {
  
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<KpiScoreStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${KpiScoreStatusMasterStore.currentPage}`;
        if (KpiScoreStatusMasterStore.orderBy) params += `&order_by=${KpiScoreStatusMasterStore.orderItem}&order=${KpiScoreStatusMasterStore.orderBy}`;
      }
      if(KpiScoreStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+KpiScoreStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<KpiScoreStatusPaginationResponse>('/kpi-management-kpi-score-statuses' + (params ? params : '')).pipe(
        map((res: KpiScoreStatusPaginationResponse) => {
          KpiScoreStatusMasterStore.setKpiScoreStatuses(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<KpiScoreStatus> {
      return this._http.get<KpiScoreStatus>('/kpi-management-kpi-score-statuses/' + id).pipe(
        map((res: KpiScoreStatus) => {
          KpiScoreStatusMasterStore.updateKpiScoreStatuses(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/kpi-management-kpi-score-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_score_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/kpi-management-kpi-score-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_score_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/kpi-management-kpi-score-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_score_status') + ".xlsx");
        }
      )
    }

    sortList(type:string, text:string) {
      if (!KpiScoreStatusMasterStore.orderBy) {
        KpiScoreStatusMasterStore.orderBy = 'asc';
        KpiScoreStatusMasterStore.orderItem = type;
      }
      else{
        if (KpiScoreStatusMasterStore.orderItem == type) {
          if(KpiScoreStatusMasterStore.orderBy == 'asc') KpiScoreStatusMasterStore.orderBy = 'desc';
          else KpiScoreStatusMasterStore.orderBy = 'asc'
        }
        else{
          KpiScoreStatusMasterStore.orderBy = 'asc';
          KpiScoreStatusMasterStore.orderItem = type;
        }
      }
    }
}
