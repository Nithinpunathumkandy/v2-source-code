import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ComplianceRegisterActionPlanPaginationResponse, ComplianceRegisterActionPlanDetails,HistoryResponse,ActionPlans} from 'src/app/core/models/compliance-management/compliance-action-plan/compliance-action-plan';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceRegisterActionPlanStore } from 'src/app/stores/compliance-management/compliance-register/action-plan-store';

@Injectable({
  providedIn: 'root'
})
export class ComplianceActionPlanService {


  itemChange: EventEmitter<number> = new EventEmitter();
  
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ComplianceRegisterActionPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceRegisterActionPlanStore.currentPage}`;
      if (ComplianceRegisterActionPlanStore.orderBy) params += `&order=${ComplianceRegisterActionPlanStore.orderBy}`;
      if (ComplianceRegisterActionPlanStore.orderItem) params += `&order_by=${ComplianceRegisterActionPlanStore.orderItem}`;
      if (ComplianceRegisterActionPlanStore.searchText) params += `&q=${ComplianceRegisterActionPlanStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<ComplianceRegisterActionPlanPaginationResponse>('/compliance-register-action-plans' + (params ? params : '')).pipe(
      map((res: ComplianceRegisterActionPlanPaginationResponse) => {
        ComplianceRegisterActionPlanStore.setComplianceRegisterActionPlans(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<ComplianceRegisterActionPlanDetails> {
    return this._http.get<ComplianceRegisterActionPlanDetails>('/compliance-register-action-plans/' + id).pipe(
      map((res: ComplianceRegisterActionPlanDetails) => {
        ComplianceRegisterActionPlanStore.setComplianceRegisterActionPlanDetails(res);
        return res;
      })
    );
  }

  updateItem(framework_id:number, framework): Observable<any> {
    return this._http.put('/compliance-register-action-plans/'+ framework_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_updated');
        
       // this.getItems(false,'status=all').subscribe();
        this.getItem(framework_id).subscribe();

        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/compliance-register-action-plans', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_created');
        //this.getItems(false,).subscribe();
        return res;
      })
    );
  }

  delete(id: number,BAId?) {
    return this._http.delete('/compliance-register-action-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_deleted');
        this.getItems(false, BAId? BAId : 'status=all').subscribe((resp) => {
          if (resp.from == null) {
            ComplianceRegisterActionPlanStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, BAId? BAId : 'status=all').subscribe();
          }
        });
        return res;
      })
    );
  }
  deleteSingleActionPlan(id: number,BAId?) {
    return this._http.delete('/compliance-register-action-plans/' + id).pipe(
      map(res => {
         this._utilityService.showSuccessMessage('success','actionplan_deleted');
        //  this.getItems(false, BAId? BAId : 'status=all').subscribe((resp) => {
        //   if (resp.from == null) {
        //     ComplianceRegisterActionPlanStore.setCurrentPage(resp.current_page - 1);
        //     this.getItems(false, BAId? BAId : 'status=all').subscribe();
        //   }
        // });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/compliance-register-action-plans/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_activated');
        this.getItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/compliance-register-action-plans/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','actionplan_deactivated');
        this.getItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/compliance-register-action-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "actionplan.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/compliance-register-action-plans/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "actionplan.xlsx");
      }
    )
  }

  
       /**
   * Sort Framework List
   * @param type Sort By Variable
   */
  sortFrameworkList(type, callList: boolean = true) {
    if (!ComplianceRegisterActionPlanStore.orderBy) {
      ComplianceRegisterActionPlanStore.orderBy = 'asc';
      ComplianceRegisterActionPlanStore.orderItem = type;
    }
    else {
      if (ComplianceRegisterActionPlanStore.orderItem == type) {
        if (ComplianceRegisterActionPlanStore.orderBy == 'asc') ComplianceRegisterActionPlanStore.orderBy = 'desc';
        else ComplianceRegisterActionPlanStore.orderBy = 'asc'
      }
      else {
        ComplianceRegisterActionPlanStore.orderBy = 'asc';
        ComplianceRegisterActionPlanStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'status=all').subscribe();
  }


  updateActionPlanStatus(actionplanId: number, data): Observable<any> {
    return this._http
      .post("/compliance-register-action-plans/" + actionplanId + "/updates", data)
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
    params = `?page=${ComplianceRegisterActionPlanStore.currentPage}`;
    if (ComplianceRegisterActionPlanStore.orderBy) params += `&order_by=${ComplianceRegisterActionPlanStore.historyOrderItem}&order=${ComplianceRegisterActionPlanStore.historyOrderBy}`;

    return this._http.get<HistoryResponse>("/compliance-register-action-plans/" + actionplanId + "/updates" + (params ? params : '')).pipe(
      map((res: HistoryResponse) => {
        ComplianceRegisterActionPlanStore.setActionPlanHistory(res);
        return res;
      })
    );
  }

  setSelected(position?: number, process: boolean = false, reload = false) {
    if (process) {
      var items: ActionPlans[] = ComplianceRegisterActionPlanStore.complianceRegisterActionPlans;
      if (position >= 0) {
        if (items.length > 0) {
          if (position == 0) {
            if (reload)
              this.itemChange.emit(items[0].id);
            ComplianceRegisterActionPlanStore.setSelected(items[0].id)
          }
          else {
            if (items.length >= 1) {
              if (reload)
                this.itemChange.emit(items[position - 1].id);
              ComplianceRegisterActionPlanStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else {
        if (items.length > 0) {
          if (reload)
            this.itemChange.emit(items[0].id);
          ComplianceRegisterActionPlanStore.setSelected(items[0].id);
        }
      }
    }
    else {
      if (position) {
        if (reload)
          this.itemChange.emit(position);
        ComplianceRegisterActionPlanStore.setSelected(position)
      }
      else {
        if (reload)
          this.itemChange.emit(ComplianceRegisterActionPlanStore.initialItemId);
        ComplianceRegisterActionPlanStore.setSelected(ComplianceRegisterActionPlanStore.initialItemId);
      }
    }
  }
}
