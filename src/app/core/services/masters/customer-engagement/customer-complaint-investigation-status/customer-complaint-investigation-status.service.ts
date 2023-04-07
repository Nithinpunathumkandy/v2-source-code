import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerCompliantInvestigationStatusPaginationResponse } from 'src/app/core/models/masters/customer-engagement/customer-complaint-investigation-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerComplaintInvestigationStatusMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-investigation-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintInvestigationStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<CustomerCompliantInvestigationStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomerComplaintInvestigationStatusMasterStore.currentPage}`;
      if (CustomerComplaintInvestigationStatusMasterStore.orderBy) params += `&order_by=${CustomerComplaintInvestigationStatusMasterStore.orderItem}&order=${CustomerComplaintInvestigationStatusMasterStore.orderBy}`;
    }
    if(CustomerComplaintInvestigationStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+CustomerComplaintInvestigationStatusMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<CustomerCompliantInvestigationStatusPaginationResponse>('/customer-complaint-investigation-statuses' + (params ? params : '')).pipe(
      map((res: CustomerCompliantInvestigationStatusPaginationResponse) => {
        CustomerComplaintInvestigationStatusMasterStore.setCustomerCompliantInvestigationStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/customer-complaint-investigation-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_investigation_statuses')+".xlsx");
      }
    )
  }

  sortCustomerComplaintInvestigationStatusList(type:string, text:string) {
    if (!CustomerComplaintInvestigationStatusMasterStore.orderBy) {
      CustomerComplaintInvestigationStatusMasterStore.orderBy = 'asc';
      CustomerComplaintInvestigationStatusMasterStore.orderItem = type;
    }
    else{
      if (CustomerComplaintInvestigationStatusMasterStore.orderItem == type) {
        if(CustomerComplaintInvestigationStatusMasterStore.orderBy == 'asc') CustomerComplaintInvestigationStatusMasterStore.orderBy = 'desc';
        else CustomerComplaintInvestigationStatusMasterStore.orderBy = 'asc'
      }
      else{
        CustomerComplaintInvestigationStatusMasterStore.orderBy = 'asc';
        CustomerComplaintInvestigationStatusMasterStore.orderItem = type;
      }
    }
 
  }
}
