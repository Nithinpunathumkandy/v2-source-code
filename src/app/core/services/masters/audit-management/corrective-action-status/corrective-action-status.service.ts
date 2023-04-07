import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CorrectiveActionStatus, CorrectiveActionStatusPaginationResponse, CorrectiveActionStatusSingle } from 'src/app/core/models/masters/audit-management/Corrective-action-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CorrectiveActionStatusMasterStore } from 'src/app/stores/masters/audit-management/corrective-action-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CorrectiveActionStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<CorrectiveActionStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CorrectiveActionStatusMasterStore.currentPage}`;
      if (CorrectiveActionStatusMasterStore.orderBy) params += `&order_by=${CorrectiveActionStatusMasterStore.orderItem}&order=${CorrectiveActionStatusMasterStore.orderBy}`;
    }
    if(CorrectiveActionStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+CorrectiveActionStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<CorrectiveActionStatusPaginationResponse>('/am-audit-finding-corrective-action-statuses' + (params ? params : '')).pipe(
      map((res: CorrectiveActionStatusPaginationResponse) => {
        CorrectiveActionStatusMasterStore.setCorrectiveActionStatus(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<CorrectiveActionStatusSingle> {
		return this._http.get<CorrectiveActionStatusSingle>('/am-audit-finding-corrective-action-statuses/' + id).pipe(
			map((res: CorrectiveActionStatusSingle) => {
				CorrectiveActionStatusMasterStore.setIndividualCorrectiveActionStatus(res)
				return res;
			})
		);
	}  
  updateItem(id, item: CorrectiveActionStatus): Observable<any> {
		return this._http.put('/am-audit-finding-corrective-action-statuses/' + id, item).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'update_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}
  exportToExcel() {
    this._http.get('/am-audit-finding-corrective-action-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('finding-corrective-action-statuses')+".xlsx");
      }
    )
  }
  
  activate(id: number) {
		return this._http.put('/am-audit-finding-corrective-action-statuses/' + id + '/activate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'activate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}

	deactivate(id: number) {
		return this._http.put('/am-audit-finding-corrective-action-statuses/' + id + '/deactivate', null).pipe(
			map(res => {
				this._utilityService.showSuccessMessage('success', 'deactivate_success');
				this.getItems(false, null, true).subscribe();
				return res;
			})
		);
	}
	searchMsAuditModeList(params) {
		return this.getItems(params ? params : '').pipe(
			map((res: CorrectiveActionStatusPaginationResponse) => {
				CorrectiveActionStatusMasterStore.setCorrectiveActionStatus(res);
				return res;
			})
		);
	}

  sortCorrectiveActionStatusList(type:string, text:string) {
    if (!CorrectiveActionStatusMasterStore.orderBy) {
      CorrectiveActionStatusMasterStore.orderBy = 'asc';
      CorrectiveActionStatusMasterStore.orderItem = type;
    }
    else{
      if (CorrectiveActionStatusMasterStore.orderItem == type) {
        if(CorrectiveActionStatusMasterStore.orderBy == 'asc') CorrectiveActionStatusMasterStore.orderBy = 'desc';
        else CorrectiveActionStatusMasterStore.orderBy = 'asc'
      }
      else{
        CorrectiveActionStatusMasterStore.orderBy = 'asc';
        CorrectiveActionStatusMasterStore.orderItem = type;
      }
    }
  }
}
