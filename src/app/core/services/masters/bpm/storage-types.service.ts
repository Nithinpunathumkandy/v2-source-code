import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageTypes, StorageTypesPaginationResponse } from 'src/app/core/models/masters/bpm/storage-types';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StorageTypesMasterStore } from 'src/app/stores/masters/bpm/storage-types.master.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StorageTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StorageTypesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${StorageTypesMasterStore.currentPage}`;
			if (StorageTypesMasterStore.orderBy) params += `&order_by=${StorageTypesMasterStore.orderItem}&order=${StorageTypesMasterStore.orderBy}`;
		}
		if (StorageTypesMasterStore.searchText) params += (params ? '&q=' : '?q=') + StorageTypesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<StorageTypesPaginationResponse>('/storage-types' + (params ? params : '')).pipe(
			map((res: StorageTypesPaginationResponse) => {
				StorageTypesMasterStore.setStorageTypes(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<StorageTypes> {
		return this._http.get<StorageTypes>('/storage-types/' + id).pipe(
			map((res: StorageTypes) => {
				StorageTypesMasterStore.updateStorageTypes(res)
				return res;
			})
		);
	}

  updateItem(id, item: StorageTypes): Observable<any> {
		return this._http.put('/storage-types/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: StorageTypes) {
		return this._http.post('/storage-types', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/storage-types/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_types_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/storage-types/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_types') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/storage-types/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/storage-types/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/storage-types/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/storage-types/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/storage-types/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						StorageTypesMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchStorageTypesList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: StorageTypesPaginationResponse) => {
				StorageTypesMasterStore.setStorageTypes(res);
				return res;
			})
		);
	}

	sortStorageTypesList(type: string, text: string) {
		if (!StorageTypesMasterStore.orderBy) {
			StorageTypesMasterStore.orderBy = 'asc';
			StorageTypesMasterStore.orderItem = type;
		}
		else {
			if (StorageTypesMasterStore.orderItem == type) {
				if (StorageTypesMasterStore.orderBy == 'asc') StorageTypesMasterStore.orderBy = 'desc';
				else StorageTypesMasterStore.orderBy = 'asc'
			}
			else {
				StorageTypesMasterStore.orderBy = 'asc';
				StorageTypesMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}


