import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditableItemObjectives, AmAuditableItemProcesses, AmAuditableItemRisks, AmAuditableItems ,AmAuditableItemDepartments, AuditableItems} from 'src/app/core/models/audit-management/am-audit-plan/am-auditable-item';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { AmAuditableItemStore } from 'src/app/stores/audit-management/am-audit-plan/am-auditable-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditableItemService {

  
  constructor(private _http:HttpClient,private _utilityService:UtilityService) { }

  getAuditableItems(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItems> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditableItemStore.currentPage}`;
      if (AmAuditableItemStore.orderBy) params += `&order=${AmAuditableItemStore.orderBy}`;
      if (AmAuditableItemStore.orderItem) params += `&order_by=${AmAuditableItemStore.orderItem}`;
      if (AmAuditableItemStore.searchText) params += `&q=${AmAuditableItemStore.searchText}`;
    }
  

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
     }
    return this._http.get<AmAuditableItems>('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/auditable-items' + (params ? params : '')).pipe(
      map((res: AmAuditableItems) => {
        AmAuditableItemStore.setAuditableItems(res);
       return res;
      })
    );
  }

  getAllItems(){
    return this._http.get<AuditableItems[]>('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/auditable-items?is_all=true').pipe(
      map((res: AuditableItems[]) => {
        AmAuditableItemStore.setAllAuditableItems(res);
       return res;
      })
    );
  }

   getProcesses(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemProcesses> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditableItemStore.processCurrentPage}`;
      if (AmAuditableItemStore.orderBy) params += `&order=${AmAuditableItemStore.orderBy}`;
      if (AmAuditableItemStore.orderItem) params += `&order_by=${AmAuditableItemStore.orderItem}`;
      if (AmAuditableItemStore.searchText) params += `&q=${AmAuditableItemStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemProcesses>('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/processes' + (params ? params : '')).pipe(
      map((res: AmAuditableItemProcesses) => {
        AmAuditableItemStore.setAuditableItemProcesses(res);
        return res;
      })
    );
  }
  getRisks(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemRisks> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditableItemStore.riskCurrentPage}`;
      if (AmAuditableItemStore.orderBy) params += `&order=${AmAuditableItemStore.orderBy}`;
      if (AmAuditableItemStore.orderItem) params += `&order_by=${AmAuditableItemStore.orderItem}`;
      if (AmAuditableItemStore.searchText) params += `&q=${AmAuditableItemStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemRisks>('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/risks' + (params ? params : '')).pipe(
      map((res: AmAuditableItemRisks) => {
        AmAuditableItemStore.setAuditableItemRisks(res);
        return res;
      })
    );
  }
  getStrategicObjectives(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemObjectives> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditableItemStore.objectiveCurrentPage}`;
      if (AmAuditableItemStore.orderBy) params += `&order=${AmAuditableItemStore.orderBy}`;
      if (AmAuditableItemStore.orderItem) params += `&order_by=${AmAuditableItemStore.orderItem}`;
      if (AmAuditableItemStore.searchText) params += `&q=${AmAuditableItemStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemObjectives>('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/strategic-objectives' + (params ? params : '')).pipe(
      map((res: AmAuditableItemObjectives) => {
        AmAuditableItemStore.setAuditableItemObjectives(res);
        return res;
      })
    );
  }

  getDepartments(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemDepartments> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditableItemStore.departmentCurrentPage}`;
      if (AmAuditableItemStore.orderBy) params += `&order=${AmAuditableItemStore.orderBy}`;
      if (AmAuditableItemStore.orderItem) params += `&order_by=${AmAuditableItemStore.orderItem}`;
      if (AmAuditableItemStore.searchText) params += `&q=${AmAuditableItemStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemDepartments>('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/departments' + (params ? params : '')).pipe(
      map((res: AmAuditableItemDepartments) => {
        AmAuditableItemStore.setAuditableItemDepartments(res);
        return res;
      })
    );
  }

  updateAuditableItem(id:number, data): Observable<any> {
    return this._http.put('/am-annual-plans/'+id+'/auditable-items', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_item_updated');
        
        this.getAuditableItems().subscribe();

        return res;
      })
    );
  }

  
  saveAuditableItem(id,data): Observable<any> {
    return this._http.post('/am-annual-plans/'+id+'/auditable-items', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_item_added');
        this.getAuditableItems().subscribe();
        return res;
      })
    );
  }

   checkFrequency(auditable_item_id:number, frequency_id): Observable<any> {
      return this._http.put('/am-annual-plans/'+AmAuditPlansStore.auditPlanId +'/auditable-items/'+auditable_item_id+'/frequency-items/'+frequency_id+'/check',null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'am_audit_plan_frequency_checked');
          
          this.getAuditableItems().subscribe();
  
          return res;
        })
      );
    }

    uncheckFrequency(auditable_item_id:number, frequency_id): Observable<any> {
      return this._http.put('/am-annual-plans/'+AmAuditPlansStore.auditPlanId +'/auditable-items/'+auditable_item_id+'/frequency-items/'+frequency_id+'/un-check',null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'am_audit_plan_frequency_unchecked');
          
          this.getAuditableItems().subscribe();
  
          return res;
        })
      );
    }

  generateTemplate() {
    this._http.get('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/auditable-items/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "auditable-Items.xlsx");
      }
    )
  }

  exportToExcel(params?) {
   
      this._http.get('/am-annual-plans/'+AmAuditPlansStore.auditPlanId+'/auditable-items/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "auditable-items.xlsx");
          SubMenuItemStore.exportClicked=false;
        }
      )
    
   
  }

     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
      sortAuditableItemList(type, callList: boolean = true) {
        if (!AmAuditableItemStore.orderBy) {
          AmAuditableItemStore.orderBy = 'asc';
          AmAuditableItemStore.orderItem = type;
        }
        else {
          if (AmAuditableItemStore.orderItem == type) {
            if (AmAuditableItemStore.orderBy == 'asc') AmAuditableItemStore.orderBy = 'desc';
            else AmAuditableItemStore.orderBy = 'asc'
          }
          else {
            AmAuditableItemStore.orderBy = 'asc';
            AmAuditableItemStore.orderItem = type;
          }
        }
        if (callList)
          this.getAuditableItems().subscribe();
      }



    
}
