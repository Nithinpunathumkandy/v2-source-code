import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAnnualPlanStatus, AmAnnualPlanStatusPaginationResponse } from 'src/app/core/models/masters/audit-management/am-annual-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAnnualPlanStatusMasterStore } from 'src/app/stores/masters/audit-management/am-annual-plan-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAnnualPlanStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<AmAnnualPlanStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AmAnnualPlanStatusMasterStore.currentPage}`;
        if (AmAnnualPlanStatusMasterStore.orderBy) params += `&order_by=${AmAnnualPlanStatusMasterStore.orderItem}&order=${AmAnnualPlanStatusMasterStore.orderBy}`;
      }
      if(AmAnnualPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+AmAnnualPlanStatusMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<AmAnnualPlanStatusPaginationResponse>('/am-annual-plan-statuses' + (params ? params : '')).pipe(
        map((res: AmAnnualPlanStatusPaginationResponse) => {
          AmAnnualPlanStatusMasterStore.setAmAnnualPlanStatus(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<AmAnnualPlanStatus> {
      return this._http.get<AmAnnualPlanStatus>('/am-annual-plan-statuses/' + id).pipe(
        map((res: AmAnnualPlanStatus) => {
          AmAnnualPlanStatusMasterStore.updateAmAnnualPlanStatus(res)
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/am-annual-plan-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/am-annual-plan-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    exportToExcel() {
      this._http.get('/am-annual-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_annual_plan_status') + ".xlsx");
        }
      )
    }


    sortAmAnnualPlanStatusList(type:string, text:string) {
      if (!AmAnnualPlanStatusMasterStore.orderBy) {
        AmAnnualPlanStatusMasterStore.orderBy = 'asc';
        AmAnnualPlanStatusMasterStore.orderItem = type;
      }
      else{
        if (AmAnnualPlanStatusMasterStore.orderItem == type) {
          if(AmAnnualPlanStatusMasterStore.orderBy == 'asc') AmAnnualPlanStatusMasterStore.orderBy = 'desc';
          else AmAnnualPlanStatusMasterStore.orderBy = 'asc'
        }
        else{
          AmAnnualPlanStatusMasterStore.orderBy = 'asc';
          AmAnnualPlanStatusMasterStore.orderItem = type;
        }
      }
    }
}
