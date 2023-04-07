import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PeriodicBackup, PeriodicBackupPaginationResponse } from 'src/app/core/models/masters/bpm/periodic-backup';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PeriodicBackupMasterStore } from 'src/app/stores/masters/bpm/periodic-backup.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodicBackupService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<PeriodicBackupPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${PeriodicBackupMasterStore.currentPage}`;
			if (PeriodicBackupMasterStore.orderBy) params += `&order_by=${PeriodicBackupMasterStore.orderItem}&order=${PeriodicBackupMasterStore.orderBy}`;
		}
		if (PeriodicBackupMasterStore.searchText) params += (params ? '&q=' : '?q=') + PeriodicBackupMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<PeriodicBackupPaginationResponse>('/periodic-backups' + (params ? params : '')).pipe(
			map((res: PeriodicBackupPaginationResponse) => {
				PeriodicBackupMasterStore.setPeriodicBackup(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<PeriodicBackup> {
		return this._http.get<PeriodicBackup>('/periodic-backups/' + id).pipe(
			map((res: PeriodicBackup) => {
				PeriodicBackupMasterStore.updatePeriodicBackup(res)
				return res;
			})
		);
	}

  updateItem(id, item: PeriodicBackup): Observable<any> {
		return this._http.put('/periodic-backups/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: PeriodicBackup) {
		return this._http.post('/periodic-backups', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/periodic-backups/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('periodic_backup_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/periodic-backups/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('periodic_backup') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/periodic-backups/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/periodic-backups/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/periodic-backups/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/periodic-backups/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/periodic-backups/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						PeriodicBackupMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchPeriodicBackupList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: PeriodicBackupPaginationResponse) => {
				PeriodicBackupMasterStore.setPeriodicBackup(res);
				return res;
			})
		);
	}

	sortPeriodicBackupList(type: string, text: string) {
		if (!PeriodicBackupMasterStore.orderBy) {
			PeriodicBackupMasterStore.orderBy = 'asc';
			PeriodicBackupMasterStore.orderItem = type;
		}
		else {
			if (PeriodicBackupMasterStore.orderItem == type) {
				if (PeriodicBackupMasterStore.orderBy == 'asc') PeriodicBackupMasterStore.orderBy = 'desc';
				else PeriodicBackupMasterStore.orderBy = 'asc'
			}
			else {
				PeriodicBackupMasterStore.orderBy = 'asc';
				PeriodicBackupMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
