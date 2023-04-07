import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessContinuityStrategySolutionStatusPaginationResponse } from 'src/app/core/models/masters/bcm/business-continuity-strategy-solution-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BusinessContinuityStrategySolutionStatusMasterStore } from 'src/app/stores/masters/bcm/business-continuity-strategy-solution-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessContinuityStrategySolutionStatusService {

  constructor(
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<BusinessContinuityStrategySolutionStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BusinessContinuityStrategySolutionStatusMasterStore.currentPage}`;
      if (BusinessContinuityStrategySolutionStatusMasterStore.orderBy) params += `&order_by=${BusinessContinuityStrategySolutionStatusMasterStore.orderItem}&order=${BusinessContinuityStrategySolutionStatusMasterStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (BusinessContinuityStrategySolutionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + BusinessContinuityStrategySolutionStatusMasterStore.searchText;
    if (is_all) params += '&status=all';
    return this._http.get<BusinessContinuityStrategySolutionStatusPaginationResponse>('/bcss-statuses' + (params ? params : '')).pipe(
      map((res: BusinessContinuityStrategySolutionStatusPaginationResponse) => {
        BusinessContinuityStrategySolutionStatusMasterStore.setBusinessContinuityStrategySolutionStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/bcss-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bcss_statuses') + ".xlsx");
      }
    )
  }

  sortBusinessContinuityStrategySolutionStatus(type: string, text: string) {
    if (!BusinessContinuityStrategySolutionStatusMasterStore.orderBy) {
      BusinessContinuityStrategySolutionStatusMasterStore.orderBy = 'asc';
      BusinessContinuityStrategySolutionStatusMasterStore.orderItem = type;
    }
    else {
      if (BusinessContinuityStrategySolutionStatusMasterStore.orderItem == type) {
        if (BusinessContinuityStrategySolutionStatusMasterStore.orderBy == 'asc') BusinessContinuityStrategySolutionStatusMasterStore.orderBy = 'desc';
        else BusinessContinuityStrategySolutionStatusMasterStore.orderBy = 'asc'
      }
      else {
        BusinessContinuityStrategySolutionStatusMasterStore.orderBy = 'asc';
        BusinessContinuityStrategySolutionStatusMasterStore.orderItem = type;
      }
    }
  }
}
