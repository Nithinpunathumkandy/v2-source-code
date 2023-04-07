import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessAccessibility, ProcessAccessibilityPaginationResponse } from 'src/app/core/models/masters/bpm/process-accessibility';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProcessAccessibilityMasterStore } from 'src/app/stores/masters/bpm/process-accesibility.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessAccessibilityService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ProcessAccessibilityPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${ProcessAccessibilityMasterStore.currentPage}`;
			if (ProcessAccessibilityMasterStore.orderBy) params += `&order_by=${ProcessAccessibilityMasterStore.orderItem}&order=${ProcessAccessibilityMasterStore.orderBy}`;
		}
		if (ProcessAccessibilityMasterStore.searchText) params += (params ? '&q=' : '?q=') + ProcessAccessibilityMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<ProcessAccessibilityPaginationResponse>('/process-accessibilities' + (params ? params : '')).pipe(
			map((res: ProcessAccessibilityPaginationResponse) => {
				ProcessAccessibilityMasterStore.setProcessAccessibility(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<ProcessAccessibility> {
		return this._http.get<ProcessAccessibility>('/process-accessibilities/' + id).pipe(
			map((res: ProcessAccessibility) => {
				ProcessAccessibilityMasterStore.updateProcessAccessibility(res)
				return res;
			})
		);
	}

  updateItem(id, item: ProcessAccessibility): Observable<any> {
		return this._http.put('/process-accessibilities/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: ProcessAccessibility) {
		return this._http.post('/process-accessibilities', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/process-accessibilities/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_accessibility') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/process-accessibilities/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_accessibility') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/process-accessibilities/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/process-accessibilities/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/process-accessibilities/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/process-accessibilities/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/process-accessibilities/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						ProcessAccessibilityMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchProcessAccessibility(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: ProcessAccessibilityPaginationResponse) => {
				ProcessAccessibilityMasterStore.setProcessAccessibility(res);
				return res;
			})
		);
	}

	sortProcessAccessibilityList(type: string, text: string) {
		if (!ProcessAccessibilityMasterStore.orderBy) {
			ProcessAccessibilityMasterStore.orderBy = 'asc';
			ProcessAccessibilityMasterStore.orderItem = type;
		}
		else {
			if (ProcessAccessibilityMasterStore.orderItem == type) {
				if (ProcessAccessibilityMasterStore.orderBy == 'asc') ProcessAccessibilityMasterStore.orderBy = 'desc';
				else ProcessAccessibilityMasterStore.orderBy = 'asc'
			}
			else {
				ProcessAccessibilityMasterStore.orderBy = 'asc';
				ProcessAccessibilityMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
