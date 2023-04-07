import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AmAnnualAuditPlan, AmAnnualAuditPlanPaginationResponse } from 'src/app/core/models/audit-management/am-audit-plan/am-annual-audit-plan';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AmAnnualAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-annual-audit-plan.store';
import { AmAuditPlansStore } from 'src/app/stores/audit-management/am-audit-plan/am-audit-plan.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { AmAuditPlanService } from '../am-audit-plan.service';

@Injectable({
  providedIn: 'root'
})
export class AmAnnualAuditPlanService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
		private _helperService: HelperServiceService,
    private _auditPlanService:AmAuditPlanService) { }

  
  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmAnnualAuditPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAnnualAuditPlansStore.currentPage}`;
      if (AmAnnualAuditPlansStore.orderBy) params += `&order=${AmAnnualAuditPlansStore.orderBy}`;
      if (AmAnnualAuditPlansStore.orderItem) params += `&order_by=${AmAnnualAuditPlansStore.orderItem}`;
      if (AmAnnualAuditPlansStore.searchText) params += `&q=${AmAnnualAuditPlansStore.searchText}`;
      if(AmAuditPlansStore.auditPlanId){
        params += `&am_annual_plan_ids=${AmAuditPlansStore.auditPlanId}`;
      }
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_anual_audit_plan_details' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AmAnnualAuditPlanPaginationResponse>('/am-individual-audit-plans' + (params ? params : '')).pipe(
        map((res: AmAnnualAuditPlanPaginationResponse) => {
          AmAnnualAuditPlansStore.setAnnualAuditPlanDetails(res);
          return res;
        })
      );
    
  
  }

  getItem(id: number): Observable<AmAnnualAuditPlan> {
    return this._http.get<AmAnnualAuditPlan>('/am-individual-audit-plans/' + id).pipe(
      map((res: AmAnnualAuditPlan) => {
        AmAnnualAuditPlansStore.setIndividualAnnualAuditPlanDetails(res);
        return res;
      })
    );
  }

  updateItem(audit_plan_id:number, auditSettings): Observable<any> {
    return this._http.put('/am-individual-audit-plans/'+ audit_plan_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_annual_audit_plan_updated');
        
        this.getItems().subscribe();

        return res;
      })
    );
  }

  
  saveItem(auditPlan): Observable<any> {
    return this._http.post('/am-individual-audit-plans', auditPlan).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_annual_audit_plan_added');
        this.getItems().subscribe();
        this._auditPlanService.getItem(AmAuditPlansStore.auditPlanId).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-individual-audit-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_annual_audit_plan_deleted');
        this.getItems().subscribe();
        // this._auditPlanService.getItem(AmAuditPlansStore.auditPlanId).subscribe();

        return res;
      })
    );
  }

  
     /**
   * Sort Risk List
   * @param type Sort By Variable
   */
      sortAuditPlanList(type, callList: boolean = true) {
        if (!AmAnnualAuditPlansStore.orderBy) {
          AmAnnualAuditPlansStore.orderBy = 'asc';
          AmAnnualAuditPlansStore.orderItem = type;
        }
        else {
          if (AmAnnualAuditPlansStore.orderItem == type) {
            if (AmAnnualAuditPlansStore.orderBy == 'asc') AmAnnualAuditPlansStore.orderBy = 'desc';
            else AmAnnualAuditPlansStore.orderBy = 'asc'
          }
          else {
            AmAnnualAuditPlansStore.orderBy = 'asc';
            AmAnnualAuditPlansStore.orderItem = type;
          }
        }
        if (callList)
          this.getItems().subscribe();
      }

      generateTemplate() {
        this._http.get('/am-individual-audit-plans/template', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_annual_audit_plan_template')+".xlsx");     
          }
        )
      }
    
      exportToExcel() {
        let params = '';
        if (AmAnnualAuditPlansStore.orderBy) params += `?order=${AmAnnualAuditPlansStore.orderBy}`;
      if (AmAnnualAuditPlansStore.orderItem) params += `&order_by=${AmAnnualAuditPlansStore.orderItem}`;
        if (RightSidebarLayoutStore.filterPageTag == 'am_anual_audit_plan_details' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
        if(AmAuditPlansStore.auditPlanId){
          params=(params=='')?params+`?am_annual_plan_ids=${AmAuditPlansStore.auditPlanId}`:params+`&am_annual_plan_ids=${AmAuditPlansStore.auditPlanId}`;
        }
          this._http.get('/am-individual-audit-plans/export'+params, { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('am_annual_audit_plan')+".xlsx");     
              SubMenuItemStore.exportClicked=false;
            }
          )
        
       
      }
    

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/am-individual-audit-plans/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','am_annual_audit_plan_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  saveAuditPlanId(id){
    AmAnnualAuditPlansStore.setAnnualAuditPlanId(id)
  }
}
