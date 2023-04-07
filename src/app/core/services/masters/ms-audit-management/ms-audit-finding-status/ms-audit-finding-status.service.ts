import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAditFindingStatusesPaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-finding-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MsAditFindingStatusMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-finding-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditFindingStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

  getItems(getAll: boolean = false, additionalParams?:string,status: boolean =  false):Observable<MsAditFindingStatusesPaginationResponse>{
    let params = '';
    if(!getAll){
      params = `?page= ${MsAditFindingStatusMasterStore.currentPage}`;
      if (MsAditFindingStatusMasterStore.orderBy) params += `&order_by=${MsAditFindingStatusMasterStore.orderItem}&order=${MsAditFindingStatusMasterStore.orderBy}`;
    }
    if(MsAditFindingStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+MsAditFindingStatusMasterStore.searchText;
    if(additionalParams)
    params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<MsAditFindingStatusesPaginationResponse>('/ms-audit-finding-statuses' + (params ? params : '')).pipe(
      map((res: MsAditFindingStatusesPaginationResponse) => {
        MsAditFindingStatusMasterStore.setAditFindingStatus(res);
        return res;
      })
    );
  }

	exportToExcel() {
		this._http.get('/ms-audit-finding-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
			(response: any) => {
				this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_finding_status') + ".xlsx");
			}
		)
	}

  sortAditPlanStatus(type: string, text: string) {
		if (!MsAditFindingStatusMasterStore.orderBy) {
			MsAditFindingStatusMasterStore.orderBy = 'asc';
			MsAditFindingStatusMasterStore.orderItem = type;
		}
		else {
			if (MsAditFindingStatusMasterStore.orderItem == type) {
				if (MsAditFindingStatusMasterStore.orderBy == 'asc') MsAditFindingStatusMasterStore.orderBy = 'desc';
				else MsAditFindingStatusMasterStore.orderBy = 'asc'
			}
			else {
				MsAditFindingStatusMasterStore.orderBy = 'asc';
				MsAditFindingStatusMasterStore.orderItem = type;
			}
		}
	}
}