import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyInitiativeActionPlanStatusPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-initiative-action-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyInitiativeActionPlanStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-initiative-action-plan-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StrategyInitiativeActionPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<StrategyInitiativeActionPlanStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategyInitiativeActionPlanStatusMasterStore.currentPage}`;
      if (StrategyInitiativeActionPlanStatusMasterStore.orderBy) params += `&order_by=${StrategyInitiativeActionPlanStatusMasterStore.orderItem}&order=${StrategyInitiativeActionPlanStatusMasterStore.orderBy}`;
    }
    if(StrategyInitiativeActionPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategyInitiativeActionPlanStatusMasterStore.searchText;
    if(additionalParams)
       params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<StrategyInitiativeActionPlanStatusPaginationResponse>('/strategy-initiative-action-plan-statuses' + (params ? params : '')).pipe(
      map((res: StrategyInitiativeActionPlanStatusPaginationResponse) => {
        StrategyInitiativeActionPlanStatusMasterStore.setStrategyInitiativeActionPlanStatus(res);
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/strategy-initiative-action-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_initiative_action_plan_status')+".xlsx");
      }
    )
  }
  

  activate(id: number) {
    return this._http.put('/strategy-initiative-action-plan-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_initiative_action_plan_status_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  
  deactivate(id: number) {
    return this._http.put('/strategy-initiative-action-plan-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'strategy_initiative_action_plan_status_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  sortStrategyInitiativeActionPlanStatusList(type:string, text:string) {
    if (!StrategyInitiativeActionPlanStatusMasterStore.orderBy) {
      StrategyInitiativeActionPlanStatusMasterStore.orderBy = 'asc';
      StrategyInitiativeActionPlanStatusMasterStore.orderItem = type;
    }
    else{
      if (StrategyInitiativeActionPlanStatusMasterStore.orderItem == type) {
        if(StrategyInitiativeActionPlanStatusMasterStore.orderBy == 'asc') StrategyInitiativeActionPlanStatusMasterStore.orderBy = 'desc';
        else StrategyInitiativeActionPlanStatusMasterStore.orderBy = 'asc'
      }
      else{
        StrategyInitiativeActionPlanStatusMasterStore.orderBy = 'asc';
        StrategyInitiativeActionPlanStatusMasterStore.orderItem = type;
      }
    }
  }
}
