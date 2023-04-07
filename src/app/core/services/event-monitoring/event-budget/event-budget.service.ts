import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BudgetPaginationResponse} from 'src/app/core/models/event-monitoring/event-budget';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventBudgetService {

  constructor(
    private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BudgetPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BudgetStore.currentPage}`;
			if (BudgetStore.orderBy) params += `&order_by=event_budget.title&order=${BudgetStore.orderBy}`;
		}
		if (BudgetStore.searchText) params += (params ? '&q=' : '?q=') + BudgetStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BudgetPaginationResponse>('/events/'+EventsStore.selectedEventId+'/budgets' + (params ? params : '')).pipe(
			map((res: BudgetPaginationResponse) => {
				BudgetStore.setBudget(res);
				return res;
			})
		);
	}

  getBudget(params?:string){
    return this._http.get<BudgetPaginationResponse>('/events/'+EventsStore.selectedEventId+'+/budgets/' + (params? params: '')).pipe(
      map((res: BudgetPaginationResponse) => {
        BudgetStore.setBudget(res);
        return res;
      })
    );
  }

  
  saveBudget(item){
    return this._http.post('/events/'+EventsStore.selectedEventId+'/budgets', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'event_budget_created_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updateBudget(item,id){
    return this._http.put('/events/'+EventsStore.selectedEventId+'/budgets/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'event_budget_update_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteBudget(id){
    return this._http.delete('/events/'+EventsStore.selectedEventId+'/budgets/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'event_budget_delete_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  sortBudgetList(type: string, text: string) {
		if (!BudgetStore.orderBy) {
			BudgetStore.orderBy = 'asc';
			BudgetStore.orderItem = type;
		}
		else {
			if (BudgetStore.orderItem == type) {
				if (BudgetStore.orderBy == 'asc') BudgetStore.orderBy = 'desc';
				else BudgetStore.orderBy = 'asc'
			}
			else {
				BudgetStore.orderBy = 'asc';
				BudgetStore.orderItem = type;
			}
		}
  }
}
