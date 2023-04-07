import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyInitiativeStatusPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-initiative-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyInitiativeStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StrategyInitiativeStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<StrategyInitiativeStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategyInitiativeStatusMasterStore.currentPage}`;
      if (StrategyInitiativeStatusMasterStore.orderBy) params += `&order_by=${StrategyInitiativeStatusMasterStore.orderItem}&order=${StrategyInitiativeStatusMasterStore.orderBy}`;
    }
    if(StrategyInitiativeStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategyInitiativeStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<StrategyInitiativeStatusPaginationResponse>('/strategy-initiative-statuses' + (params ? params : '')).pipe(
      map((res: StrategyInitiativeStatusPaginationResponse) => {
        StrategyInitiativeStatusMasterStore.setStrategyInitiativeStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/strategy-initiative-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_initiative_status')+".xlsx");
      }
    )
  }
  

  activate(id: number) {
    return this._http.put('/strategy-initiative-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_initiative_status_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/strategy-initiative-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_initiative_status_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortStrategyInitiativeStatusList(type:string, text:string) {
    if (!StrategyInitiativeStatusMasterStore.orderBy) {
      StrategyInitiativeStatusMasterStore.orderBy = 'asc';
      StrategyInitiativeStatusMasterStore.orderItem = type;
    }
    else{
      if (StrategyInitiativeStatusMasterStore.orderItem == type) {
        if(StrategyInitiativeStatusMasterStore.orderBy == 'asc') StrategyInitiativeStatusMasterStore.orderBy = 'desc';
        else StrategyInitiativeStatusMasterStore.orderBy = 'asc'
      }
      else{
        StrategyInitiativeStatusMasterStore.orderBy = 'asc';
        StrategyInitiativeStatusMasterStore.orderItem = type;
      }
    }
  }
}
