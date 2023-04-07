import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';
import { ObjectiveScoreStore } from 'src/app/stores/strategy-management/objective-score.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ObjectiveResponse } from 'src/app/core/models/strategy-management/strategy.model';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Injectable({
  providedIn: 'root'
})
export class ObjectiveScoreService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ObjectiveResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ObjectiveScoreStore.currentPage}`;
        if (ObjectiveScoreStore.orderBy) params += `&order_by=${ObjectiveScoreStore.orderItem}&order=${ObjectiveScoreStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(ObjectiveScoreStore.searchText) params += (params ? '&q=' : '?q=')+ObjectiveScoreStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_objective' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ObjectiveResponse>('/strategy-profile-objectives' + (params ? params : '')).pipe(
        map((res: ObjectiveResponse) => {
          ObjectiveScoreStore.setObjective(res);
          return res;
        })
      );
   
    }

    induvalObjective(id){
      return this._http.get('/strategy-profiles/'+StrategyStore.strategyProfileId+'/focus-areas/'+StrategyStore.focusAreaId+'/objectives/'+id).pipe(
        map((res) => {
          ObjectiveScoreStore.setInduvalObjective(res);
          return res;
        })
      );
    }

    updateScore(item){
      return this._http.put('/strategy-profiles/'+StrategyStore.strategyProfileId+'/focus-areas/'+StrategyStore.focusAreaId+'/objectives/'+StrategyStore.objectiveId+'/actual-value-update',item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Objective review updated successfully');
          // this.getItems().subscribe();
          return res;
        })
      );
    }
    
    getItemsForScoringFilter(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ObjectiveResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ObjectiveScoreStore.currentPage}`;
        if (ObjectiveScoreStore.orderBy) params += `&order_by=${ObjectiveScoreStore.orderItem}&order=${ObjectiveScoreStore.orderBy}`;
      }
      if(additionalParams) params += additionalParams;
      if(ObjectiveScoreStore.searchText) params += (params ? '&q=' : '?q=')+ObjectiveScoreStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_scorecard' && RightSidebarLayoutStore.filtersAsQueryString) {
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      }
      
      return this._http.get<ObjectiveResponse>('/strategy-profile-objectives' + (params ? params : '')).pipe(
        map((res: ObjectiveResponse) => {
          ObjectiveScoreStore.setObjective(res);
          return res;
        })
      );
   
    }
}
