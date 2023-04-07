import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlAssessmentStatusPaginationResponse } from 'src/app/core/models/masters/business-assessment/control-assesment-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ControlAssessmentStatusMasterStore } from 'src/app/stores/masters/business-assessment/control-assessment-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ControlAssessmentStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ControlAssessmentStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ControlAssessmentStatusMasterStore.currentPage}`;
      if (ControlAssessmentStatusMasterStore.orderBy) params += `&order_by=${ControlAssessmentStatusMasterStore.orderItem}&order=${ControlAssessmentStatusMasterStore.orderBy}`;
    }
    if(ControlAssessmentStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+ControlAssessmentStatusMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ControlAssessmentStatusPaginationResponse>('/control-assessment-statuses' + (params ? params : '')).pipe(
      map((res: ControlAssessmentStatusPaginationResponse) => {
        ControlAssessmentStatusMasterStore.setBusinessAssessmentStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/control-assessment-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_assessment_statuses')+".xlsx");
      }
    )
  }

  sortBusinessAssessmentStatusList(type:string, text:string) {
    if (!ControlAssessmentStatusMasterStore.orderBy) {
      ControlAssessmentStatusMasterStore.orderBy = 'asc';
      ControlAssessmentStatusMasterStore.orderItem = type;
    }
    else{
      if (ControlAssessmentStatusMasterStore.orderItem == type) {
        if(ControlAssessmentStatusMasterStore.orderBy == 'asc') ControlAssessmentStatusMasterStore.orderBy = 'desc';
        else ControlAssessmentStatusMasterStore.orderBy = 'asc'
      }
      else{
        ControlAssessmentStatusMasterStore.orderBy = 'asc';
        ControlAssessmentStatusMasterStore.orderItem = type;
      }
    }
 
  }
}
