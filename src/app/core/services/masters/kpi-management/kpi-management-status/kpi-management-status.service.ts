import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiManagementStatus, KpiManagementStatusPaginationResponse } from 'src/app/core/models/masters/kpi-management/kpi-management-status';
import { KpiManagementStatusMasterStore } from 'src/app/stores/masters/kpi-management/kpi-management-status-store';

@Injectable({
  providedIn: 'root'
})
export class KpiManagementStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<KpiManagementStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${KpiManagementStatusMasterStore.currentPage}`;
        if (KpiManagementStatusMasterStore.orderBy) params += `&order_by=${KpiManagementStatusMasterStore.orderItem}&order=${KpiManagementStatusMasterStore.orderBy}`;
      }
      if(KpiManagementStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+KpiManagementStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<KpiManagementStatusPaginationResponse>('/kpi-management-statuses' + (params ? params : '')).pipe(
        map((res: KpiManagementStatusPaginationResponse) => {
          KpiManagementStatusMasterStore.setKpiManagementStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<KpiManagementStatus> {
      return this._http.get<KpiManagementStatus>('/kpi-management-statuses/' + id).pipe(
        map((res: KpiManagementStatus) => {
          KpiManagementStatusMasterStore.updateKpiManagementStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/kpi-management-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_management_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/kpi-management-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_management_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/kpi-management-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_management_status') + ".xlsx");
        }
      )
    }


    sortKpiManagementStatusList(type:string, text:string) {
      if (!KpiManagementStatusMasterStore.orderBy) {
        KpiManagementStatusMasterStore.orderBy = 'asc';
        KpiManagementStatusMasterStore.orderItem = type;
      }
      else{
        if (KpiManagementStatusMasterStore.orderItem == type) {
          if(KpiManagementStatusMasterStore.orderBy == 'asc') KpiManagementStatusMasterStore.orderBy = 'desc';
          else KpiManagementStatusMasterStore.orderBy = 'asc'
        }
        else{
          KpiManagementStatusMasterStore.orderBy = 'asc';
          KpiManagementStatusMasterStore.orderItem = type;
        }
      }
    }
}
