import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerTypePaginationResponse } from 'src/app/core/models/masters/customer-engagement/customer-compliant-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerTypeMasterStore } from 'src/app/stores/masters/customer-engagement/customer-compliant-type-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerCompliantTypeService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<CustomerTypePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomerTypeMasterStore.currentPage}`;
      if (CustomerTypeMasterStore.orderBy) params += `&order_by=${CustomerTypeMasterStore.orderItem}&order=${CustomerTypeMasterStore.orderBy}`;
    }
    if(CustomerTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+CustomerTypeMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<CustomerTypePaginationResponse>('/customer-complaint-types' + (params ? params : '')).pipe(
      map((res: CustomerTypePaginationResponse) => {
        CustomerTypeMasterStore.setCustomerType(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/customer-complaint-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_types')+".xlsx");
      }
    )
  }

  sortCustomerTypeList(type:string, text:string) {
    if (!CustomerTypeMasterStore.orderBy) {
      CustomerTypeMasterStore.orderBy = 'asc';
      CustomerTypeMasterStore.orderItem = type;
    }
    else{
      if (CustomerTypeMasterStore.orderItem == type) {
        if(CustomerTypeMasterStore.orderBy == 'asc') CustomerTypeMasterStore.orderBy = 'desc';
        else CustomerTypeMasterStore.orderBy = 'asc'
      }
      else{
        CustomerTypeMasterStore.orderBy = 'asc';
        CustomerTypeMasterStore.orderItem = type;
      }
    }
 
  }

  searchCustomerType(params){
    return this.getItems(params ? params : '').pipe(
      map((res: CustomerTypePaginationResponse) => {
        CustomerTypeMasterStore.setCustomerType(res);
        return res;
      })
    );
  }
}
