import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnsafeActionCategory,UnsafeActionCategorySaveResponse, UnsafeActionCategoryPaginationResponse } from 'src/app/core/models/masters/jso/unsafe-action-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UnsafeActionCategoryMasterStore } from 'src/app/stores/masters/jso/unsafe-action-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class UnsafeActionCategoryService {

  constructor(
    private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<UnsafeActionCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${UnsafeActionCategoryMasterStore.currentPage}`;
			if (UnsafeActionCategoryMasterStore.orderBy) params += `&order_by=${UnsafeActionCategoryMasterStore.orderItem}&order=${UnsafeActionCategoryMasterStore.orderBy}`;

		}
		if (additionalParams) params += additionalParams;
		if (UnsafeActionCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + UnsafeActionCategoryMasterStore.searchText;
		if (is_all) params += '&status=all';
		return this._http.get<UnsafeActionCategoryPaginationResponse>('/unsafe-action-categories' + (params ? params : '')).pipe(
			map((res: UnsafeActionCategoryPaginationResponse) => {
				UnsafeActionCategoryMasterStore.setUnsafeActionCategory(res);
				return res;
			})
		);
	}

	saveItem(item: UnsafeActionCategory,setlastInserted = false) {
		return this._http.post('/unsafe-action-categories', item).pipe(
		  map((res: UnsafeActionCategorySaveResponse) => {
			if(setlastInserted) UnsafeActionCategoryMasterStore.setLastInsertedId(res.id);
			this._utilityService.showSuccessMessage('success','create_success');
			if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
			else this.getItems().subscribe();
			return res;
		  })
		);
	  }
	updateItem(id: number, item: UnsafeActionCategory): Observable<any> {
		return this._http.put('/unsafe-action-categories/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}


	delete(id: number) {
		return this._http.delete('/unsafe-action-categories/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'delete_success');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						UnsafeActionCategoryMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});

				return res;
			})
		);
	}

	activate(id: number) {
		return this._http.put('/unsafe-action-categories/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/unsafe-action-categories/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	generateTemplate() {
		this._http.get('/unsafe-action-categories/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_category_template') + ".xlsx");
			}
		)
	}
	exportToExcel() {
		this._http.get('/unsafe-action-categories/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('unsafe_action_category') + ".xlsx");
			}
		)
	}
	shareData(data) {
		return this._http.post('/unsafe-action-categories/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'share_success');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/unsafe-action-categories/import',data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'import_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}


	sortUnsafeActionObservedGrouplList(type: string, text: string) {
		if (!UnsafeActionCategoryMasterStore.orderBy) {
			UnsafeActionCategoryMasterStore.orderBy = 'asc';
			UnsafeActionCategoryMasterStore.orderItem = type;
		}
		else {
			if (UnsafeActionCategoryMasterStore.orderItem == type) {
				if (UnsafeActionCategoryMasterStore.orderBy == 'asc') UnsafeActionCategoryMasterStore.orderBy = 'desc';
				else UnsafeActionCategoryMasterStore.orderBy = 'asc'
			}
			else {
				UnsafeActionCategoryMasterStore.orderBy = 'asc';
				UnsafeActionCategoryMasterStore.orderItem = type;
			}
		}
	}
}
