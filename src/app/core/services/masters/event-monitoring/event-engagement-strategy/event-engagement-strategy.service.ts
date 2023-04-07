import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEngagementStrategy, EventEngagementStrategyPaginationResponse, EventEngagementStrategySingle } from 'src/app/core/models/masters/event-monitoring/event-engagement-strategy';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEngagementStrategyMasterStore } from 'src/app/stores/masters/event-monitoring/event-engagement-strategy-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventEngagementStrategyService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<EventEngagementStrategyPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventEngagementStrategyMasterStore.currentPage}`;
			if (EventEngagementStrategyMasterStore.orderBy) params += `&order_by=${EventEngagementStrategyMasterStore.orderItem}&order=${EventEngagementStrategyMasterStore.orderBy}`;
		}
		if (EventEngagementStrategyMasterStore.searchText) params += (params ? '&q=' : '?q=') + EventEngagementStrategyMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<EventEngagementStrategyPaginationResponse>('/event-engagement-strategies' + (params ? params : '')).pipe(
			map((res: EventEngagementStrategyPaginationResponse) => {
				EventEngagementStrategyMasterStore.setEventEngagementStrategy(res);
				return res;
			})
		);
	}

  // getItem(id: number): Observable<EventEngagementStrategy> {
	// 	return this._http.get<EventEngagementStrategy>('/event-engagement-strategies/' + id).pipe(
	// 		map((res: EventEngagementStrategy) => {
	// 			EventEngagementStrategyMasterStore.updateEventEngagementStrategy(res)
	// 			return res;
	// 		})
	// 	);
	// }

  getItem(id): Observable<EventEngagementStrategySingle> {
		return this._http.get<EventEngagementStrategySingle>('/event-engagement-strategies/' + id).pipe(
			map((res: EventEngagementStrategySingle) => {
				EventEngagementStrategyMasterStore.setIndividualEventEngagementStrategy(res)
				return res;
			})
		);
	}

  updateItem(id, item: any): Observable<any> {
		return this._http.put('/event-engagement-strategies/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategy_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: any) {
		return this._http.post('/event-engagement-strategies', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategy_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/event-engagement-strategies/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_engagement_strategys_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/event-engagement-strategies/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('event_engagement_strategys') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/event-engagement-strategies/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategys_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/event-engagement-strategies/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategys_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/event-engagement-strategies/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategy_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/event-engagement-strategies/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategy_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/event-engagement-strategies/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'event_engagement_strategy_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						EventEngagementStrategyMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchEventEngagementStrategyList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: EventEngagementStrategyPaginationResponse) => {
				EventEngagementStrategyMasterStore.setEventEngagementStrategy(res);
				return res;
			})
		);
	}

	sortEventEngagementStrategyList(type: string, text: string) {
		if (!EventEngagementStrategyMasterStore.orderBy) {
			EventEngagementStrategyMasterStore.orderBy = 'asc';
			EventEngagementStrategyMasterStore.orderItem = type;
		}
		else {
			if (EventEngagementStrategyMasterStore.orderItem == type) {
				if (EventEngagementStrategyMasterStore.orderBy == 'asc') EventEngagementStrategyMasterStore.orderBy = 'desc';
				else EventEngagementStrategyMasterStore.orderBy = 'asc'
			}
			else {
				EventEngagementStrategyMasterStore.orderBy = 'asc';
				EventEngagementStrategyMasterStore.orderItem = type;
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

	selectRequiredEventEngagementStrategy(items) {
		EventEngagementStrategyMasterStore.addSelectedEventEngagementStrategy(items);
	}
}


