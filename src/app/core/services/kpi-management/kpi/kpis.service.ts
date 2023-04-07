import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MsTypeClauses } from 'src/app/core/models/internal-audit/audit-plan-schedule/audit-plan-schedule';
import { IndividualKpi, IndividualKpiWorkFlow, KpiPaginationResponse, WorkflowHistoryPaginationResponse } from 'src/app/core/models/kpi-management/kpi/kpi';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpisService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<KpiPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KpisStore.currentPage}&status=all`;
      if (KpisStore.orderBy) params += `&order_by=${KpisStore.orderItem}&order=${KpisStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(KpisStore.searchText) params += (params ? '&q=' : '?q=')+KpisStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'kip_management_kpi' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiPaginationResponse>('/kpi-management/kpis' + (params ? params : '')).pipe(
      map((res: KpiPaginationResponse) => {
        KpisStore.setKpi(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualKpi> {
    return this._http.get<IndividualKpi>('/kpi-management/kpis/' + id).pipe(
      map((res: IndividualKpi) => {
        KpisStore.setIndividualKpiDetails(res);
        return res;
      })
    );
  }

  saveItem_tab_1(data): Observable<any> {
    return this._http.post('/kpi-management/kpis', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_info_created_successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem_tab_1(Id:number, data: IndividualKpi): Observable<any> {
    return this._http.put('/kpi-management/kpis/'+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_info_updated_successfully');
        
        // this.getItems().subscribe();

        return res;
      })
    );
  }

  updateItem_tab_2(Id:number, data: IndividualKpi): Observable<any> {
    return this._http.put(`/kpi-management/kpis/${Id}/responsibles`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_responsible_updated_successfully');
        
        // this.getItems().subscribe();

        return res;
      })
    );
  }

  updateItem_tab_3(Id:number, data: IndividualKpi): Observable<any> {
    return this._http.put(`/kpi-management/kpis/${Id}/outcomes`, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_input_details_updated_successfully');
        
        // this.getItems().subscribe();

        return res;
      })
    );
  }


  delete(id: number) {
    return this._http.delete('/kpi-management/kpis/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_deleted_successfully');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            KpisStore.setCurrentPage(resp.current_page-1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/kpi-management/kpis/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_template')+".xlsx");     
        
      }
    )
  }

  exportToExcel() {
    this._http.get('/kpi-management/kpis/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpis')+".xlsx");     
      }
    )
  }

  getSearchItems(additionalParams:string){
    let params='';

    if(additionalParams){
      if(params) params += `&${additionalParams}`;
      else params += `?${additionalParams}`;
    }
    return this._http.get<KpiPaginationResponse>('/kpi-management/kpis' + (params ? params : '')).pipe(
      map((res: KpiPaginationResponse) => {
        KpisStore.setKpi(res); 

        return res;
      })
    );
  }


  sortList(type:string, text:string) {
    if (!KpisStore.orderBy) {
      KpisStore.orderBy = 'desc';
      KpisStore.orderItem = type;
    }
    else{
      if (KpisStore.orderItem == type) {
        if(KpisStore.orderBy == 'desc') KpisStore.orderBy = 'asc';
        else KpisStore.orderBy = 'desc'
      }
      else{
        KpisStore.orderBy = 'desc';
        KpisStore.orderItem = type;
      }
    }
  }

  showSubmitMsg() {
		let params = '';
		if(KpisStore.editFlag && KpisStore.kpiId) 
			params = `kpi_updated_successfully`;
		else 
			params = `kpi_created_successfully`;

		return this._utilityService.showSuccessMessage('success', params);
	}

  submit(Id): Observable<any> {
    return this._http.put('/kpi-management/kpis/'+Id+'/submit',Id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_submit_successfully');
        // this._utilityService.showSuccessMessage('success', 'kpi_approve_successfully');
        return res;
      })
    );
  }

  reject(Id): Observable<any> {
    return this._http.put('/kpi-management/kpis/'+Id+'/reject',Id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_reject_successfully');
        return res;
      })
    );
  }

  approve(Id, data, type): Observable<any> {
    return this._http.put(`/kpi-management/kpis/${Id}/approve`,data).pipe(
      map(res => {
        // if(type=='approve'){
          this._utilityService.showSuccessMessage('success', 'kpi_approve_successfully');
        // }else{
        //   this._utilityService.showSuccessMessage('success', 'kpi_review_submit_successfully');
        // }
        return res;
      })
    );
  }

  revert(Id,data): Observable<any> {
    return this._http.put(`/kpi-management/kpis/${Id}/revert`,data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_revert_successfully');
        return res;
      })
    );
  }

  getWorkFlow(id): Observable<IndividualKpiWorkFlow> {
    return this._http.get<IndividualKpiWorkFlow>('/kpi-management/kpis/'+id+'/workflow').pipe((
      map((res:IndividualKpiWorkFlow)=>{
      
        KpisStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<WorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${KpisStore.currentPage}`;
      // if (KpisStore.orderBy) params += `&order_by=impact_analysis.title&order=${KpisStore.orderBy}`;
    return this._http.get<WorkflowHistoryPaginationResponse>('/kpi-management/kpis/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: WorkflowHistoryPaginationResponse) => {
        KpisStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  getScoreByFrequencyChart(id: number): Observable<IndividualKpi> {
    return this._http.get<IndividualKpi>(`/kpi-management/kpis/${id}/score-by-frequency`).pipe(
      map((res: IndividualKpi) => {
        KpisStore.setIndividualKpiChart(res);
        return res;
      })
    );
  }

  getClausesByMstypes(ms_type_id): Observable<MsTypeClauses[]>{
    return this._http.get<MsTypeClauses[]>(`/document-version-contents?ms_type_ids=${ms_type_id}`).pipe(
      map((res: MsTypeClauses[]) => {     
        AuditPlanScheduleMasterStore.setMsTypeClauses(res);
        return res;
      })
    );
  }

  selectRequiredKpi(issues){
   
    KpisStore.addSelectedKpi(issues);
  }
  
}
