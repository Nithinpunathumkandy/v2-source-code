import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StrategyStatusPaginationResponse } from 'src/app/core/models/masters/strategy/strategy-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyStatusMasterStore } from 'src/app/stores/masters/strategy/strategy-status.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StrategyStatusService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<StrategyStatusPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StrategyStatusMasterStore.currentPage}`;
        if (StrategyStatusMasterStore.orderBy) params += `&order_by=${StrategyStatusMasterStore.orderItem}&order=${StrategyStatusMasterStore.orderBy}`;
      }
      if(StrategyStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+StrategyStatusMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<StrategyStatusPaginationResponse>('/strategy-statuses' + (params ? params : '')).pipe(
        map((res: StrategyStatusPaginationResponse) => {
          StrategyStatusMasterStore.setStrategyStatus(res);
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/strategy-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('strategy_status')+".xlsx");
        }
      )
    }
    
  
    activate(id: number) {
      return this._http.put('/strategy-statuses/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_status_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    
    deactivate(id: number) {
      return this._http.put('/strategy-statuses/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'strategy_status_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    sortStrategyStatusList(type:string, text:string) {
      if (!StrategyStatusMasterStore.orderBy) {
        StrategyStatusMasterStore.orderBy = 'asc';
        StrategyStatusMasterStore.orderItem = type;
      }
      else{
        if (StrategyStatusMasterStore.orderItem == type) {
          if(StrategyStatusMasterStore.orderBy == 'asc') StrategyStatusMasterStore.orderBy = 'desc';
          else StrategyStatusMasterStore.orderBy = 'asc'
        }
        else{
          StrategyStatusMasterStore.orderBy = 'asc';
          StrategyStatusMasterStore.orderItem = type;
        }
      }
    }
}
