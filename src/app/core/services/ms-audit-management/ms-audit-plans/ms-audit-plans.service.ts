import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsAuditPlans, MsAuditPlansPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-plans/ms-audit-plans';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MsAuditPlansService {
  
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MsAuditPlansPaginationResponse> {
    let params = '?is_not_preplan=true';
    if (!getAll) {
      params = params+`&page=${MsAuditPlansStore.currentPage}&status=all`;
      if (MsAuditPlansStore.orderBy) params += `&order_by=${MsAuditPlansStore.orderItem}&order=${MsAuditPlansStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditPlansStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditPlansStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_plans' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<MsAuditPlansPaginationResponse>('/ms-audit-plans' + (params ? params : '')).pipe(
      map((res: MsAuditPlansPaginationResponse) => {
        MsAuditPlansStore.setMsAuditPlans(res);
        return res;
      })
    );
  }

  getItemsPrePlan(getAll: boolean = false, additionalParams?: string): Observable<MsAuditPlansPaginationResponse> {
    let params = '?is_preplan=true';
    if (!getAll) {
      params = params+`&page=${MsAuditPlansStore.currentPagePrePlan}&status=all`;
      if (MsAuditPlansStore.orderBy) params += `&order_by=${'start_date'}&order=${'asc'}`;
    }
    if (additionalParams) params += additionalParams;
    if(MsAuditPlansStore.searchText) params += (params ? '&q=' : '?q=')+MsAuditPlansStore.searchText;
    return this._http.get<MsAuditPlansPaginationResponse>('/ms-audit-plans' + (params ? params : '')).pipe(
      map((res: MsAuditPlansPaginationResponse) => {
        MsAuditPlansStore.setMsAuditPrePlans(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<MsAuditPlans> {
    return this._http.get<MsAuditPlans>(`/ms-audit-plans/${id}`).pipe(
      map((res: MsAuditPlans) => {
        MsAuditPlansStore.setIndividualMsAuditPlansDetails(res);
        return res;
      })
    );
  }

  getItemPrePlan(id: number): Observable<MsAuditPlans> {
    return this._http.get<MsAuditPlans>(`/ms-audit-plans/${id}`+'?is_preplan').pipe(
      map((res: MsAuditPlans) => {
        //MsAuditPlansStore.setIndividualMsAuditPlansDetails(res);
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post(`/ms-audit-plans`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_palns_created_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(Id:number, data: MsAuditPlans): Observable<any> {
    return this._http.put(`/ms-audit-plans/`+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'ms_audit_plans_updated_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number, params?:string) {
    return this._http.delete("/ms-audit-plans/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "ms_audit_plans_deleted_successfully");
        this.getItems(false, params).subscribe((resp) => {
          if (resp.from == null) {
            MsAuditPlansStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, params).subscribe();
          }
        });

        return res;
      })
    );
  }

  publishAuditPlan(id: number) {
    return this._http.put("/ms-audit-plans/"+ id+'/publish','').pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "ms_audit_plan_published_successfully");

        return res;
      })
    );
  }

  getTeam(id){
    return this._http.get(`/ms-teams/${id}`).pipe(
      map((res:any) => {
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/ms-audit-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_plans_template')+".xlsx");
      }
    )
  }

  exportToExcel(val?) {
    let params='';
    if(val)
    {
      params = '?ms_audit_program_ids='+'&is_not_preplan=true'
    }
    else
    {
      params = '?ms_audit_program_ids='+MsAuditProgramsStore.msAuditProgramsId+'&is_not_preplan=true';
    }
    if (MsAuditPlansStore.orderBy) params += `&order=${MsAuditPlansStore.orderBy}`;
    if (MsAuditPlansStore.orderItem) params += `&order_by=${MsAuditPlansStore.orderItem}`;
    // if (MsAuditPlansStore.searchText) params += `&q=${MsAuditPlansStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_plans' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/ms-audit-plans/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_plans')+".xlsx");
      }
    )
  }

   searchMsAuditPlan(params){
    return this.getItems(false, params ? params : '').pipe(
      map((res: MsAuditPlansPaginationResponse) => {
        MsAuditPlansStore.setMsAuditPlans(res);
        return res;
      })
    );
  }

  sortList(type:string, text:string) {
    if (!MsAuditPlansStore.orderBy) {
      MsAuditPlansStore.orderBy = 'desc';
      MsAuditPlansStore.orderItem = type;
    }
    else{
      if (MsAuditPlansStore.orderItem == type) {
        if(MsAuditPlansStore.orderBy == 'desc') MsAuditPlansStore.orderBy = 'asc';
        else MsAuditPlansStore.orderBy = 'desc'
      }
      else{
        MsAuditPlansStore.orderBy = 'desc';
        MsAuditPlansStore.orderItem = type;
      }
    }
  }
}
