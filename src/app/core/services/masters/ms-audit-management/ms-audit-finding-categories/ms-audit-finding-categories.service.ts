import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditFindingCategoryPaginationResponse, MsAuditFindingCategorySingle } from 'src/app/core/models/masters/ms-audit-management/ms-audit-finding-categories';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditFindingCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-categories-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditFindingCategoriesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditFindingCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditFindingCategoryMasterStore.currentPage}`;
			if (MsAuditFindingCategoryMasterStore.orderBy) params += `&order_by=${MsAuditFindingCategoryMasterStore.orderItem}&order=${MsAuditFindingCategoryMasterStore.orderBy}`;
		}
		if (MsAuditFindingCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditFindingCategoryMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<MsAuditFindingCategoryPaginationResponse>('/ms-audit-finding-categories' + (params ? params : '')).pipe(
			map((res: MsAuditFindingCategoryPaginationResponse) => {
				MsAuditFindingCategoryMasterStore.setMsAuditFindingCategory(res);
				return res;
			})
		);
	}

  // getItem(id: number): Observable<MsAuditCategory> {
	// 	return this._http.get<MsAuditCategory>('/ms-audit-categories/' + id).pipe(
	// 		map((res: MsAuditCategory) => {
	// 			MsAuditFindingCategoryMasterStore.updateMsAuditCategory(res)
	// 			return res;
	// 		})
	// 	);
	// }

  getItem(id): Observable<MsAuditFindingCategorySingle> {
		return this._http.get<MsAuditFindingCategorySingle>('/ms-audit-finding-categories/' + id).pipe(
			map((res: MsAuditFindingCategorySingle) => {
				MsAuditFindingCategoryMasterStore.setIndividualMsAuditFindingCategory(res)
				return res;
			})
		);
	}

  updateItem(id, item: any): Observable<any> {
		return this._http.put('/ms-audit-finding-categories/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: any) {
		return this._http.post('/ms-audit-finding-categories', item).pipe(
			map(res => {
				MsAuditFindingCategoryMasterStore.setLastInsertedId(res['id']);
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	// generateTemplate() {
	// 	this._http.get('/ms-audit-categories/template', { responseType: 'blob' as 'json' }).subscribe(
	// 		(response: any) => {
	// 			this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_categories_template') + ".xlsx");
	// 		}
	// 	)
	// }

	exportToExcel() {
		this._http.get('/ms-audit-finding-categories/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_finding_category') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/ms-audit-finding-categories/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/ms-audit-finding-categories/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

    activate(id: number) {
		return this._http.put('/ms-audit-finding-categories/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/ms-audit-finding-categories/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/ms-audit-finding-categories/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						MsAuditFindingCategoryMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchMsAuditFindingCategoryList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: MsAuditFindingCategoryPaginationResponse) => {
				MsAuditFindingCategoryMasterStore.setMsAuditFindingCategory(res);
				return res;
			})
		);
	}

	sortMsAuditFindingCategoryList(type: string, text: string) {
		if (!MsAuditFindingCategoryMasterStore.orderBy) {
			MsAuditFindingCategoryMasterStore.orderBy = 'asc';
			MsAuditFindingCategoryMasterStore.orderItem = type;
		}
		else {
			if (MsAuditFindingCategoryMasterStore.orderItem == type) {
				if (MsAuditFindingCategoryMasterStore.orderBy == 'asc') MsAuditFindingCategoryMasterStore.orderBy = 'desc';
				else MsAuditFindingCategoryMasterStore.orderBy = 'asc'
			}
			else {
				MsAuditFindingCategoryMasterStore.orderBy = 'asc';
				MsAuditFindingCategoryMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}

	getThumbnailPreview(token, h?: number, w?: number) {
		return environment.apiBasePath + '/master/files/suppliers/thumbnail?token=' + token;
	}

	selectRequiredMsAuditFindingCategory(items) {
		MsAuditFindingCategoryMasterStore.addSelectedMsAuditFindingCategory(items);
	}
}
