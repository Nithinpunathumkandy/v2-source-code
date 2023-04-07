import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualRiskRegister, RiskRegisterPaginationResponse } from 'src/app/core/models/event-monitoring/risk-register/risk-register';
import { ContextChart } from 'src/app/core/models/risk-management/risks/risks';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { RiskRegisterStore } from 'src/app/stores/event-monitoring/risk-register/risk-register-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class RiskRegisterService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<RiskRegisterPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${RiskRegisterStore.currentPage}&status=all`;
      if (RiskRegisterStore.orderBy) params += `&order_by=${RiskRegisterStore.orderItem}&order=${RiskRegisterStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(RiskRegisterStore.searchText) params += (params ? '&q=' : '?q=')+RiskRegisterStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'event_monitoring_risk_register' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<RiskRegisterPaginationResponse>('/event-risks' + (params ? params : '')).pipe(
      map((res: RiskRegisterPaginationResponse) => {
        RiskRegisterStore.setRiskRegisters(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualRiskRegister> {
    return this._http.get<IndividualRiskRegister>(`/event-risks/${id}`).pipe(
      map((res: IndividualRiskRegister) => {
        RiskRegisterStore.setIndividualRiskRegisterDetails(res);
        return res;
      })
    );
  }

  saveItem(data): Observable<any> {
    return this._http.post(`/event-risks`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_resgister_created_successfully');
        this.getItems(false,`&event_ids=${EventsStore.selectedEventId}`).subscribe();
        return res;
      })
    );
  }

  updateItem( data: any , Id:number): Observable<any> {
    return this._http.put(`/event-risks/`+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_resgister_updated_successfully');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete("/event-risks/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "improvement_plans_deleted_successfully");
        this.getItems().subscribe((resp) => {
          if (resp.from == null) {
            RiskRegisterStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  saveIssueMapping(saveData): Observable<any> {
    return this._http.post('/event-risks/' + RiskRegisterStore.RiskRegisterId + '/issue-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteIssue(id) {
    return this._http.put("/event-risks/"+RiskRegisterStore.RiskRegisterId+"/issue-mapping",id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage("success", "risk_issue_deleted_successfully");


        return res;
      })
    );
  }

  getContextChart(id: number): Observable<ContextChart> {
    return this._http.get<ContextChart>('/event-risks/' + id+'/analyses/charts').pipe(
      map((res: ContextChart) => {
        if(res&&res.risk_analysis){
          RiskRegisterStore.setContextChartDetails(res);
        }
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  // generateTemplate() {
  //   this._http.get('/event-risks/template', { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, "Improvement Plans Template.xlsx");
  //     }
  //   )
  // }

  // exportToExcel(params?) {
  //   this._http.get('/event-risks/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, "Improvement Plans.xlsx");
  //     }
  //   )
  // }

  sortList(type:string, text:string) {
    if (!RiskRegisterStore.orderBy) {
      RiskRegisterStore.orderBy = 'desc';
      RiskRegisterStore.orderItem = type;
    }
    else{
      if (RiskRegisterStore.orderItem == type) {
        if(RiskRegisterStore.orderBy == 'desc') RiskRegisterStore.orderBy = 'asc';
        else RiskRegisterStore.orderBy = 'desc'
      }
      else{
        RiskRegisterStore.orderBy = 'desc';
        RiskRegisterStore.orderItem = type;
      }
    }
  }

}