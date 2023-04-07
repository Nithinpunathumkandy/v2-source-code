import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventMaturityMatrixRangesMaster } from 'src/app/stores/masters/event-monitoring/event-maturity-matrix-ranges.store';

@Injectable({
  providedIn: 'root'
})
export class MaturityMatrixRangesService {

  constructor(
    private _http: HttpClient,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<any> {
		let params = '';
		if (!getAll) {
			params = `?page=${EventMaturityMatrixRangesMaster.currentPage}`;
			if (EventMaturityMatrixRangesMaster.orderBy) params += `&order_by=${EventMaturityMatrixRangesMaster.orderItem}&order=${EventMaturityMatrixRangesMaster.orderBy}`;
		}
		if (EventMaturityMatrixRangesMaster.searchText) params += (params ? '&q=' : '?q=') + EventMaturityMatrixRangesMaster.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<any>('/event-maturity-matrix-ranges' + (params ? params : '')).pipe(
			map((res: any) => {
				EventMaturityMatrixRangesMaster.setMaturityMatrixRanges(res);
				return res;
			})
		);
	}

  sortTaskPhaseList(type: string, text: string) {
		if (!EventMaturityMatrixRangesMaster.orderBy) {
			EventMaturityMatrixRangesMaster.orderBy = 'asc';
			EventMaturityMatrixRangesMaster.orderItem = type;
		}
		else {
			if (EventMaturityMatrixRangesMaster.orderItem == type) {
				if (EventMaturityMatrixRangesMaster.orderBy == 'asc') EventMaturityMatrixRangesMaster.orderBy = 'desc';
				else EventMaturityMatrixRangesMaster.orderBy = 'asc'
			}
			else {
				EventMaturityMatrixRangesMaster.orderBy = 'asc';
				EventMaturityMatrixRangesMaster.orderItem = type;
			}
		}
	}

}
