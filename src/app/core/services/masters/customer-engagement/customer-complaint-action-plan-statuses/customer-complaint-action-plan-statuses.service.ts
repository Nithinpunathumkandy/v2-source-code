import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerComplaintActionPlanStatusesPaginationResponse } from 'src/app/core/models/masters/customer-engagement/customer-complaint-action-plan-statuses';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerComplaintActionPlanStatusesMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-action-plan-statuses';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintActionPlanStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
	private _helperService: HelperServiceService
  ) { }

   /**
   * @description
   * This method is used for getting customer complaint action plan statuses List
   *
   * @param {*} [param]
   * @returns this api will return a observalble
   * @memberof CustomerComplaintActionPlanStatusesMasterStore
   */
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<CustomerComplaintActionPlanStatusesPaginationResponse> {
		let params = '';
		if (!getAll) {
		params = `?page=${CustomerComplaintActionPlanStatusesMasterStore.currentPage}`;
		if (CustomerComplaintActionPlanStatusesMasterStore.orderBy) params += `&order=${CustomerComplaintActionPlanStatusesMasterStore.orderBy}`;
		if (CustomerComplaintActionPlanStatusesMasterStore.orderItem) params += `&order_by=${CustomerComplaintActionPlanStatusesMasterStore.orderItem}`;
		if (CustomerComplaintActionPlanStatusesMasterStore.searchText) params += `&q=${CustomerComplaintActionPlanStatusesMasterStore.searchText}`;
		}
		if (CustomerComplaintActionPlanStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + CustomerComplaintActionPlanStatusesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<CustomerComplaintActionPlanStatusesPaginationResponse>('/customer-complaint-action-plan-statuses' + (params ? params : '')).pipe(
			map((res: CustomerComplaintActionPlanStatusesPaginationResponse) => {
				CustomerComplaintActionPlanStatusesMasterStore.setCustomerComplaintActionPlanStatuses(res);
				return res;
			})
		);
	}



   /**
   * @description
   * this method is used for export customer complaint action plan statuses data
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof CustomerComplaintActionPlanStatusesService
   */
  exportToExcel() {
    this._http.get('/customer-complaint-action-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_action_plan_statuses')+".xlsx");
      }
    )
  }

  
	sortCustomerComplaintActionPlanStatusesList(type: string, text: string) {
		if (!CustomerComplaintActionPlanStatusesMasterStore.orderBy) {
			CustomerComplaintActionPlanStatusesMasterStore.orderBy = 'asc';
			CustomerComplaintActionPlanStatusesMasterStore.orderItem = type;
		}
		else {
			if (CustomerComplaintActionPlanStatusesMasterStore.orderItem == type) {
				if (CustomerComplaintActionPlanStatusesMasterStore.orderBy == 'asc') CustomerComplaintActionPlanStatusesMasterStore.orderBy = 'desc';
				else CustomerComplaintActionPlanStatusesMasterStore.orderBy = 'asc'
			}
			else {
				CustomerComplaintActionPlanStatusesMasterStore.orderBy = 'asc';
				CustomerComplaintActionPlanStatusesMasterStore.orderItem = type;
			}
		}
	}
}
