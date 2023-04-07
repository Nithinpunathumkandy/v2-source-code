import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessAssessmentStatusPaginationResponse } from 'src/app/core/models/masters/business-assessment/business-assessment-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BusinessAssessmentStatusMasterStore } from 'src/app/stores/masters/business-assessment/business-assessment-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessAssessmentStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<BusinessAssessmentStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BusinessAssessmentStatusMasterStore.currentPage}`;
      if (BusinessAssessmentStatusMasterStore.orderBy) params += `&order_by=${BusinessAssessmentStatusMasterStore.orderItem}&order=${BusinessAssessmentStatusMasterStore.orderBy}`;
    }
    if(BusinessAssessmentStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+BusinessAssessmentStatusMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<BusinessAssessmentStatusPaginationResponse>('/business-assessment-statuses' + (params ? params : '')).pipe(
      map((res: BusinessAssessmentStatusPaginationResponse) => {
        BusinessAssessmentStatusMasterStore.setBusinessAssessmentStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/business-assessment-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_statuses')+".xlsx");
      }
    )
  }

  sortBusinessAssessmentStatusList(type:string, text:string) {
    if (!BusinessAssessmentStatusMasterStore.orderBy) {
      BusinessAssessmentStatusMasterStore.orderBy = 'asc';
      BusinessAssessmentStatusMasterStore.orderItem = type;
    }
    else{
      if (BusinessAssessmentStatusMasterStore.orderItem == type) {
        if(BusinessAssessmentStatusMasterStore.orderBy == 'asc') BusinessAssessmentStatusMasterStore.orderBy = 'desc';
        else BusinessAssessmentStatusMasterStore.orderBy = 'asc'
      }
      else{
        BusinessAssessmentStatusMasterStore.orderBy = 'asc';
        BusinessAssessmentStatusMasterStore.orderItem = type;
      }
    }
 
  }
}
