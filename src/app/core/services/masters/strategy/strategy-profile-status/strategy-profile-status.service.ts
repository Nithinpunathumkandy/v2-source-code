import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyProfileStatusPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-profile-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyProfileStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-profile-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StrategyProfileStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<StrategyProfileStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategyProfileStatusMasterStore.currentPage}`;
      if (StrategyProfileStatusMasterStore.orderBy) params += `&order_by=${StrategyProfileStatusMasterStore.orderItem}&order=${StrategyProfileStatusMasterStore.orderBy}`;
    }
    if(StrategyProfileStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategyProfileStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<StrategyProfileStatusPaginationResponse>('/strategy-profile-statuses' + (params ? params : '')).pipe(
      map((res: StrategyProfileStatusPaginationResponse) => {
        StrategyProfileStatusMasterStore.setStrategyProfileStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/strategy-profile-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_profile_status')+".xlsx");
      }
    )
  }
  

  activate(id: number) {
    return this._http.put('/strategy-profile-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_profile_status_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/strategy-profile-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_profile_status_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortStrategyProfileStatusList(type:string, text:string) {
    if (!StrategyProfileStatusMasterStore.orderBy) {
      StrategyProfileStatusMasterStore.orderBy = 'asc';
      StrategyProfileStatusMasterStore.orderItem = type;
    }
    else{
      if (StrategyProfileStatusMasterStore.orderItem == type) {
        if(StrategyProfileStatusMasterStore.orderBy == 'asc') StrategyProfileStatusMasterStore.orderBy = 'desc';
        else StrategyProfileStatusMasterStore.orderBy = 'asc'
      }
      else{
        StrategyProfileStatusMasterStore.orderBy = 'asc';
        StrategyProfileStatusMasterStore.orderItem = type;
      }
    }
  }
}
