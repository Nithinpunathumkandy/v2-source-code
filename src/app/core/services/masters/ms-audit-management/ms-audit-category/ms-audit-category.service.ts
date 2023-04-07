import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditCategoryPaginationResponse, MsAuditCategorySingle } from 'src/app/core/models/masters/ms-audit-management/ms-audit-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${MsAuditCategoryMasterStore.currentPage}`;
			if (MsAuditCategoryMasterStore.orderBy) params += `&order_by=${MsAuditCategoryMasterStore.orderItem}&order=${MsAuditCategoryMasterStore.orderBy}`;
		}
		if (MsAuditCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditCategoryMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<MsAuditCategoryPaginationResponse>('/ms-audit-categories' + (params ? params : '')).pipe(
			map((res: MsAuditCategoryPaginationResponse) => {
				MsAuditCategoryMasterStore.setMsAuditCategory(res);
				return res;
			})
		);
	}

  // getItem(id: number): Observable<MsAuditCategory> {
	// 	return this._http.get<MsAuditCategory>('/ms-audit-categories/' + id).pipe(
	// 		map((res: MsAuditCategory) => {
	// 			MsAuditCategoryMasterStore.updateMsAuditCategory(res)
	// 			return res;
	// 		})
	// 	);
	// }

  getItem(id): Observable<MsAuditCategorySingle> {
		return this._http.get<MsAuditCategorySingle>('/ms-audit-categories/' + id).pipe(
			map((res: MsAuditCategorySingle) => {
				MsAuditCategoryMasterStore.setIndividualMsAuditCategory(res)
				return res;
			})
		);
	}

  updateItem(id, item: any): Observable<any> {
		return this._http.put('/ms-audit-categories/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: any) {
		return this._http.post('/ms-audit-categories', item).pipe(
			map(res => {
				MsAuditCategoryMasterStore.setLastInsertedId(res['id']);
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/ms-audit-categories/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_categories_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/ms-audit-categories/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_categories') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/ms-audit-categories/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/ms-audit-categories/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/ms-audit-categories/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/ms-audit-categories/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/ms-audit-categories/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						MsAuditCategoryMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchMsAuditCategoryList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: MsAuditCategoryPaginationResponse) => {
				MsAuditCategoryMasterStore.setMsAuditCategory(res);
				return res;
			})
		);
	}

	sortMsAuditCategoryList(type: string, text: string) {
		if (!MsAuditCategoryMasterStore.orderBy) {
			MsAuditCategoryMasterStore.orderBy = 'asc';
			MsAuditCategoryMasterStore.orderItem = type;
		}
		else {
			if (MsAuditCategoryMasterStore.orderItem == type) {
				if (MsAuditCategoryMasterStore.orderBy == 'asc') MsAuditCategoryMasterStore.orderBy = 'desc';
				else MsAuditCategoryMasterStore.orderBy = 'asc'
			}
			else {
				MsAuditCategoryMasterStore.orderBy = 'asc';
				MsAuditCategoryMasterStore.orderItem = type;
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

	selectRequiredMsAuditCategory(items) {
		MsAuditCategoryMasterStore.addSelectedMsAuditCategory(items);
	}
}


