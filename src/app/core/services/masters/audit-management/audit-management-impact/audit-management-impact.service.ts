import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { AuditManagementImpact, AuditManagementImpactPaginationResponse } from 'src/app/core/models/masters/audit-management/audit-management-impact';
import { AuditManagementImpactMasterStore } from 'src/app/stores/masters/audit-management/audit-management-impact-store';


@Injectable({
  providedIn: 'root'
})
export class AuditManagementImpactService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<AuditManagementImpactPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${AuditManagementImpactMasterStore.currentPage}`;
			if (AuditManagementImpactMasterStore.orderBy) params += `&order_by=${AuditManagementImpactMasterStore.orderItem}&order=${AuditManagementImpactMasterStore.orderBy}`;
		}
		if (AuditManagementImpactMasterStore.searchText) params += (params ? '&q=' : '?q=') + AuditManagementImpactMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<AuditManagementImpactPaginationResponse>('/am-impacts' + (params ? params : '')).pipe(
			map((res: AuditManagementImpactPaginationResponse) => {
				AuditManagementImpactMasterStore.setAuditManagementImpact(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<AuditManagementImpact> {
		return this._http.get<AuditManagementImpact>('/am-impacts/' + id).pipe(
			map((res: AuditManagementImpact) => {
				AuditManagementImpactMasterStore.updateAuditManagementImpact(res)
				return res;
			})
		);
	}

  updateItem(id, item: AuditManagementImpact): Observable<any> {
		return this._http.put('/am-impacts/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: AuditManagementImpact) {
		return this._http.post('/am-impacts', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/am-impacts/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('storage_Location_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/am-impacts/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_management_impacts') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/am-impacts/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/am-impacts/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/am-impacts/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/am-impacts/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/am-impacts/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						AuditManagementImpactMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchAuditManagementImpactList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: AuditManagementImpactPaginationResponse) => {
				AuditManagementImpactMasterStore.setAuditManagementImpact(res);
				return res;
			})
		);
	}

	sortAuditManagementImpactList(type: string, text: string) {
		if (!AuditManagementImpactMasterStore.orderBy) {
			AuditManagementImpactMasterStore.orderBy = 'asc';
			AuditManagementImpactMasterStore.orderItem = type;
		}
		else {
			if (AuditManagementImpactMasterStore.orderItem == type) {
				if (AuditManagementImpactMasterStore.orderBy == 'asc') AuditManagementImpactMasterStore.orderBy = 'desc';
				else AuditManagementImpactMasterStore.orderBy = 'asc'
			}
			else {
				AuditManagementImpactMasterStore.orderBy = 'asc';
				AuditManagementImpactMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
