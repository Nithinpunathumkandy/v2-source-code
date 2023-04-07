import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventInfluence, EventInfluencePaginationResponse } from 'src/app/core/models/masters/event-monitoring/event-influence';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventInfluenceMasterStore } from 'src/app/stores/masters/event-monitoring/event-influence-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventInfluenceService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<EventInfluencePaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventInfluenceMasterStore.currentPage}`;
			if (EventInfluenceMasterStore.orderBy) params += `&order_by=${EventInfluenceMasterStore.orderItem}&order=${EventInfluenceMasterStore.orderBy}`;
		}
		if (EventInfluenceMasterStore.searchText) params += (params ? '&q=' : '?q=') + EventInfluenceMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<EventInfluencePaginationResponse>('/event-influences' + (params ? params : '')).pipe(
			map((res: EventInfluencePaginationResponse) => {
				EventInfluenceMasterStore.setEventInfluence(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<EventInfluence> {
		return this._http.get<EventInfluence>('/event-influences/' + id).pipe(
			map((res: EventInfluence) => {
				EventInfluenceMasterStore.updateEventInfluence(res)
				return res;
			})
		);
	}

  updateItem(id, item: EventInfluence): Observable<any> {
		return this._http.put('/event-influences/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: EventInfluence) {
		return this._http.post('/event-influences', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/event-influences/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_influence') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/event-influences/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_influence') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/event-influences/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/event-influences/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'event_influence_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/event-influences/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/event-influences/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/event-influences/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_influence_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						EventInfluenceMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchEventInfluence(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: EventInfluencePaginationResponse) => {
				EventInfluenceMasterStore.setEventInfluence(res);
				return res;
			})
		);
	}

	sortEventInfluenceList(type: string, text: string) {
		if (!EventInfluenceMasterStore.orderBy) {
			EventInfluenceMasterStore.orderBy = 'asc';
			EventInfluenceMasterStore.orderItem = type;
		}
		else {
			if (EventInfluenceMasterStore.orderItem == type) {
				if (EventInfluenceMasterStore.orderBy == 'asc') EventInfluenceMasterStore.orderBy = 'desc';
				else EventInfluenceMasterStore.orderBy = 'asc'
			}
			else {
				EventInfluenceMasterStore.orderBy = 'asc';
				EventInfluenceMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
