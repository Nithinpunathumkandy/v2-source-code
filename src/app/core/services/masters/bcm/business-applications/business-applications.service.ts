import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessApplications, BusinessApplicationsPaginationResponse } from 'src/app/core/models/masters/bcm/business-applications';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessApplicationsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BusinessApplicationsPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BusinessApplicationsMasterStore.currentPage}`;
			if (BusinessApplicationsMasterStore.orderBy) params += `&order_by=${BusinessApplicationsMasterStore.orderItem}&order=${BusinessApplicationsMasterStore.orderBy}`;
		}
		if (BusinessApplicationsMasterStore.searchText) params += (params ? '&q=' : '?q=') + BusinessApplicationsMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BusinessApplicationsPaginationResponse>('/business-applications' + (params ? params : '')).pipe(
			map((res: BusinessApplicationsPaginationResponse) => {
				BusinessApplicationsMasterStore.setBusinessApplications(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<BusinessApplications> {
		return this._http.get<BusinessApplications>('/business-applications/' + id).pipe(
			map((res: BusinessApplications) => {
				BusinessApplicationsMasterStore.updateBusinessApplications(res)
				return res;
			})
		);
	}

  updateItem(id, item: BusinessApplications): Observable<any> {
		return this._http.put('/business-applications/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: BusinessApplications) {
		return this._http.post('/business-applications', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/business-applications/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_applications_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/business-applications/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_applications') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/business-applications/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/business-applications/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/business-applications/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/business-applications/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/business-applications/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						BusinessApplicationsMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchBusinessApplicationList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: BusinessApplicationsPaginationResponse) => {
				BusinessApplicationsMasterStore.setBusinessApplications(res);
				return res;
			})
		);
	}

	sortBusinessApplicationList(type: string, text: string) {
		if (!BusinessApplicationsMasterStore.orderBy) {
			BusinessApplicationsMasterStore.orderBy = 'asc';
			BusinessApplicationsMasterStore.orderItem = type;
		}
		else {
			if (BusinessApplicationsMasterStore.orderItem == type) {
				if (BusinessApplicationsMasterStore.orderBy == 'asc') BusinessApplicationsMasterStore.orderBy = 'desc';
				else BusinessApplicationsMasterStore.orderBy = 'asc'
			}
			else {
				BusinessApplicationsMasterStore.orderBy = 'asc';
				BusinessApplicationsMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}

	getThumbnailPreview(token, h?: number, w?: number) {
		return environment.apiBasePath + '/master/files/suppliers/thumbnail?token=' + token;
	}

	selectRequiredBusinessApplications(items) {
		BusinessApplicationsMasterStore.addSelectedBusinessApplications(items);
	}

	// sortBusinessApplication(type, callList: boolean = true,text?) {
	// 	if (!BusinessApplicationsMasterStore.orderBy) {
	// 		BusinessApplicationsMasterStore.orderBy = 'asc';
	// 		BusinessApplicationsMasterStore.orderItem = type;
	// 	}
	// 	else {
	// 	  if (BusinessApplicationsMasterStore.orderItem == type) {
	// 		if (BusinessApplicationsMasterStore.orderBy == 'asc') BusinessApplicationsMasterStore.orderBy = 'desc';
	// 		else BusinessApplicationsMasterStore.orderBy = 'asc'
	// 	  }
	// 	  else {
	// 		BusinessApplicationsMasterStore.orderBy = 'asc';
	// 		BusinessApplicationsMasterStore.orderItem = type;
	// 	  }
	// 	}
	//   }
}

