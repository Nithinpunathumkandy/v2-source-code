import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditPlanStatusesMasterStore } from 'src/app/stores/masters/internal-audit/audit-plan-statuses.store';
import { AuditPlanStatusesPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-plan-statuses';

@Injectable({
  providedIn: 'root'
})
export class AuditPlanStatusesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Audit Plan Statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof AuditPlanStatusesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AuditPlanStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${AuditPlanStatusesMasterStore.currentPage}`;
      if (AuditPlanStatusesMasterStore.orderBy) params += `&order=${AuditPlanStatusesMasterStore.orderBy}`;
      if (AuditPlanStatusesMasterStore.orderItem) params += `&order_by=${AuditPlanStatusesMasterStore.orderItem}`;
      if (AuditPlanStatusesMasterStore.searchText) params += `&q=${AuditPlanStatusesMasterStore.searchText}`;
      }
      if (AuditPlanStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + AuditPlanStatusesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AuditPlanStatusesPaginationResponse>('/audit-plan-statuses' + (params ? params : '')).pipe(
        map((res: AuditPlanStatusesPaginationResponse) => {
          AuditPlanStatusesMasterStore.setAuditPlanStatuses(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Audit Plan Statuses Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof AuditPlanStatusesService
   */
    exportToExcel() {
      this._http.get('/audit-plan-statuses', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_plan_status')
          +".xlsx");
        }
      )
    }



    sortAuditPlanStatusesList(type:string, text:string) {
      if (!AuditPlanStatusesMasterStore.orderBy) {
        AuditPlanStatusesMasterStore.orderBy = 'desc';
        AuditPlanStatusesMasterStore.orderItem = type;
      }
      else{
        if (AuditPlanStatusesMasterStore.orderItem == type) {
          if(AuditPlanStatusesMasterStore.orderBy == 'desc') AuditPlanStatusesMasterStore.orderBy = 'asc';
          else AuditPlanStatusesMasterStore.orderBy = 'desc'
        }
        else{
          AuditPlanStatusesMasterStore.orderBy = 'desc';
          AuditPlanStatusesMasterStore.orderItem = type;
        }
      }
    }
}
