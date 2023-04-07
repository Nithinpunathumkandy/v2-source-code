import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyInitiativeMilestoneStatus, StrategyInitiativeMilestoneStatusPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-initiative-milestone-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyInitiativeMilestoneStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-milestone-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class StrategyInitiativeMilestoneStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StrategyInitiativeMilestoneStatusPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${StrategyInitiativeMilestoneStatusMasterStore.currentPage}`;
			if (StrategyInitiativeMilestoneStatusMasterStore.orderBy) params += `&order_by=${StrategyInitiativeMilestoneStatusMasterStore.orderItem}&order=${StrategyInitiativeMilestoneStatusMasterStore.orderBy}`;
		}
		if (StrategyInitiativeMilestoneStatusMasterStore.searchText) params += (params ? '&q=' : '?q=') + StrategyInitiativeMilestoneStatusMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<StrategyInitiativeMilestoneStatusPaginationResponse>('/strategy-initiative-milestone-statuses' + (params ? params : '')).pipe(
			map((res: StrategyInitiativeMilestoneStatusPaginationResponse) => {
				StrategyInitiativeMilestoneStatusMasterStore.setStrategyInitiativeMilestoneStatus(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<StrategyInitiativeMilestoneStatus> {
		return this._http.get<StrategyInitiativeMilestoneStatus>('/strategy-initiative-milestone-statuses/' + id).pipe(
			map((res: StrategyInitiativeMilestoneStatus) => {
				StrategyInitiativeMilestoneStatusMasterStore.updateStrategyInitiativeMilestoneStatus(res)
				return res;
			})
		);
	}

  updateItem(id, item: StrategyInitiativeMilestoneStatus): Observable<any> {
		return this._http.put('/strategy-initiative-milestone-statuses/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'strategy_initiative_milestone_status_updated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  saveItem(item: StrategyInitiativeMilestoneStatus) {
		return this._http.post('/strategy-initiative-milestone-statuses', item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'strategy_initiative_milestone_status_added');
				if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
				else this.getItems().subscribe();
				return res;
			})
		);
	}
	generateTemplate() {
		this._http.get('/strategy-initiative-milestone-statuses/template', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_initiative_milestone_statuses_template') + ".xlsx");
			}
		)
	}

	exportToExcel() {
		this._http.get('/strategy-initiative-milestone-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_initiative_milestone_statuses') + ".xlsx");
			}
		)
	}

	shareData(data) {
		return this._http.post('/strategy-initiative-milestone-statuses/share', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'item_shared');
				return res;
			})
		)
	}

	importData(data) {
		const formData = new FormData();
		formData.append('file', data);
		return this._http.post('/strategy-initiative-milestone-statuses/import', data).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'strategy-initiative-milestone-statuses_imported');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		)
	}

  activate(id: number) {
		return this._http.put('/strategy-initiative-milestone-statuses/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'strategy_initiative_milestone_status_activated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/strategy-initiative-milestone-statuses/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'strategy_initiative_milestone_status_deactivated');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	delete(id: number) {
		return this._http.delete('/strategy-initiative-milestone-statuses/' + id).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'strategy_initiative_milestone_status_deleted');
				this.getItems(false, null, true).subscribe(resp => {
					if (resp.from == null) {
						StrategyInitiativeMilestoneStatusMasterStore.setCurrentPage(resp.current_page - 1);
						this.getItems(false, null, true).subscribe();
					}
				});
				return res;
			})
		);
	}

	searchStrategyInitiativeMilestoneStatusList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: StrategyInitiativeMilestoneStatusPaginationResponse) => {
				StrategyInitiativeMilestoneStatusMasterStore.setStrategyInitiativeMilestoneStatus(res);
				return res;
			})
		);
	}

	sortStrategyInitiativeMilestoneStatusList(type: string, text: string) {
		if (!StrategyInitiativeMilestoneStatusMasterStore.orderBy) {
			StrategyInitiativeMilestoneStatusMasterStore.orderBy = 'asc';
			StrategyInitiativeMilestoneStatusMasterStore.orderItem = type;
		}
		else {
			if (StrategyInitiativeMilestoneStatusMasterStore.orderItem == type) {
				if (StrategyInitiativeMilestoneStatusMasterStore.orderBy == 'asc') StrategyInitiativeMilestoneStatusMasterStore.orderBy = 'desc';
				else StrategyInitiativeMilestoneStatusMasterStore.orderBy = 'asc'
			}
			else {
				StrategyInitiativeMilestoneStatusMasterStore.orderBy = 'asc';
				StrategyInitiativeMilestoneStatusMasterStore.orderItem = type;
			}
		}
		// if(!text)
		//   this.getItems(false,null,true).subscribe();
		// else
		//   this.getItems(false,`&q=${text}`,true).subscribe();
	}
}
