import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerCompliantStatusPaginationResponse } from 'src/app/core/models/masters/customer-engagement/customer-complaint-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerCompliantStatusMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerCompliantStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<CustomerCompliantStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomerCompliantStatusMasterStore.currentPage}`;
      if (CustomerCompliantStatusMasterStore.orderBy) params += `&order_by=${CustomerCompliantStatusMasterStore.orderItem}&order=${CustomerCompliantStatusMasterStore.orderBy}`;
    }
    if(CustomerCompliantStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+CustomerCompliantStatusMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<CustomerCompliantStatusPaginationResponse>('/customer-complaint-statuses' + (params ? params : '')).pipe(
      map((res: CustomerCompliantStatusPaginationResponse) => {
        CustomerCompliantStatusMasterStore.setCustomerCompliantStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/customer-complaint-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_statuses')+".xlsx");
      }
    )
  }

  sortCompliantStatusList(type:string, text:string) {
    if (!CustomerCompliantStatusMasterStore.orderBy) {
      CustomerCompliantStatusMasterStore.orderBy = 'asc';
      CustomerCompliantStatusMasterStore.orderItem = type;
    }
    else{
      if (CustomerCompliantStatusMasterStore.orderItem == type) {
        if(CustomerCompliantStatusMasterStore.orderBy == 'asc') CustomerCompliantStatusMasterStore.orderBy = 'desc';
        else CustomerCompliantStatusMasterStore.orderBy = 'asc'
      }
      else{
        CustomerCompliantStatusMasterStore.orderBy = 'asc';
        CustomerCompliantStatusMasterStore.orderItem = type;
      }
    }
 
  }
}
