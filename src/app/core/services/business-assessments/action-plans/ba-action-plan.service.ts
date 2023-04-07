import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BAActionPlanPaginationResponse, BAActionPlanDetails,HistoryResponse,ActionPlans} from 'src/app/core/models/business-assessments/action-plans/action-plan';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';


@Injectable({
  providedIn: 'root'
})
export class BaActionPlanService {


  itemChange: EventEmitter<number> = new EventEmitter();
  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<BAActionPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BAActionPlanStore.currentPage}`;
      if (BAActionPlanStore.orderBy) params += `&order=${BAActionPlanStore.orderBy}`;
      if (BAActionPlanStore.orderItem) params += `&order_by=${BAActionPlanStore.orderItem}`;
      if (BAActionPlanStore.searchText) params += `&q=${BAActionPlanStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'business_assessment_action_plan' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<BAActionPlanPaginationResponse>('/business-assessment-action-plans' + (params ? params : '')).pipe(
      map((res: BAActionPlanPaginationResponse) => {
        BAActionPlanStore.setBAActionPlans(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<BAActionPlanDetails> {
    return this._http.get<BAActionPlanDetails>('/business-assessment-action-plans/' + id).pipe(
      map((res: BAActionPlanDetails) => {
        BAActionPlanStore.setBAActionPlanDetails(res);
        return res;
      })
    );
  }

  updateItem(framework_id:number, framework): Observable<any> {
    return this._http.put('/business-assessment-action-plans/'+ framework_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_updated');
        
        this.getItems(false,'status=all').subscribe();
        this.getItem(framework_id).subscribe();

        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/business-assessment-action-plans', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_created');
        this.getItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  delete(id: number,BAId?) {
    return this._http.delete('/business-assessment-action-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_deleted');
        this.getItems(false, BAId? BAId : 'status=all').subscribe((resp) => {
          if (resp.from == null) {
            BAActionPlanStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, BAId? BAId : 'status=all').subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/business-assessment-action-plans/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_activated');
        this.getItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/business-assessment-action-plans/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_deactivated');
        this.getItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/business-assessment-action-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_action_plan_template')+".xlsx");     
      }
    )
  }

  exportToExcel() {
    this._http.get('/business-assessment-action-plans/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_action_plans')+".xlsx");     
      }
    )
  }

  
       /**
   * Sort Framework List
   * @param type Sort By Variable
   */
  sortFrameworkList(type, callList: boolean = true) {
    if (!BAActionPlanStore.orderBy) {
      BAActionPlanStore.orderBy = 'asc';
      BAActionPlanStore.orderItem = type;
    }
    else {
      if (BAActionPlanStore.orderItem == type) {
        if (BAActionPlanStore.orderBy == 'asc') BAActionPlanStore.orderBy = 'desc';
        else BAActionPlanStore.orderBy = 'asc'
      }
      else {
        BAActionPlanStore.orderBy = 'asc';
        BAActionPlanStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'status=all').subscribe();
  }


  updateActionPlanStatus(actionplanId: number, data): Observable<any> {
    return this._http
      .post("/business-assessment-action-plans/" + actionplanId + "/updates", data)
      .pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "action_plan_status_updated"
          );
          this.getItem(actionplanId).subscribe();
          return res;
        })
      );
  }

  getActionPlanStatusHistory(actionplanId: number): Observable<HistoryResponse> {
    let params = '';
    params = `?page=${BAActionPlanStore.currentPage}`;
    if (BAActionPlanStore.orderBy) params += `&order_by=${BAActionPlanStore.historyOrderItem}&order=${BAActionPlanStore.historyOrderBy}`;

    return this._http.get<HistoryResponse>("/business-assessment-action-plans/" + actionplanId + "/updates" + (params ? params : '')).pipe(
      map((res: HistoryResponse) => {
        BAActionPlanStore.setActionPlanHistory(res);
        return res;
      })
    );
  }

  setSelected(position?: number, process: boolean = false, reload = false) {
    if (process) {
      var items: ActionPlans[] = BAActionPlanStore.BAActionPlans;
      if (position >= 0) {
        if (items.length > 0) {
          if (position == 0) {
            if (reload)
              this.itemChange.emit(items[0].id);
            BAActionPlanStore.setSelected(items[0].id)
          }
          else {
            if (items.length >= 1) {
              if (reload)
                this.itemChange.emit(items[position - 1].id);
              BAActionPlanStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else {
        if (items.length > 0) {
          if (reload)
            this.itemChange.emit(items[0].id);
          BAActionPlanStore.setSelected(items[0].id);
        }
      }
    }
    else {
      if (position) {
        if (reload)
          this.itemChange.emit(position);
        BAActionPlanStore.setSelected(position)
      }
      else {
        if (reload)
          this.itemChange.emit(BAActionPlanStore.initialItemId);
        BAActionPlanStore.setSelected(BAActionPlanStore.initialItemId);
      }
    }
  }
}
