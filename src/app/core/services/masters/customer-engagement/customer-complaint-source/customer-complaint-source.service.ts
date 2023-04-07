import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerComplaintSource, CustomerComplaintSourcePaginationResponse } from 'src/app/core/models/masters/customer-engagement/customer-complaint-source';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomerComplaintSourceMasterStore } from 'src/app/stores/masters/customer-engagement/customer-complaint-source-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintSourceService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<CustomerComplaintSourcePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${CustomerComplaintSourceMasterStore.currentPage}`;
			if (CustomerComplaintSourceMasterStore.orderBy) params += `&order_by=${CustomerComplaintSourceMasterStore.orderItem}&order=${CustomerComplaintSourceMasterStore.orderBy}`;
		}
		if (CustomerComplaintSourceMasterStore.searchText) params += (params ? '&q=' : '?q=') + CustomerComplaintSourceMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<CustomerComplaintSourcePaginationResponse>('/customer-complaint-sources' + (params ? params : '')).pipe(
			map((res: CustomerComplaintSourcePaginationResponse) => {
				CustomerComplaintSourceMasterStore.setCustomerComplaintSource(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<CustomerComplaintSource> {
		return this._http.get<CustomerComplaintSource>('/customer-complaint-sources/' + id).pipe(
			map((res: CustomerComplaintSource) => {
				CustomerComplaintSourceMasterStore.updateCustomerComplaintSource(res)
				return res;
			})
		);
	}

  updateItem(id, item: CustomerComplaintSource): Observable<any> {
		return this._http.put('/customer-complaint-sources/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_updated!');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: CustomerComplaintSource) {
		return this._http.post('/customer-complaint-sources', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/customer-complaint-sources/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_sources') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/customer-complaint-sources/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_sources') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/customer-complaint-sources/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/customer-complaint-sources/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/customer-complaint-sources/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/customer-complaint-sources/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/customer-complaint-sources/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'customer_complaint_sources_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						CustomerComplaintSourceMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchCustomerComplaintSource(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: CustomerComplaintSourcePaginationResponse) => {
				CustomerComplaintSourceMasterStore.setCustomerComplaintSource(res);
				return res;
			})
		);
	}

	sortCustomerComplaintSourceList(type: string, text: string) {
		if (!CustomerComplaintSourceMasterStore.orderBy) {
			CustomerComplaintSourceMasterStore.orderBy = 'asc';
			CustomerComplaintSourceMasterStore.orderItem = type;
		}
		else {
			if (CustomerComplaintSourceMasterStore.orderItem == type) {
				if (CustomerComplaintSourceMasterStore.orderBy == 'asc') CustomerComplaintSourceMasterStore.orderBy = 'desc';
				else CustomerComplaintSourceMasterStore.orderBy = 'asc'
			}
			else {
				CustomerComplaintSourceMasterStore.orderBy = 'asc';
				CustomerComplaintSourceMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
