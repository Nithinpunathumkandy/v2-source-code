import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FrequencyBackup, FrequencyBackupPaginationResponse } from 'src/app/core/models/masters/bpm/frequency-backup';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FrequencyBackupMasterStore } from 'src/app/stores/masters/bpm/frequency-backup.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class FrequencyBackupService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<FrequencyBackupPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${FrequencyBackupMasterStore.currentPage}`;
			if (FrequencyBackupMasterStore.orderBy) params += `&order_by= ${FrequencyBackupMasterStore.orderItem}&order= ${FrequencyBackupMasterStore.orderBy}`;
		}
		if (FrequencyBackupMasterStore.searchText) params += (params ? '&q=' : '?q=') + FrequencyBackupMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<FrequencyBackupPaginationResponse>('/backup-frequencies' + (params ? params : '')).pipe(
			map((res: FrequencyBackupPaginationResponse) => {
				FrequencyBackupMasterStore.setFrequencyBackup(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<FrequencyBackup> {
		return this._http.get<FrequencyBackup>('/backup-frequencies/' + id).pipe(
			map((res: FrequencyBackup) => {
				FrequencyBackupMasterStore.updateFrequencyBackup(res)
				return res;
			})
		);
	}

  updateItem(id, item: FrequencyBackup): Observable<any> {
		return this._http.put('/backup-frequencies/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: FrequencyBackup) {
		return this._http.post('/backup-frequencies', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/backup-frequencies/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('backup_frequency_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/backup-frequencies/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('backup_frequency') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/backup-frequencies/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/backup-frequencies/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/backup-frequencies/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/backup-frequencies/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/backup-frequencies/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						FrequencyBackupMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchFrequencyBackupList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: FrequencyBackupPaginationResponse) => {
				FrequencyBackupMasterStore.setFrequencyBackup(res);
				return res;
			})
		);
	}

	sortFrequencyBackupList(type: string, text: string) {
		if (!FrequencyBackupMasterStore.orderBy) {
			FrequencyBackupMasterStore.orderBy = 'asc';
			FrequencyBackupMasterStore.orderItem = type;
		}
		else {
			if (FrequencyBackupMasterStore.orderItem == type) {
				if (FrequencyBackupMasterStore.orderBy == 'asc') FrequencyBackupMasterStore.orderBy = 'desc';
				else FrequencyBackupMasterStore.orderBy = 'asc'
			}
			else {
				FrequencyBackupMasterStore.orderBy = 'asc';
				FrequencyBackupMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
