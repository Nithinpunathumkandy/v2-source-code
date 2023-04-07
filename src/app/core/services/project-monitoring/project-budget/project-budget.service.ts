import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BudgetPaginationResponse,PaymentResponse} from 'src/app/core/models/project-monitoring/project-budget';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectBudgetService {

  constructor(
    private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BudgetPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${BudgetStore.currentPage}`;
			if (BudgetStore.orderBy) params += `&order_by=project_budget.title&order=${BudgetStore.orderBy}`;
		}
		if (BudgetStore.searchText) params += (params ? '&q=' : '?q=') + BudgetStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<BudgetPaginationResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/budgets' + (params ? params : '')).pipe(
			map((res: BudgetPaginationResponse) => {
				BudgetStore.setBudget(res);
				return res;
			})
		);
	}

  getBudget(params?:string){
    return this._http.get<BudgetPaginationResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/budgets' + (params? params: '')).pipe(
      map((res: BudgetPaginationResponse) => {
        BudgetStore.setBudget(res);
        return res;
      })
    );
  }

  
  saveBudget(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/budgets', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'budget_created_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updateBudget(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/budgets/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'budget_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteBudget(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/budgets/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'budget_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getPaymentList(){
    let params = '';
		// if (!getAll) {
		// 	params = `?page=${BudgetStore.currentPage}`;
		// 	if (BudgetStore.orderBy) params += `&order_by=project_budget.title&order=${BudgetStore.orderBy}`;
		// }
		// if (BudgetStore.searchText) params += (params ? '&q=' : '?q=') + BudgetStore.searchText;
		// if (additionalParams) params += additionalParams;
		// if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<PaymentResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/payments' + (params ? params : '')).pipe(
			map((res: PaymentResponse) => {
				BudgetStore.setPayments(res);
				return res;
			})
		);
  }

  getQuarterAmount(id,year){
    return this._http.get('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/'+id+'/'+year+'/get-payments' ).pipe(
			map((res) => {
				return res;
			})
		);
  }

  savePayment(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/payments', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project payment added successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updatePayment(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/payments/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project payment updated successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deletePayment(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/payments/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project payment deleted successfuly');
        // this.getItems().subscribe();
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
