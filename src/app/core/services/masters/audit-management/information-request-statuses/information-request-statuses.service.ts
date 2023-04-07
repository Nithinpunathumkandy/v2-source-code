import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InformationRequestStatusPaginationResponse } from 'src/app/core/models/masters/audit-management/information-request-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { InformationRequestStatusMasterStore } from 'src/app/stores/masters/audit-management/information-request-statuses-store';

@Injectable({
  providedIn: 'root'
})
export class InformationRequestStatusesService {

  constructor(    
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<InformationRequestStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${InformationRequestStatusMasterStore.currentPage}`;
      if (InformationRequestStatusMasterStore.orderBy) params += `&order_by=${InformationRequestStatusMasterStore.orderItem}&order=${InformationRequestStatusMasterStore.orderBy}`;
    }
    if(InformationRequestStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+InformationRequestStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<InformationRequestStatusPaginationResponse>('/am-audit-information-request-statuses' + (params ? params : '')).pipe(
      map((res: InformationRequestStatusPaginationResponse) => {
        InformationRequestStatusMasterStore.setInformationRequestStatus(res);
        return res;
      })
    );
  }

  activate(id: number) {
		return this._http.put('/am-audit-information-request-statuses/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/am-audit-information-request-statuses/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

  sortCorrectiveActionStatusList(type:string, text:string) {
    if (!InformationRequestStatusMasterStore.orderBy) {
      InformationRequestStatusMasterStore.orderBy = 'asc';
      InformationRequestStatusMasterStore.orderItem = type;
    }
    else{
      if (InformationRequestStatusMasterStore.orderItem == type) {
        if(InformationRequestStatusMasterStore.orderBy == 'asc') InformationRequestStatusMasterStore.orderBy = 'desc';
        else InformationRequestStatusMasterStore.orderBy = 'asc'
      }
      else{
        InformationRequestStatusMasterStore.orderBy = 'asc';
        InformationRequestStatusMasterStore.orderItem = type;
      }
    }
  }

}
