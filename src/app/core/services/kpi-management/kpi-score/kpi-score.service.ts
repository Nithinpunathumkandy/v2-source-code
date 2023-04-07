import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualKpiScore, IndividualKpiWorkFlow, KpiScorePaginationResponse, WorkflowHistoryPaginationResponse } from 'src/app/core/models/kpi-management/kpi-score/kpi-score';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class KpiScoreService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<KpiScorePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KpiScoreStore.currentPage}&status=all`;
      if (KpiScoreStore.orderBy) params += `&order_by=${KpiScoreStore.orderItem}&order=${KpiScoreStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(KpiScoreStore.searchText) params += (params ? '&q=' : '?q=')+KpiScoreStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'kpi_management_kpi_score' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiScorePaginationResponse>('/kpi-management/kpi-scores' + (params ? params : '')).pipe(
      map((res: KpiScorePaginationResponse) => {
        KpiScoreStore.setKpiScore(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualKpiScore> {
    return this._http.get<IndividualKpiScore>(`/kpi-management/kpi-scores/${id}`).pipe(
      map((res: IndividualKpiScore) => {
        KpiScoreStore.setIndividualKpiScoreDetails(res);
        return res;
      })
    );
  }

  getItemUpdateScoreDate(id: number): Observable<IndividualKpiScore> {
    return this._http.get<IndividualKpiScore>(`/kpi-management/kpi-scores/${id}/update-score-data`).pipe(
      map((res: IndividualKpiScore) => {
        KpiScoreStore.setIndividualKpiScoreUpdateScoreDate(res);
        return res;
      })
    );
  }

  updateScore(Id:number, data: any): Observable<any> {
    return this._http.put('/kpi-management/kpi-scores/'+ Id, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_score_updated_successfully');
        return res;
      })
    );
  }

  submit(Id): Observable<any> {
    return this._http.put(`/kpi-management/kpi-scores/${Id}/submit`,Id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_score_submit_successfully');
        return res;
      })
    );
  }
  
  review(Id, Data): Observable<any> {
    return this._http.put(`/kpi-management/kpi-scores/${Id}/review`,Data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_score_review_submit_successfully');
        return res;
      })
    );
  }

  sentBack(Id, Data): Observable<any> {
    return this._http.put(`/kpi-management/kpi-scores/${Id}/send-back`,Data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'kpi_score_send_back_successfully');
        return res;
      })
    );
  }

  getWorkFlow(id): Observable<IndividualKpiWorkFlow> {
    return this._http.get<IndividualKpiWorkFlow>('/kpi-management/kpi-scores/'+id+'/workflow').pipe((
      map((res:IndividualKpiWorkFlow)=>{
      
        KpiScoreStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }

  getHistory(id): Observable<WorkflowHistoryPaginationResponse> {
    let params = '';
    
      params = `?page=${KpiScoreStore.currentPage}`;
      // if (KpisStore.orderBy) params += `&order_by=impact_analysis.title&order=${KpisStore.orderBy}`;
    return this._http.get<WorkflowHistoryPaginationResponse>('/kpi-management/kpi-scores/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: WorkflowHistoryPaginationResponse) => {
        KpiScoreStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  exportToExcel(params?) {
    this._http.get('/kpi-management/kpi-scores/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('kpi_score')+".xlsx");     
      }
    )
  }

  sortList(type:string, text:string) {
    if (!KpiScoreStore.orderBy) {
      KpiScoreStore.orderBy = 'desc';
      KpiScoreStore.orderItem = type;
    }
    else{
      if (KpiScoreStore.orderItem == type) {
        if(KpiScoreStore.orderBy == 'desc') KpiScoreStore.orderBy = 'asc';
        else KpiScoreStore.orderBy = 'desc'
      }
      else{
        KpiScoreStore.orderBy = 'desc';
        KpiScoreStore.orderItem = type;
      }
    }
  }
  
}

