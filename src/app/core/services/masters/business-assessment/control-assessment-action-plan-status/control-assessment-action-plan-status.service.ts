import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlAssessmentActionPlanStatusPaginationResponse } from 'src/app/core/models/masters/business-assessment/control-assessment-action-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ControlAssessmentActionPlanStatusMasterStore } from 'src/app/stores/masters/business-assessment/control-assessment-action-plan-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ControlAssessmentActionPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ControlAssessmentActionPlanStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlAssessmentActionPlanStatusMasterStore.currentPage}`;
      if (ControlAssessmentActionPlanStatusMasterStore.orderBy) params += `&order_by=${ControlAssessmentActionPlanStatusMasterStore.orderItem}&order=${ControlAssessmentActionPlanStatusMasterStore.orderBy}`;
    }
    if(ControlAssessmentActionPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ControlAssessmentActionPlanStatusMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ControlAssessmentActionPlanStatusPaginationResponse>('/control-assessment-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: ControlAssessmentActionPlanStatusPaginationResponse) => {
        ControlAssessmentActionPlanStatusMasterStore.setControlAssessmentActionPlanStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/control-assessment-action-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control-assessment-action-plan-statuses')+".xlsx");
      }
    )
  }

  sortControlAssessmentActionPlanStatusList(type:string, text:string) {
    if (!ControlAssessmentActionPlanStatusMasterStore.orderBy) {
      ControlAssessmentActionPlanStatusMasterStore.orderBy = 'asc';
      ControlAssessmentActionPlanStatusMasterStore.orderItem = type;
    }
    else{
      if (ControlAssessmentActionPlanStatusMasterStore.orderItem == type) {
        if(ControlAssessmentActionPlanStatusMasterStore.orderBy == 'asc') ControlAssessmentActionPlanStatusMasterStore.orderBy = 'desc';
        else ControlAssessmentActionPlanStatusMasterStore.orderBy = 'asc'
      }
      else{
        ControlAssessmentActionPlanStatusMasterStore.orderBy = 'asc';
        ControlAssessmentActionPlanStatusMasterStore.orderItem = type;
      }
    }
}
}
