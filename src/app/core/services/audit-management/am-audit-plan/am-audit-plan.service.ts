import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAuditPlan, AmAuditPlanPaginationResponse } from 'src/app/core/models/audit-management/am-audit-plan/am-audit-plan';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AmAuditPlanService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService,
    ) { }

  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmAuditPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditPlansStore.currentPage}`;
      if (AmAuditPlansStore.orderBy) params += `&order=${AmAuditPlansStore.orderBy}`;
      if (AmAuditPlansStore.orderItem) params += `&order_by=${AmAuditPlansStore.orderItem}`;
      if (AmAuditPlansStore.searchText) params += `&q=${AmAuditPlansStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_plan' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmAuditPlanPaginationResponse>('/am-annual-plans' + (params ? params : '')).pipe(
        map((res: AmAuditPlanPaginationResponse) => {
          AmAuditPlansStore.setAuditPlanDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmAuditPlan> {
    return this._http.get<AmAuditPlan>('/am-annual-plans/' + id).pipe(
      map((res: AmAuditPlan) => {
        AmAuditPlansStore.setIndividualAuditPlanDetails(res);
        return res;
      })
    );
  }

  updateItem(audit_plan_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-annual-plans/'+ audit_plan_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_updated');
        
        this.getItems().subscribe();
        this.getItem(audit_plan_id).subscribe();

        return res;
      })
    );
  }

  
  saveItem(auditPlan): Observable<any> {
    return this._http.post('/am-annual-plans', auditPlan).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_added');
        this.getItems().subscribe();
        this.getItem(res['id']).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-annual-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_plan_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  
     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
      sortAuditPlanList(type, callList: boolean = true) {
        if (!AmAuditPlansStore.orderBy) {
          AmAuditPlansStore.orderBy = 'asc';
          AmAuditPlansStore.orderItem = type;
        }
        else {
          if (AmAuditPlansStore.orderItem == type) {
            if (AmAuditPlansStore.orderBy == 'asc') AmAuditPlansStore.orderBy = 'desc';
            else AmAuditPlansStore.orderBy = 'asc'
          }
          else {
            AmAuditPlansStore.orderBy = 'asc';
            AmAuditPlansStore.orderItem = type;
          }
        }
        if (callList)
          this.getItems().subscribe();
      }

      generateTemplate() {
        this._http.get('/am-annual-plans/template', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_plan_template') +".xlsx");
          }
        )
      }
    
      exportToExcel() {
        let params = '';
        if (AmAuditPlansStore.orderBy) params += `?order=${AmAuditPlansStore.orderBy}`;
        if (AmAuditPlansStore.orderItem) params += `&order_by=${AmAuditPlansStore.orderItem}`;

        if (RightSidebarLayoutStore.filterPageTag == 'am_audit_plan' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
          this._http.get('/am-annual-plans/export'+params , { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, "audit-plans.xlsx");
              SubMenuItemStore.exportClicked=false;
            }
          )
        
       
      }
    

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-annual-plans/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','am_audit_plan_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  saveAuditPlanId(id){
    AmAuditPlansStore.setAuditPlanId(id)
  }
}
