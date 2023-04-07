import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MockDrillReportPaginationResponse } from 'src/app/core/models/mock-drill/mock-drill-report/mock-drill-report';
import { MockDrillReportStore } from 'src/app/stores/mock-drill/mock-drill-report/mock-drill-report-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillReportService {

  constructor(private _http: HttpClient, private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }
  // Get Mock Drill Reports
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MockDrillReportPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MockDrillReportStore.currentPage}`;
      if (MockDrillReportStore.orderBy) params += `&order_by=${MockDrillReportStore.orderItem}&order=${MockDrillReportStore.orderBy}`;
    }
    if (MockDrillReportStore.searchText) params += (params ? '&q=' : '?q=') + MockDrillReportStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MockDrillReportPaginationResponse>('/mock-drill/mock-drill-reports' + (params ? params : '')).pipe(
      map((res: MockDrillReportPaginationResponse) => {
        MockDrillReportStore.setMockDrill(res);
        return res;
      })
    );
  }
  sortMockDrillList(type) {
    if (!MockDrillReportStore.orderBy) {
      MockDrillReportStore.orderBy = 'asc';
      MockDrillReportStore.orderItem = type;
    }
    else {
      if (MockDrillReportStore.orderItem == type) {
        if (MockDrillReportStore.orderBy == 'asc') MockDrillReportStore.orderBy = 'desc';
        else MockDrillReportStore.orderBy = 'asc'
      }
      else {
        MockDrillReportStore.orderBy = 'asc';
        MockDrillReportStore.orderItem = type;
      }
    }
  }
  // Export Mock Drill  PDF
  exportToPdf(id) {
    // return this._http.get('/mock-drill/mock-drill-reports/' + id + '/export-pdf', { responseType: 'blob' as 'json' }).subscribe(
    //   (response: any) => {
    //     this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('mock_drill') + ".pdf");
    //   }
    // )
    return this._http.get('/mock-drill/mock-drill-reports/' + id + '/export-pdf', { responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        this._utilityService.downloadFile(res, this._helperService.translateToUserLanguage('mock_drill') + ".pdf");
        return res;
      })
    );

  }
}
