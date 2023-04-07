import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditModePaginationResponse, MsAuditModeSingle } from 'src/app/core/models/masters/ms-audit-management/ms-audit-mode';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditModesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-modes-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditModesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditModePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditModesMasterStore.currentPage}`;
			if (MsAuditModesMasterStore.orderBy) params += `&order_by=${MsAuditModesMasterStore.orderItem}&order=${MsAuditModesMasterStore.orderBy}`;
		}
		if (MsAuditModesMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditModesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<MsAuditModePaginationResponse>('/ms-audit-modes' + (params ? params : '')).pipe(
			map((res: MsAuditModePaginationResponse) => {
				MsAuditModesMasterStore.setMsAuditMode(res);
				return res;
			})
		);
	}
  getItem(id): Observable<MsAuditModeSingle> {
		return this._http.get<MsAuditModeSingle>('/ms-audit-modes/' + id).pipe(
			map((res: MsAuditModeSingle) => {
				MsAuditModesMasterStore.setIndividualMsAuditCategory(res)
				return res;
			})
		);
	}

  updateItem(id, item: any): Observable<any> {
		return this._http.put('/ms-audit-modes/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	exportToExcel() {
		this._http.get('/ms-audit-modes/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_modes') + ".xlsx");
			}
		)
	}

  activate(id: number) {
		return this._http.put('/ms-audit-modes/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/ms-audit-modes/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}
	searchMsAuditModeList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: MsAuditModePaginationResponse) => {
				MsAuditModesMasterStore.setMsAuditMode(res);
				return res;
			})
		);
	}
	getThumbnailPreview(token, h?: number, w?: number) {
		return environment.apiBasePath + '/master/files/suppliers/thumbnail?token=' + token;
	}

	selectRequiredMsAuditMode(items) {
		MsAuditModesMasterStore.addSelectedMsAuditModes(items);
	}
	sortAuditModeList(type: string, text: string) {
		if (!MsAuditModesMasterStore.orderBy) {
			MsAuditModesMasterStore.orderBy = 'asc';
			MsAuditModesMasterStore.orderItem = type;
		}
		else {
			if (MsAuditModesMasterStore.orderItem == type) {
				if (MsAuditModesMasterStore.orderBy == 'asc') MsAuditModesMasterStore.orderBy = 'desc';
				else MsAuditModesMasterStore.orderBy = 'asc'
			}
			else {
				MsAuditModesMasterStore.orderBy = 'asc';
				MsAuditModesMasterStore.orderItem = type;
			}
		}
	}
}


