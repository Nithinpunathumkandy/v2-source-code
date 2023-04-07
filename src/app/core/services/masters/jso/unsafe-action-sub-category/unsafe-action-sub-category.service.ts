import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnsafeActionSubCategory, UnsafeActionSubCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-sub-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UnsafeActionSubCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-sub-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
	providedIn: 'root'
})
export class UnsafeActionSubCategoryService {



	constructor(private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

	getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<UnsafeActionSubCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${UnsafeActionSubCategoryMasterStore.currentPage}`;
			if (UnsafeActionSubCategoryMasterStore.orderBy) params += `&order_by=${UnsafeActionSubCategoryMasterStore.orderItem}&order=${UnsafeActionSubCategoryMasterStore.orderBy}`;

		}
		if (additionalParams) params += additionalParams;
		if (UnsafeActionSubCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + UnsafeActionSubCategoryMasterStore.searchText;
		if (is_all) params += '&status=all';
		return this._http.get<UnsafeActionSubCategoryPaginationResponse>('/unsafe-action-sub-categories' + (params ? params : '')).pipe(
			map((res: UnsafeActionSubCategoryPaginationResponse) => {
				UnsafeActionSubCategoryMasterStore.setUnsafeActionSubCategory(res);
				return res;
			})
		);
	}
	saveItem(item: UnsafeActionSubCategory) {
		return this._http.post('/unsafe-action-sub-categories', item).pipe(
			map((res: any) => {
				UnsafeActionSubCategoryMasterStore.setLastInsertedId(res.id);
				this._utilityService.showSuccessMessage('success', 'create_success');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	updateItem(id: number, item: UnsafeActionSubCategory): Observable<any> {
		return this._http.put('/unsafe-action-sub-categories/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}


	delete(id: number) {
		return this._http.delete('/unsafe-action-sub-categories/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						UnsafeActionSubCategoryMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});

				return res;
			})
		);
	}

	activate(id: number) {
		return this._http.put('/unsafe-action-sub-categories/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/unsafe-action-sub-categories/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	generateTemplate() {
		this._http.get('/unsafe-action-sub-categories/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_sub_category_template') + ".xlsx");
			}
		)
	}
	exportToExcel() {
		this._http.get('/unsafe-action-sub-categories/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_sub_category') + ".xlsx");
			}
		)
	}
	shareData(data) {
		return this._http.post('/unsafe-action-sub-categories/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/unsafe-action-sub-categories/import',data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}


	sortUnsafeActionObservedGrouplList(type: string, text: string) {
		if (!UnsafeActionSubCategoryMasterStore.orderBy) {
			UnsafeActionSubCategoryMasterStore.orderBy = 'asc';
			UnsafeActionSubCategoryMasterStore.orderItem = type;
		}
		else {
			if (UnsafeActionSubCategoryMasterStore.orderItem == type) {
				if (UnsafeActionSubCategoryMasterStore.orderBy == 'asc') UnsafeActionSubCategoryMasterStore.orderBy = 'desc';
				else UnsafeActionSubCategoryMasterStore.orderBy = 'asc'
			}
			else {
				UnsafeActionSubCategoryMasterStore.orderBy = 'asc';
				UnsafeActionSubCategoryMasterStore.orderItem = type;
			}
		}
	}


}

