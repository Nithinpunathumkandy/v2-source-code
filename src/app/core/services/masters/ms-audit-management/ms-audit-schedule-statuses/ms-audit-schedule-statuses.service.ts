import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAditScheduleStatusesPaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-schedule-statuses';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAuditScheduleStatusMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-schedule-status-store';

@Injectable({
  providedIn: 'root'
})
export class MsAuditScheduleStatusesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    ) { }

  getItems(getAll: boolean = false, additionalParams?:string,status: boolean =  false):Observable<MsAditScheduleStatusesPaginationResponse>{
    let params = '';
    if(!getAll){
      params = `?page= ${MsAuditScheduleStatusMasterStore.currentPage}`;
      if (MsAuditScheduleStatusMasterStore.orderBy) params += `&order_by=${MsAuditScheduleStatusMasterStore.orderItem}&order=${MsAuditScheduleStatusMasterStore.orderBy}`;
    }
    if(MsAuditScheduleStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditScheduleStatusMasterStore.searchText;
    if(additionalParams)
    params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<MsAditScheduleStatusesPaginationResponse>('/ms-audit-schedule-statuses' + (params ? params : '')).pipe(
      map((res: MsAditScheduleStatusesPaginationResponse) => {
        MsAuditScheduleStatusMasterStore.setMsAditScheduleStatus(res);
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/ms-audit-schedule-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/ms-audit-schedule-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  sortScheduleStatus(type: string, text: string) {
		if (!MsAuditScheduleStatusMasterStore.orderBy) {
			MsAuditScheduleStatusMasterStore.orderBy = 'asc';
			MsAuditScheduleStatusMasterStore.orderItem = type;
		}
		else {
			if (MsAuditScheduleStatusMasterStore.orderItem == type) {
				if (MsAuditScheduleStatusMasterStore.orderBy == 'asc') MsAuditScheduleStatusMasterStore.orderBy = 'desc';
				else MsAuditScheduleStatusMasterStore.orderBy = 'asc'
			}
			else {
				MsAuditScheduleStatusMasterStore.orderBy = 'asc';
				MsAuditScheduleStatusMasterStore.orderItem = type;
			}
		}
	}
}
