import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SlaStatusesPaginationResponse } from 'src/app/core/models/masters/compliance-management/sla-statuses';
import { SlaStatusesMasterStore } from 'src/app/stores/masters/compliance-management/sla-statuses-store';

@Injectable({
  providedIn: 'root'
})
export class SlaStatusesService {

  constructor(private _http: HttpClient,
		private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<SlaStatusesPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${SlaStatusesMasterStore.currentPage}`;
			if (SlaStatusesMasterStore.orderBy) params += `&order_by=${SlaStatusesMasterStore.orderItem}&order=${SlaStatusesMasterStore.orderBy}`;
		}
		if (SlaStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + SlaStatusesMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		// if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<SlaStatusesPaginationResponse>('/sla-statuses' + (params ? params : '')).pipe(
			map((res: SlaStatusesPaginationResponse) => {
				SlaStatusesMasterStore.setSlaStatus(res);
				return res;
			})
		);
	}
  
  exportToExcel() {
		this._http.get('/sla-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sla_status') + ".xlsx");
			}
		)
	}

  sortSlaStatuseslList(type: string, text: string) {
		if (!SlaStatusesMasterStore.orderBy) {
			SlaStatusesMasterStore.orderBy = 'asc';
			SlaStatusesMasterStore.orderItem = type;
		}
		else {
			if (SlaStatusesMasterStore.orderItem == type) {
				if (SlaStatusesMasterStore.orderBy == 'asc') SlaStatusesMasterStore.orderBy = 'desc';
				else SlaStatusesMasterStore.orderBy = 'asc'
			}
			else {
				SlaStatusesMasterStore.orderBy = 'asc';
				SlaStatusesMasterStore.orderItem = type;
			}
		}
	}

}
