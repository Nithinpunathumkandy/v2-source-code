import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TaskPhaseMasterStore } from 'src/app/stores/masters/event-monitoring/task-phase-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class TaskPhaseService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<any> {
		let params = '';
		if (!getAll) {
			params = `?page=${TaskPhaseMasterStore.currentPage}`;
			if (TaskPhaseMasterStore.orderBy) params += `&order_by=${TaskPhaseMasterStore.orderItem}&order=${TaskPhaseMasterStore.orderBy}`;
		}
		if (TaskPhaseMasterStore.searchText) params += (params ? '&q=' : '?q=') + TaskPhaseMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<any>('/task-phases' + (params ? params : '')).pipe(
			map((res: any) => {
				TaskPhaseMasterStore.setTaskPhase(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<any> {
		return this._http.get<any>('/task-phases/' + id).pipe(
			map((res: any) => {
				// TaskPhaseMasterStore.updateany(res)
				return res;
			})
		);
	}

	sortTaskPhaseList(type: string, text: string) {
		if (!TaskPhaseMasterStore.orderBy) {
			TaskPhaseMasterStore.orderBy = 'asc';
			TaskPhaseMasterStore.orderItem = type;
		}
		else {
			if (TaskPhaseMasterStore.orderItem == type) {
				if (TaskPhaseMasterStore.orderBy == 'asc') TaskPhaseMasterStore.orderBy = 'desc';
				else TaskPhaseMasterStore.orderBy = 'asc'
			}
			else {
				TaskPhaseMasterStore.orderBy = 'asc';
				TaskPhaseMasterStore.orderItem = type;
			}
		}
	}
}
