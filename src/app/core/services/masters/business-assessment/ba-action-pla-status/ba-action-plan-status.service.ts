import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BAActionPlanStatusStore } from 'src/app/stores/masters/business-assessment/ba-action-plan-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { BAActionPlanPaginationResponse } from "src/app/core/models/masters/business-assessment/ba-action-plan-status";
@Injectable({
  providedIn: 'root'
})
export class BaActionPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BAActionPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BAActionPlanStatusStore.currentPage}`;
      if (BAActionPlanStatusStore.orderBy) params += `&order_by=${BAActionPlanStatusStore.orderItem}&order=${BAActionPlanStatusStore.orderBy}`;
    }
    if (BAActionPlanStatusStore.searchText) params += (params ? '&q=' : '?q=') + BAActionPlanStatusStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<BAActionPlanPaginationResponse>('/business-assessment-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: BAActionPlanPaginationResponse) => {
        BAActionPlanStatusStore.setBusinessAssessmentStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/business-assessment-action-plan-statuses /export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_statuses') + ".xlsx");
      }
    )
  }

  sortBAActionPlanStatusList(type: string) {
    if (!BAActionPlanStatusStore.orderBy) {
      BAActionPlanStatusStore.orderBy = 'asc';
      BAActionPlanStatusStore.orderItem = type;
    }
    else {
      if (BAActionPlanStatusStore.orderItem == type) {
        if (BAActionPlanStatusStore.orderBy == 'asc') BAActionPlanStatusStore.orderBy = 'desc';
        else BAActionPlanStatusStore.orderBy = 'asc'
      }
      else {
        BAActionPlanStatusStore.orderBy = 'asc';
        BAActionPlanStatusStore.orderItem = type;
      }
    }

  }
}
