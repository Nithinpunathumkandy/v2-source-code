import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SlaCategory, SlaCategoryPaginationResponse } from '../../../../models/masters/compliance-management/sla-category';
import { SlaCategoryMasterStore } from 'src/app/stores/masters/compliance-management/sla-category-store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
	providedIn: 'root'
})
export class SlaCategoryService {

	constructor(
		private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService
	) { }

	getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<SlaCategoryPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${SlaCategoryMasterStore.currentPage}`;
			if (SlaCategoryMasterStore.orderBy) params += `&order_by=${SlaCategoryMasterStore.orderItem}&order=${SlaCategoryMasterStore.orderBy}`;
		}
		if (SlaCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + SlaCategoryMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<SlaCategoryPaginationResponse>('/sla-categories' + (params ? params : '')).pipe(
			map((res: SlaCategoryPaginationResponse) => {
				SlaCategoryMasterStore.setSlaCategory(res);
				return res;
			})
		);
	}

	getItem(id: number): Observable<SlaCategory> {
		return this._http.get<SlaCategory>('/sla-categories/' + id).pipe(
			map((res: SlaCategory) => {
				SlaCategoryMasterStore.updateSlaCategory(res)
				return res;
			})
		);
	}

	updateItem(id, item: SlaCategory): Observable<any> {
		return this._http.put('/sla-categories/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'sla_category_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	saveItem(item: SlaCategory) {
		return this._http.post('/sla-categories', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'sla_category_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/sla-categories/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sla_category_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/sla-categories/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sla_category') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/sla-categories/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/sla-categories/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'sla_category_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

	activate(id: number) {
		return this._http.put('/sla-categories/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'sla_category_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/sla-categories/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'sla_category_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/sla-categories/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'sla_category_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						SlaCategoryMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSlaCategory(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: SlaCategoryPaginationResponse) => {
				SlaCategoryMasterStore.setSlaCategory(res);
				return res;
			})
		);
	}

	sortSlaCategorylList(type: string, text: string) {
		if (!SlaCategoryMasterStore.orderBy) {
			SlaCategoryMasterStore.orderBy = 'asc';
			SlaCategoryMasterStore.orderItem = type;
		}
		else {
			if (SlaCategoryMasterStore.orderItem == type) {
				if (SlaCategoryMasterStore.orderBy == 'asc') SlaCategoryMasterStore.orderBy = 'desc';
				else SlaCategoryMasterStore.orderBy = 'asc'
			}
			else {
				SlaCategoryMasterStore.orderBy = 'asc';
				SlaCategoryMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
