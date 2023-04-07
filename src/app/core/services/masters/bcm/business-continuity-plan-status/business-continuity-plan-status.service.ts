import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessContinuityPlanStatusPaginationResponse } from 'src/app/core/models/masters/bcm/business-continuity-plan-status';
import { BusinessContinuityPlanStatusMasterStore } from 'src/app/stores/masters/bcm/business-continuity-plan-status.store';

@Injectable({
  providedIn: 'root'
})
export class BusinessContinuityPlanStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Business Continuity Plan Status List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof BusinessContinuityPlanStatusService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BusinessContinuityPlanStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${BusinessContinuityPlanStatusMasterStore.currentPage}`;
      if (BusinessContinuityPlanStatusMasterStore.orderBy) params += `&order=${BusinessContinuityPlanStatusMasterStore.orderBy}`;
      if (BusinessContinuityPlanStatusMasterStore.orderItem) params += `&order_by=${BusinessContinuityPlanStatusMasterStore.orderItem}`;
      if (BusinessContinuityPlanStatusMasterStore.searchText) params += `&q=${BusinessContinuityPlanStatusMasterStore.searchText}`;
      }
      if (BusinessContinuityPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + BusinessContinuityPlanStatusMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<BusinessContinuityPlanStatusPaginationResponse>('/bcp-statuses' + (params ? params : '')).pipe(
        map((res: BusinessContinuityPlanStatusPaginationResponse) => {
          BusinessContinuityPlanStatusMasterStore.setBusinessContinuityPlanStatus(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Business Continuity Plan Status Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof BusinessContinuityPlanStatusService
   */
    exportToExcel() {
      this._http.get('/bcp-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_continuity_plan_status')
          +".xlsx");
        }
      )
    }



    sortBusinessContinuityPlanStatusList(type:string, text:string) {
      if (!BusinessContinuityPlanStatusMasterStore.orderBy) {
        BusinessContinuityPlanStatusMasterStore.orderBy = 'asc';
        BusinessContinuityPlanStatusMasterStore.orderItem = type;
      }
      else{
        if (BusinessContinuityPlanStatusMasterStore.orderItem == type) {
          if(BusinessContinuityPlanStatusMasterStore.orderBy == 'asc') BusinessContinuityPlanStatusMasterStore.orderBy = 'desc';
          else BusinessContinuityPlanStatusMasterStore.orderBy = 'asc'
        }
        else{
          BusinessContinuityPlanStatusMasterStore.orderBy = 'asc';
          BusinessContinuityPlanStatusMasterStore.orderItem = type;
        }
      }
    }
}
