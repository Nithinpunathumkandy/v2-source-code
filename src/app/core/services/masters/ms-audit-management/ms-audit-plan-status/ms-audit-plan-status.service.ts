import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAditPlanStatusesPaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAditPlanStatusMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

  getItems(getAll: boolean = false, additionalParams?:string,status: boolean =  false):Observable<MsAditPlanStatusesPaginationResponse>{
    let params = '';
    if(!getAll){
      params = `?page= ${MsAditPlanStatusMasterStore.currentPage}`;
      if (MsAditPlanStatusMasterStore.orderBy) params += `&order_by=${MsAditPlanStatusMasterStore.orderItem}&order=${MsAditPlanStatusMasterStore.orderBy}`;
    }
    if(MsAditPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+MsAditPlanStatusMasterStore.searchText;
    if(additionalParams)
    params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<MsAditPlanStatusesPaginationResponse>('/ms-audit-plan-statuses' + (params ? params : '')).pipe(
      map((res: MsAditPlanStatusesPaginationResponse) => {
        MsAditPlanStatusMasterStore.setAditPlanStatus(res);
        return res;
      })
    );
  }

	exportToExcel() {
		this._http.get('/ms-audit-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_plan_status') + ".xlsx");
			}
		)
	}

  sortAditPlanStatus(type: string, text: string) {
		if (!MsAditPlanStatusMasterStore.orderBy) {
			MsAditPlanStatusMasterStore.orderBy = 'asc';
			MsAditPlanStatusMasterStore.orderItem = type;
		}
		else {
			if (MsAditPlanStatusMasterStore.orderItem == type) {
				if (MsAditPlanStatusMasterStore.orderBy == 'asc') MsAditPlanStatusMasterStore.orderBy = 'desc';
				else MsAditPlanStatusMasterStore.orderBy = 'asc'
			}
			else {
				MsAditPlanStatusMasterStore.orderBy = 'asc';
				MsAditPlanStatusMasterStore.orderItem = type;
			}
		}
	}
}
