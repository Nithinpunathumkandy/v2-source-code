import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditStatusesPaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-statuses';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditStatusesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-statuses-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditStatusesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditStatusesMasterStore.currentPage}`;
			if (MsAuditStatusesMasterStore.orderBy) params += `&order_by=${MsAuditStatusesMasterStore.orderItem}&order=${MsAuditStatusesMasterStore.orderBy}`;
		}
		if (MsAuditStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditStatusesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<MsAuditStatusesPaginationResponse>('/ms-audit-statuses' + (params ? params : '')).pipe(
			map((res: MsAuditStatusesPaginationResponse) => {
				MsAuditStatusesMasterStore.setMsAuditStatuses(res);
				return res;
			})
		);
	}
  // getItem(id): Observable<MsAuditModeSingle> {
	// 	return this._http.get<MsAuditModeSingle>('/ms-audit-modes/' + id).pipe(
	// 		map((res: MsAuditModeSingle) => {
	// 			MsAuditStatusesMasterStore.setIndividualMsAuditCategory(res)
	// 			return res;
	// 		})
	// 	);
	// }

	exportToExcel() {
		this._http.get('/ms-audit-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_modes') + ".xlsx");
			}
		)
	}

	searchMsAuditModeList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: MsAuditStatusesPaginationResponse) => {
				MsAuditStatusesMasterStore.setMsAuditStatuses(res);
				return res;
			})
		);
	}
	getThumbnailPreview(token, h?: number, w?: number) {
		return environment.apiBasePath + '/master/files/suppliers/thumbnail?token=' + token;
	}

	selectRequiredMsAuditMode(items) {
		MsAuditStatusesMasterStore.addSelectedMsAuditStatuses(items);
	}
	sortAuditStatusList(type: string, text: string) {
		if (!MsAuditStatusesMasterStore.orderBy) {
			MsAuditStatusesMasterStore.orderBy = 'asc';
			MsAuditStatusesMasterStore.orderItem = type;
		}
		else {
			if (MsAuditStatusesMasterStore.orderItem == type) {
				if (MsAuditStatusesMasterStore.orderBy == 'asc') MsAuditStatusesMasterStore.orderBy = 'desc';
				else MsAuditStatusesMasterStore.orderBy = 'asc'
			}
			else {
				MsAuditStatusesMasterStore.orderBy = 'asc';
				MsAuditStatusesMasterStore.orderItem = type;
			}
		}
	}
}
