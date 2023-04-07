import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventRiskAnalysis, EventRiskAssessmentDetails, EventRiskAssessmentPaginationResponse } from 'src/app/core/models/event-monitoring/risk-assessment/risk-assessment';
import { ContextChart } from 'src/app/core/models/risk-management/risks/risks';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventRiskAssessmentStore } from 'src/app/stores/event-monitoring/event-risk-assessment/event-risk-assesment.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class EventRiskAssessmentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService,
    ) { }

  getItem(id: number): Observable<EventRiskAssessmentDetails>{
    return this._http.get<EventRiskAssessmentDetails>('/event-risks/' + id).pipe(
      map((res: EventRiskAssessmentDetails) => {
        res.is_analysis_performed = typeof(res.is_analysis_performed)=='string'?parseInt(res.is_analysis_performed):res.is_analysis_performed;
        res.is_residual_analysis_performed = typeof(res.is_residual_analysis_performed)=='string'?parseInt(res.is_residual_analysis_performed):res.is_residual_analysis_performed; 
        EventRiskAssessmentStore.setEventRiskDetails(res);
        return res;
      })
    );
  }

  getRiskAssessment(id: number): Observable<EventRiskAnalysis>{
    return this._http.get<EventRiskAnalysis>('/event-risks/'+id+'/analyses').pipe(
      map((res: EventRiskAnalysis) => {
        EventRiskAssessmentStore.setEventRiskAnalysis(res);
        return res;
      })
    );
  }

  saveRiskAssessment(id,item): Observable<any> {
    return this._http.post('/event-risks/'+id+'/analyses', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_assessment_saved');
        //this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  // getRiskAssessmentById(id: number): Observable<EventRiskAssessmentDetails>{
  //   return this._http.get<EventRiskAssessmentDetails>('/event-risks?risk_ids'+id).pipe(
  //     map((res: EventRiskAssessmentDetails) => {
  //       EventRiskAssessmentStore.setEventRiskDetails(res);
  //       return res;
  //     })
  //   );
  // }

  delete(id: number) {
    return this._http.delete('/event-risks/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_deleted');
        //this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/event-risks/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_activated');
        //this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-risks/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'risk_info_deactivated');
        //this.getItems(false,null).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/event-risks/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_assessment')+".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (EventRiskAssessmentStore.orderBy) params += `?order=${EventRiskAssessmentStore.orderBy}`;
    if (EventRiskAssessmentStore.orderItem) params += `&order_by=${EventRiskAssessmentStore.orderItem}`;
    // if (EventRiskAssessmentStore.searchText) params += `&q=${EventRiskAssessmentStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'bcm_risk' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/event-risks/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_assessment')+".xlsx");
      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/event-risks/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','bcp_imported');
        return res;
      })
    )
  }

  shareData(data) {
    return this._http.post('/event-risks/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'bcm_risk_shared');
        return res;
      })
    )
  }

  sortBcpList(type:string) {
    if (!EventRiskAssessmentStore.orderBy) {
      EventRiskAssessmentStore.orderBy = 'asc';
      EventRiskAssessmentStore.orderItem = type;
    }
    else{
      if (EventRiskAssessmentStore.orderItem == type) {
        if(EventRiskAssessmentStore.orderBy == 'asc') EventRiskAssessmentStore.orderBy = 'desc';
        else EventRiskAssessmentStore.orderBy = 'asc'
      }
      else{
        EventRiskAssessmentStore.orderBy = 'asc';
        EventRiskAssessmentStore.orderItem = type;
      }
    }
  }
}
