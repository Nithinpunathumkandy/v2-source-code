import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { BusinessImpactAnalysisStatusesMasterStore } from 'src/app/stores/masters/bcm/businesss-impact-analysis-statuses.store';
import { Observable } from 'rxjs';
import { BusinessImpactAnalysisStatusesPaginationResponse } from 'src/app/core/models/masters/bcm/business-impact-analysis-statuses';

@Injectable({
  providedIn: 'root'
})
export class BusinessImpactAnalysisStatusesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<BusinessImpactAnalysisStatusesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${BusinessImpactAnalysisStatusesMasterStore.currentPage}`;
        if (BusinessImpactAnalysisStatusesMasterStore.orderBy) params += `&order_by=${BusinessImpactAnalysisStatusesMasterStore.orderItem}&order=${BusinessImpactAnalysisStatusesMasterStore.orderBy}`;
  
      }
      if (additionalParams) params += additionalParams;
      if (BusinessImpactAnalysisStatusesMasterStore.searchText) params += (params ? '&q=' : '?q=') + BusinessImpactAnalysisStatusesMasterStore.searchText;
      if (is_all) params += '&status=all';
      return this._http.get<BusinessImpactAnalysisStatusesPaginationResponse>('/business-impact-analysis-statuses' + (params ? params : '')).pipe(
        map((res: BusinessImpactAnalysisStatusesPaginationResponse) => {
          BusinessImpactAnalysisStatusesMasterStore.setBusinessImpactAnalysisStatuses(res);
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/business-impact-analysis-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_impact_analysis_statuses') + ".xlsx");
        }
      )
    }
  
    sortBusinessImpactAnalysisStatus(type: string, text: string) {
      if (!BusinessImpactAnalysisStatusesMasterStore.orderBy) {
        BusinessImpactAnalysisStatusesMasterStore.orderBy = 'asc';
        BusinessImpactAnalysisStatusesMasterStore.orderItem = type;
      }
      else {
        if (BusinessImpactAnalysisStatusesMasterStore.orderItem == type) {
          if (BusinessImpactAnalysisStatusesMasterStore.orderBy == 'asc') BusinessImpactAnalysisStatusesMasterStore.orderBy = 'desc';
          else BusinessImpactAnalysisStatusesMasterStore.orderBy = 'asc'
        }
        else {
          BusinessImpactAnalysisStatusesMasterStore.orderBy = 'asc';
          BusinessImpactAnalysisStatusesMasterStore.orderItem = type;
        }
      }
    }
}


