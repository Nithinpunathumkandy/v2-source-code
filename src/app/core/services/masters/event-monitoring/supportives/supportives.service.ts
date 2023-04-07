import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Supportives, SupportivesPaginationResponse } from "src/app/core/models/masters/event-monitoring/supportives";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SupportivesMasterStore } from 'src/app/stores/masters/event-monitoring/supportives-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class SupportivesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<SupportivesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${SupportivesMasterStore.currentPage}`;
			if (SupportivesMasterStore.orderBy) params += `&order_by=${SupportivesMasterStore.orderItem}&order=${SupportivesMasterStore.orderBy}`;
		}
		if (SupportivesMasterStore.searchText) params += (params ? '&q=' : '?q=') + SupportivesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<SupportivesPaginationResponse>('/event-supportives' + (params ? params : '')).pipe(
			map((res: SupportivesPaginationResponse) => {
				SupportivesMasterStore.setSupportives(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<Supportives> {
		return this._http.get<Supportives>('/event-supportives/' + id).pipe(
			map((res: Supportives) => {
				SupportivesMasterStore.updateSupportives(res)
				return res;
			})
		);
	}

  updateItem(id, item: Supportives): Observable<any> {
		return this._http.put('/event-supportives/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: Supportives) {
		return this._http.post('/event-supportives', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/event-supportives/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_influence') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/event-supportives/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_influence') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/event-supportives/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/event-supportives/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'event_influence_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/event-supportives/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/event-supportives/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/event-supportives/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						SupportivesMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchSupportives(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: SupportivesPaginationResponse) => {
				SupportivesMasterStore.setSupportives(res);
				return res;
			})
		);
	}

	sortSupportivesList(type: string, text: string) {
		if (!SupportivesMasterStore.orderBy) {
			SupportivesMasterStore.orderBy = 'asc';
			SupportivesMasterStore.orderItem = type;
		}
		else {
			if (SupportivesMasterStore.orderItem == type) {
				if (SupportivesMasterStore.orderBy == 'asc') SupportivesMasterStore.orderBy = 'desc';
				else SupportivesMasterStore.orderBy = 'asc'
			}
			else {
				SupportivesMasterStore.orderBy = 'asc';
				SupportivesMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
