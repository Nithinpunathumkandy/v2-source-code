import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionPlnsResponse, OtherActionPlnsResponse } from 'src/app/core/models/strategy-management/action-plans.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ActionPlansStore } from 'src/app/stores/strategy-management/action-plans.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ActionPlansService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ActionPlnsResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ActionPlansStore.currentPage}`;
      if (ActionPlansStore.orderBy) params += `&order_by=${ActionPlansStore.orderItem}&order=${ActionPlansStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(ActionPlansStore.searchText) params += (params ? '&q=' : '?q=')+ActionPlansStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_action_plan' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ActionPlnsResponse>('/strategy-profile-action-plans' + (params ? params : '')).pipe(
      map((res: ActionPlnsResponse) => {
        ActionPlansStore.setActionPlans(res);
        return res;
      })
    );
 
  }
  getInduvalActionPlan(id){
    return this._http.get('/strategy-profile-action-plans/'+id).pipe(
      map((res) => {
       ActionPlansStore.setInduvalActionPlan(res);
        return res
      })
    );
  }

  getotherActionPlans(id){
    return this._http.get('/strategy-profile-action-plans/'+id+'/other-action-plans').pipe(
      map((res:OtherActionPlnsResponse) => {
        ActionPlansStore.setOtherActionPlans(res);
        return res
      })
    );
  }

  updateActionPlanMeasure(id,item){
    return this._http.put('/strategy-profile-action-plans/'+id+'/Reviews',item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Action plan review updated successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getItemsForScoringFilter(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ActionPlnsResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ActionPlansStore.currentPage}`;
      if (ActionPlansStore.orderBy) params += `&order_by=${ActionPlansStore.orderItem}&order=${ActionPlansStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(ActionPlansStore.searchText) params += (params ? '&q=' : '?q=')+ActionPlansStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ActionPlnsResponse>('/strategy-profile-action-plans' + (params ? params : '')).pipe(
      map((res: ActionPlnsResponse) => {
        ActionPlansStore.setActionPlans(res);
        return res;
      })
    );
 
  }
}
