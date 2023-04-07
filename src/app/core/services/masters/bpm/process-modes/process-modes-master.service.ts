import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcessOperationModes, ProcessOperationModesPaginationResponse } from 'src/app/core/models/masters/bpm/process-operation-modes';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OperationModesMasterStore } from 'src/app/stores/masters/bpm/process-operation-modes.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessModesMasterService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ProcessOperationModesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${OperationModesMasterStore.currentPage}`;
			if (OperationModesMasterStore.orderBy) params += `&order=${OperationModesMasterStore.orderBy}`;
			if (OperationModesMasterStore.orderItem) params += `&order_by=${OperationModesMasterStore.orderItem}`;
			if (OperationModesMasterStore.searchText) params += `&q=${OperationModesMasterStore.searchText}`;
		}
		if (OperationModesMasterStore.searchText) params += (params ? '&q=' : '?q=') + OperationModesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<ProcessOperationModesPaginationResponse>('/process-operation-modes' + (params ? params : '')).pipe(
			map((res: ProcessOperationModesPaginationResponse) => {
				OperationModesMasterStore.setProcessOperationModes(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<ProcessOperationModes> {
		return this._http.get<ProcessOperationModes>('/process-operation-modes/' + id).pipe(
			map((res: ProcessOperationModes) => {
				OperationModesMasterStore.updateProcessOperationModes(res)
				return res;
			})
		);
	}

  updateItem(id, item: ProcessOperationModes): Observable<any> {
		return this._http.put('/process-operation-modes/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: ProcessOperationModes) {
		return this._http.post('/process-operation-modes', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/process-operation-modes/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_operation_modes') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/process-operation-modes/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_operation_modes') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/process-operation-modes/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/process-operation-modes/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/process-operation-modes/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/process-operation-modes/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/process-operation-modes/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						OperationModesMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSlaCategory(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: ProcessOperationModesPaginationResponse) => {
				OperationModesMasterStore.setProcessOperationModes(res);
				return res;
			})
		);
	}

	sortProcessOperationModesList(type: string, text: string) {
		if (!OperationModesMasterStore.orderBy) {
			OperationModesMasterStore.orderBy = 'asc';
			OperationModesMasterStore.orderItem = type;
		}
		else {
			if (OperationModesMasterStore.orderItem == type) {
				if (OperationModesMasterStore.orderBy == 'asc') OperationModesMasterStore.orderBy = 'desc';
				else OperationModesMasterStore.orderBy = 'asc'
			}
			else {
				OperationModesMasterStore.orderBy = 'asc';
				OperationModesMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
