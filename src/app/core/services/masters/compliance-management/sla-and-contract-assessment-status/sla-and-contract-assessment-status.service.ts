import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SlaAndContractAssessmentStatusPaginationResponse } from 'src/app/core/models/masters/compliance-management/sla-and-contract-assessment-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SlaAndContractAssessmentStatusMasterStore } from 'src/app/stores/masters/compliance-management/sla-and-contract-assessment-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class SlaAndContractAssessmentStatusService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<SlaAndContractAssessmentStatusPaginationResponse> {
let params = '';
if (!getAll) {
params = `?page=${SlaAndContractAssessmentStatusMasterStore.currentPage}`;
if (SlaAndContractAssessmentStatusMasterStore.orderBy) params += `&order_by=${SlaAndContractAssessmentStatusMasterStore.orderItem}&order=${SlaAndContractAssessmentStatusMasterStore.orderBy}`;
if(SlaAndContractAssessmentStatusMasterStore.searchTerm) params += `&q=${SlaAndContractAssessmentStatusMasterStore.searchTerm}`;
}
if(status) params += (params ? '&' : '?')+'status=all';
if(additionalParams) params += additionalParams;
return this._http.get<SlaAndContractAssessmentStatusPaginationResponse>('/sla-and-contract-assessment-statuses' + (params ? params : '')).pipe(
map((res: SlaAndContractAssessmentStatusPaginationResponse) => {

  SlaAndContractAssessmentStatusMasterStore.setSlaAndContractAssessmentStatus(res);
return res;
})
);

}
exportToExcel() {
this._http.get('/sla-and-contract-assessment-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
(response: any) => {
this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sla_and_contract_assessment_status')+".xlsx");
}
)
}

searchStatus(params){
return this.getItems(params ? params : '').pipe(
map((res: SlaAndContractAssessmentStatusPaginationResponse) => {
  SlaAndContractAssessmentStatusMasterStore.setSlaAndContractAssessmentStatus(res);
return res;
})
);
}

sortStatusList(type:string, text:string) {
if (!SlaAndContractAssessmentStatusMasterStore.orderBy) {
  SlaAndContractAssessmentStatusMasterStore.orderBy = 'asc';
  SlaAndContractAssessmentStatusMasterStore.orderItem = type;
}
else{
if (SlaAndContractAssessmentStatusMasterStore.orderItem == type) {
if(SlaAndContractAssessmentStatusMasterStore.orderBy == 'asc') SlaAndContractAssessmentStatusMasterStore.orderBy = 'desc';
else SlaAndContractAssessmentStatusMasterStore.orderBy = 'asc'
}
else{
  SlaAndContractAssessmentStatusMasterStore.orderBy = 'asc';
  SlaAndContractAssessmentStatusMasterStore.orderItem = type;
}
}
}
}
