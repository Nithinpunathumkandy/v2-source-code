import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
// import { ComplianceActionPlanStore } from 'src/app/stores/masters/business-assessment/ba-action-plan-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import {ComplianceActionPlanPaginationResponse} from 'src/app/core/models/masters/compliance-management/compliance-action-plan-status'
// import { BAActionPlanPaginationResponse } from "src/app/core/models/masters/business-assessment/ba-action-plan-status";
// import { ComplianceActionPlanStore } from 'src/app/stores/compliance-management/compliance-register/action-plan-store';
import {ComplianceActionPlanStore} from 'src/app/stores/masters/compliance-management/compliance-action-plan-store'
@Injectable({
  providedIn: 'root'
})
export class ComplianceActionPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getAllItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ComplianceActionPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceActionPlanStore.currentPage}`;
      if (ComplianceActionPlanStore.orderBy) params += `&order_by=${ComplianceActionPlanStore.orderItem}&order=${ComplianceActionPlanStore.orderBy}`;
    }
    if (ComplianceActionPlanStore.searchText) params += (params ? '&q=' : '?q=') + ComplianceActionPlanStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<ComplianceActionPlanPaginationResponse>('/compliance-register-action-plan-status' + (params ? params : '')).pipe(
      map((res: ComplianceActionPlanPaginationResponse) => {
        ComplianceActionPlanStore.setComplianceActionPlanStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/compliance-register-action-plan-status/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_statuses') + ".xlsx");
      }
    )
  }

  sortBAActionPlanStatusList(type: string) {
    if (!ComplianceActionPlanStore.orderBy) {
      ComplianceActionPlanStore.orderBy = 'asc';
      ComplianceActionPlanStore.orderItem = type;
    }
    else {
      if (ComplianceActionPlanStore.orderItem == type) {
        if (ComplianceActionPlanStore.orderBy == 'asc') ComplianceActionPlanStore.orderBy = 'desc';
        else ComplianceActionPlanStore.orderBy = 'asc'
      }
      else {
        ComplianceActionPlanStore.orderBy = 'asc';
        ComplianceActionPlanStore.orderItem = type;
      }
    }

  }
}
