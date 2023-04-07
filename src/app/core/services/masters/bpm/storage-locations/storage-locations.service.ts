import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageLocation, StorageLocationPaginationResponse } from 'src/app/core/models/masters/bpm/storage-Location';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StorageLocationMasterStore } from 'src/app/stores/masters/bpm/storage-location.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StorageLocationsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StorageLocationPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${StorageLocationMasterStore.currentPage}`;
			if (StorageLocationMasterStore.orderBy) params += `&order_by=${StorageLocationMasterStore.orderItem}&order=${StorageLocationMasterStore.orderBy}`;
		}
		if (StorageLocationMasterStore.searchText) params += (params ? '&q=' : '?q=') + StorageLocationMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<StorageLocationPaginationResponse>('/storage-locations' + (params ? params : '')).pipe(
			map((res: StorageLocationPaginationResponse) => {
				StorageLocationMasterStore.setStorageLocation(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<StorageLocation> {
		return this._http.get<StorageLocation>('/storage-locations/' + id).pipe(
			map((res: StorageLocation) => {
				StorageLocationMasterStore.updateStorageLocation(res)
				return res;
			})
		);
	}

  updateItem(id, item: StorageLocation): Observable<any> {
		return this._http.put('/storage-locations/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: StorageLocation) {
		return this._http.post('/storage-locations', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/storage-locations/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_Location_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/storage-locations/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_locations') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/storage-locations/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/storage-locations/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/storage-locations/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/storage-locations/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/storage-locations/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						StorageLocationMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchStorageLocationList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: StorageLocationPaginationResponse) => {
				StorageLocationMasterStore.setStorageLocation(res);
				return res;
			})
		);
	}

	sortStorageLocationList(type: string, text: string) {
		if (!StorageLocationMasterStore.orderBy) {
			StorageLocationMasterStore.orderBy = 'asc';
			StorageLocationMasterStore.orderItem = type;
		}
		else {
			if (StorageLocationMasterStore.orderItem == type) {
				if (StorageLocationMasterStore.orderBy == 'asc') StorageLocationMasterStore.orderBy = 'desc';
				else StorageLocationMasterStore.orderBy = 'asc'
			}
			else {
				StorageLocationMasterStore.orderBy = 'asc';
				StorageLocationMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
