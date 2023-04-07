import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HighAvailabilityStatusMasterStore } from 'src/app/stores/masters/bpm/high-availabilty-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class HighAvialabilityStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<any> {
		let params = '';
		if (!getAll) {
			params = `?page=${HighAvailabilityStatusMasterStore.currentPage}`;
			if (HighAvailabilityStatusMasterStore.orderBy) params += `&order_by=${HighAvailabilityStatusMasterStore.orderItem}&order=${HighAvailabilityStatusMasterStore.orderBy}`;
		}
		if (HighAvailabilityStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + HighAvailabilityStatusMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<any>('/high-availability-statuses' + (params ? params : '')).pipe(
			map((res: any) => {
				HighAvailabilityStatusMasterStore.setHighAvailabilityStatus(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<any> {
		return this._http.get<any>('/high-availability-statuses/' + id).pipe(
			map((res: any) => {
				// HighAvailabilityStatusMasterStore.updateany(res)
				return res;
			})
		);
	}

  updateItem(id, item: any): Observable<any> {
		return this._http.put('/high-availability-statuses/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: any) {
		return this._http.post('/high-availability-statuses', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/high-availability-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Process Operation Modes') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/high-availability-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Process Operation Modes') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/high-availability-statuses/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/high-availability-statuses/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/high-availability-statuses/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/high-availability-statuses/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/high-availability-statuses/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						HighAvailabilityStatusMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSlaCategory(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: any) => {
				// HighAvailabilityStatusMasterStore.setany(res);
				return res;
			})
		);
	}

	sortanyList(type: string, text: string) {
		if (!HighAvailabilityStatusMasterStore.orderBy) {
			HighAvailabilityStatusMasterStore.orderBy = 'asc';
			HighAvailabilityStatusMasterStore.orderItem = type;
		}
		else {
			if (HighAvailabilityStatusMasterStore.orderItem == type) {
				if (HighAvailabilityStatusMasterStore.orderBy == 'asc') HighAvailabilityStatusMasterStore.orderBy = 'desc';
				else HighAvailabilityStatusMasterStore.orderBy = 'asc'
			}
			else {
				HighAvailabilityStatusMasterStore.orderBy = 'asc';
				HighAvailabilityStatusMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
