import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CustomerComplaintActionTypesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-types';
import { CustomerComplaintActionTypesPaginationResponse } from 'src/app/core/models/masters/customer-engagement/customer-complaint-action-types';

@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintActionTypesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

   /**
   * @description
   * This method is used for getting Customer Complaint Action Type List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof CustomerComplaintActionTypesService
   */
    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<CustomerComplaintActionTypesPaginationResponse> {
      let params = '';
      if (!getAll) {
      params = `?page=${CustomerComplaintActionTypesMasterStore.currentPage}`;
      if (CustomerComplaintActionTypesMasterStore.orderBy) params += `&order=${CustomerComplaintActionTypesMasterStore.orderBy}`;
      if (CustomerComplaintActionTypesMasterStore.orderItem) params += `&order_by=${CustomerComplaintActionTypesMasterStore.orderItem}`;
      if (CustomerComplaintActionTypesMasterStore.searchText) params += `&q=${CustomerComplaintActionTypesMasterStore.searchText}`;
      }
      if (CustomerComplaintActionTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + CustomerComplaintActionTypesMasterStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<CustomerComplaintActionTypesPaginationResponse>('/customer-complaint-action-types' + (params ? params : '')).pipe(
        map((res: CustomerComplaintActionTypesPaginationResponse) => {
          CustomerComplaintActionTypesMasterStore.setCustomerComplaintActionTypes(res);
          return res;
        })
      );
    }



  
   /**
   * @description
   * this method is used for export Customer ComplaintAction Types Data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof CustomerComplaintActionTypesService
   */
    exportToExcel() {
      this._http.get('/customer-complaint-action-types/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_action_types')
          +".xlsx");
        }
      )
    }



    sortCustomerComplaintActionTypesList(type:string, text:string) {
      if (!CustomerComplaintActionTypesMasterStore.orderBy) {
        CustomerComplaintActionTypesMasterStore.orderBy = 'asc';
        CustomerComplaintActionTypesMasterStore.orderItem = type;
      }
      else{
        if (CustomerComplaintActionTypesMasterStore.orderItem == type) {
          if(CustomerComplaintActionTypesMasterStore.orderBy == 'asc') CustomerComplaintActionTypesMasterStore.orderBy = 'desc';
          else CustomerComplaintActionTypesMasterStore.orderBy = 'asc'
        }
        else{
          CustomerComplaintActionTypesMasterStore.orderBy = 'asc';
          CustomerComplaintActionTypesMasterStore.orderItem = type;
        }
      }
    }
}
