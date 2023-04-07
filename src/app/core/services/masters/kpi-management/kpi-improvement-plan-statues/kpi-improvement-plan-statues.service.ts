import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiImprovementPlansStatus, KpiImprovementPlansStatusPaginationResponse } from 'src/app/core/models/masters/kpi-management/kpi-improvrement-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiImprovementPlanStatusMasterStore } from 'src/app/stores/masters/kpi-management/kpi-improvement-plan-status';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiImprovementPlanStatuesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<KpiImprovementPlansStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${KpiImprovementPlanStatusMasterStore.currentPage}`;
        if (KpiImprovementPlanStatusMasterStore.orderBy) params += `&order_by=${KpiImprovementPlanStatusMasterStore.orderItem}&order=${KpiImprovementPlanStatusMasterStore.orderBy}`;
      }
      if(KpiImprovementPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+KpiImprovementPlanStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<KpiImprovementPlansStatusPaginationResponse>('/kpi-management-kpi-improvement-plan-statuses' + (params ? params : '')).pipe(
        map((res: KpiImprovementPlansStatusPaginationResponse) => {
          KpiImprovementPlanStatusMasterStore.setKpiImprvementPlansStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<KpiImprovementPlansStatus> {
      return this._http.get<KpiImprovementPlansStatus>('/kpi-management-kpi-improvement-plan-statuses/' + id).pipe(
        map((res: KpiImprovementPlansStatus) => {
          KpiImprovementPlanStatusMasterStore.updateKpiImprovementPlansStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/kpi-management-kpi-improvement-plan-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_improvement_plan_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/kpi-management-kpi-improvement-plan-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'kpi_improvement_plan_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/kpi-management-kpi-improvement-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_improvement_plan_status') + ".xlsx");
        }
      )
    }


    sortList(type:string, text:string) {
      if (!KpiImprovementPlanStatusMasterStore.orderBy) {
        KpiImprovementPlanStatusMasterStore.orderBy = 'asc';
        KpiImprovementPlanStatusMasterStore.orderItem = type;
      }
      else{
        if (KpiImprovementPlanStatusMasterStore.orderItem == type) {
          if(KpiImprovementPlanStatusMasterStore.orderBy == 'asc') KpiImprovementPlanStatusMasterStore.orderBy = 'desc';
          else KpiImprovementPlanStatusMasterStore.orderBy = 'asc'
        }
        else{
          KpiImprovementPlanStatusMasterStore.orderBy = 'asc';
          KpiImprovementPlanStatusMasterStore.orderItem = type;
        }
      }
    }
}
