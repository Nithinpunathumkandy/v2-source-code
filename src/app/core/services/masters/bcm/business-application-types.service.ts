import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessApplicationTypes, BusinessApplicationTypesPaginationResponse } from 'src/app/core/models/masters/bcm/business-application-type';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BusinessApplicationTypesMasterStore } from 'src/app/stores/masters/bcm/business-application-types.master.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessApplicationTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BusinessApplicationTypesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BusinessApplicationTypesMasterStore.currentPage}`;
			if (BusinessApplicationTypesMasterStore.orderBy) params += `&order_by=${BusinessApplicationTypesMasterStore.orderItem}&order=${BusinessApplicationTypesMasterStore.orderBy}`;
		}
		if (BusinessApplicationTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + BusinessApplicationTypesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BusinessApplicationTypesPaginationResponse>('/business-application-types' + (params ? params : '')).pipe(
			map((res: BusinessApplicationTypesPaginationResponse) => {
				BusinessApplicationTypesMasterStore.setBusinessApplicationTypes(res);
				return res;
			})
		);
	}

	getAllItems(): Observable<BusinessApplicationTypes[]> {
		return this._http.get<BusinessApplicationTypes[]>('/business-application-types?is_all=true').pipe(
			map((res: BusinessApplicationTypes[]) => {
				BusinessApplicationTypesMasterStore.setAllBusinessAppType(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<BusinessApplicationTypes> {
		return this._http.get<BusinessApplicationTypes>('/business-application-types/' + id).pipe(
			map((res: BusinessApplicationTypes) => {
				BusinessApplicationTypesMasterStore.updateBusinessApplicationTypes(res)
				return res;
			})
		);
	}

  updateItem(id, item: BusinessApplicationTypes): Observable<any> {
		return this._http.put('/business-application-types/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: BusinessApplicationTypes) {
		return this._http.post('/business-application-types', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/business-application-types/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_application_type_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/business-application-types/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_application_types') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/business-application-types/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/business-application-types/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/business-application-types/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/business-application-types/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/business-application-types/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						BusinessApplicationTypesMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchBusinessApplicationType(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: BusinessApplicationTypesPaginationResponse) => {
				BusinessApplicationTypesMasterStore.setBusinessApplicationTypes(res);
				return res;
			})
		);
	}

	sortBusinessApplicationTypeList(type: string, text: string) {
		if (!BusinessApplicationTypesMasterStore.orderBy) {
			BusinessApplicationTypesMasterStore.orderBy = 'asc';
			BusinessApplicationTypesMasterStore.orderItem = type;
		}
		else {
			if (BusinessApplicationTypesMasterStore.orderItem == type) {
				if (BusinessApplicationTypesMasterStore.orderBy == 'asc') BusinessApplicationTypesMasterStore.orderBy = 'desc';
				else BusinessApplicationTypesMasterStore.orderBy = 'asc'
			}
			else {
				BusinessApplicationTypesMasterStore.orderBy = 'asc';
				BusinessApplicationTypesMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
