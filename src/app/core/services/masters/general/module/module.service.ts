import { HttpClient,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModuleMasterStore } from 'src/app/stores/masters/general/module-store';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(
    private _http: HttpClient,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<any> {
		let params = '';
		if (!getAll) {
			params = `?page=${ModuleMasterStore.currentPage}`;
			if (ModuleMasterStore.orderBy) params += `&order_by=${ModuleMasterStore.orderItem}&order=${ModuleMasterStore.orderBy}`;
		}
		if (ModuleMasterStore.searchText) params += (params ? '&q=' : '?q=') + ModuleMasterStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<any>('/modules' + (params ? params : '')).pipe(
			map((res: any) => {
				ModuleMasterStore.setModule(res);
				return res;
			})
		);
	}

  getItem(id: number): Observable<any> {
		return this._http.get<any>('/modules/' + id).pipe(
			map((res: any) => {
				// ModuleMasterStore.updateany(res)
				return res;
			})
		);
	}

	sortModuleList(type: string, text: string) {
		if (!ModuleMasterStore.orderBy) {
			ModuleMasterStore.orderBy = 'asc';
			ModuleMasterStore.orderItem = type;
		}
		else {
			if (ModuleMasterStore.orderItem == type) {
				if (ModuleMasterStore.orderBy == 'asc') ModuleMasterStore.orderBy = 'desc';
				else ModuleMasterStore.orderBy = 'asc'
			}
			else {
				ModuleMasterStore.orderBy = 'asc';
				ModuleMasterStore.orderItem = type;
			}
		}
	}
}
