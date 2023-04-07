import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImprovementPlansPaginationResponse, IndividualImprovementPlans } from 'src/app/core/models/kpi-management/improvement-plans/improvement-plans';
import { HistoryResponse } from 'src/app/core/models/kpi-management/improvement-plans/improvement-plans-history';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ImprovementPlansHistoryStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-history-store';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ImprovementLansService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ImprovementPlansPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ImprovementPlansStore.currentPage}&status=all`;
      if (ImprovementPlansStore.orderBy) params += `&order_by=${ImprovementPlansStore.orderItem}&order=${ImprovementPlansStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(ImprovementPlansStore.searchText) params += (params ? '&q=' : '?q=')+ImprovementPlansStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'kip_management_improvement_plans' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ImprovementPlansPaginationResponse>('/kpi-management/kpi-improvement-plans' + (params ? params : '')).pipe(
      map((res: ImprovementPlansPaginationResponse) => {
        ImprovementPlansStore.setImprovementPlans(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualImprovementPlans> {
    return this._http.get<IndividualImprovementPlans>(`/kpi-management/kpi-improvement-plans/${id}`).pipe(
      map((res: IndividualImprovementPlans) => {
        ImprovementPlansStore.setIndividualImprovementPlansDetails(res);
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post(`/kpi-management/kpi-improvement-plans`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'improvement_plans_created_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(Id:number, data: IndividualImprovementPlans): Observable<any> {
    return this._http.put(`/kpi-management/kpi-improvement-plans/`+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'improvement_plans_updated_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete("/kpi-management/kpi-improvement-plans/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "improvement_plans_deleted_successfully");
        this.getItems().subscribe((resp) => {
          if (resp.from == null) {
            ImprovementPlansStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/kpi-management/kpi-improvement-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_improvement_plans_template')+".xlsx");     
       }
    )
  }

  exportToExcel(params?) {
    this._http.get('/kpi-management/kpi-improvement-plans/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_improvement_plans')+".xlsx");

      }
    )
  }

  updateProgressItem(Id: number, data): Observable<any> {
    return this._http
      .post("/kpi-management/kpi-improvement-plan/" + Id + "/updates", data)
      .pipe(
        map((res) => {
          this._utilityService.showSuccessMessage("success","improvement_plan_status_updated_successfully");
          this.getItem(Id).subscribe();
          return res;
        })
      );
  }

  getHistory(ImprovementPlanId: number): Observable<HistoryResponse> {

    let params = '';
      params = `?page=${ImprovementPlansHistoryStore.currentPage}`;
      if (ImprovementPlansHistoryStore.orderBy) params += `&order_by=${ImprovementPlansHistoryStore.orderItem}&order=${ImprovementPlansHistoryStore.orderBy}`;

    return this._http.get<HistoryResponse>("/kpi-management/kpi-improvement-plan/" + ImprovementPlanId + "/updates" + (params ? params : '')).pipe(
      map((res: HistoryResponse) => {
        ImprovementPlansHistoryStore.setHistory(res);
        return res;
      })
    );
  }

  sortList(type:string, text:string) {
    if (!ImprovementPlansStore.orderBy) {
      ImprovementPlansStore.orderBy = 'desc';
      ImprovementPlansStore.orderItem = type;
    }
    else{
      if (ImprovementPlansStore.orderItem == type) {
        if(ImprovementPlansStore.orderBy == 'desc') ImprovementPlansStore.orderBy = 'asc';
        else ImprovementPlansStore.orderBy = 'desc'
      }
      else{
        ImprovementPlansStore.orderBy = 'desc';
        ImprovementPlansStore.orderItem = type;
      }
    }
  }

}
