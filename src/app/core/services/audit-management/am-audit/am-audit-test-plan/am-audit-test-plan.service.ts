import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { AmAuditsStore } from 'src/app/stores/audit-management/am-audit/am-audit.store';
import { AmTestPlan, AmTestPlanPaginationResponse } from 'src/app/core/models/audit-management/am-audit/am-audit-test-plan';
import { AmAuditTestPlanStore } from 'src/app/stores/audit-management/am-audit/am-audit-test-plan.store';
import { AmAuditableItemObjectives, AmAuditableItemControls, AmAuditableItemRisks } from 'src/app/core/models/audit-management/am-audit-plan/am-auditable-item';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AmAuditProgressResponse } from 'src/app/core/models/audit-management/am-audit-field-work/am-audit-field-work';
import { MsDocumentDetails, MsDocumentsPaginationResponse } from 'src/app/core/models/ms-audit-management/ms-audit-check-list/ms-audit-check-list';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';


@Injectable({
  providedIn: 'root'
})
export class AmAuditTestPlanService {



  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<AmTestPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditTestPlanStore.currentPage}`;
      if (AmAuditTestPlanStore.orderBy) params += `&order=${AmAuditTestPlanStore.orderBy}`;
      if (AmAuditTestPlanStore.orderItem) params += `&order_by=${AmAuditTestPlanStore.orderItem}`;
      if (AmAuditTestPlanStore.searchText) params += `&q=${AmAuditTestPlanStore.searchText}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_test_plan' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<AmTestPlanPaginationResponse>('/am-audit-test-plans' + (params ? params : '')).pipe(
      map((res: AmTestPlanPaginationResponse) => {
        AmAuditTestPlanStore.setAuditTestPlanDetails(res);
        return res;
      })
    );


  }

  getItem(id: number): Observable<AmTestPlan> {
    return this._http.get<AmTestPlan>('/am-audit-test-plans/' + id).pipe(
      map((res: AmTestPlan) => {
        AmAuditTestPlanStore.setIndividualAuditTestPlanDetails(res);
        return res;
      })
    );
  }

  completeTestPlan(id: number) {
    return this._http.put('/am-audit-test-plans/' + id + '/complete', null).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'am_audit_test_plan_completed');
        return res;
      })
    );
  }

  updateItem(request_id: number, auditSettings): Observable<any> {
    return this._http.put('/am-audit-test-plans/' + request_id, auditSettings).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_test_plan_updated');

        if (AmAuditsStore.auditId)
          this.getItems(false, 'am_audit_ids=' + AmAuditsStore.auditId).subscribe();
        else
          this.getItems().subscribe();

        return res;
      })
    );
  }


  saveItem(audit): Observable<any> {
    return this._http.post('/am-audit-test-plans', audit).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_test_plan_added');
        if (AmAuditsStore.auditId)
          this.getItems(false, 'am_audit_ids=' + AmAuditsStore.auditId).subscribe();
        else
          this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-test-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'am_audit_test_plan_deleted');
        if (AmAuditsStore.auditId)
          this.getItems(false, 'am_audit_ids=' + AmAuditsStore.auditId).subscribe();
        else
          this.getItems().subscribe();
        return res;
      })
    );
  }


  getControls(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemControls> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditTestPlanStore.controlCurrentPage}`;
      if (AmAuditTestPlanStore.orderBy) params += `&order=${AmAuditTestPlanStore.orderBy}`;
      if (AmAuditTestPlanStore.orderItem) params += `&order_by=${AmAuditTestPlanStore.orderItem}`;
      if (AmAuditTestPlanStore.searchText) params += `&q=${AmAuditTestPlanStore.searchText}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemControls>('/am-audit-test-plans/controls' + (params ? params : '')).pipe(
      map((res: AmAuditableItemControls) => {
        AmAuditTestPlanStore.setAuditableItemControls(res);
        return res;
      })
    );
  }
  getRisks(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemRisks> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditTestPlanStore.riskCurrentPage}`;
      if (AmAuditTestPlanStore.orderBy) params += `&order=${AmAuditTestPlanStore.orderBy}`;
      if (AmAuditTestPlanStore.orderItem) params += `&order_by=${AmAuditTestPlanStore.orderItem}`;
      if (AmAuditTestPlanStore.searchText) params += `&q=${AmAuditTestPlanStore.searchText}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemRisks>('/am-audit-test-plans/risks' + (params ? params : '')).pipe(
      map((res: AmAuditableItemRisks) => {
        AmAuditTestPlanStore.setAuditableItemRisks(res);
        return res;
      })
    );
  }
  getStrategicObjectives(getAll: boolean = false, additionalParams?: string): Observable<AmAuditableItemObjectives> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditTestPlanStore.objectiveCurrentPage}`;
      if (AmAuditTestPlanStore.orderBy) params += `&order=${AmAuditTestPlanStore.orderBy}`;
      if (AmAuditTestPlanStore.orderItem) params += `&order_by=${AmAuditTestPlanStore.orderItem}`;
      if (AmAuditTestPlanStore.searchText) params += `&q=${AmAuditTestPlanStore.searchText}`;
    }

    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<AmAuditableItemObjectives>('/am-audit-test-plans/objectives' + (params ? params : '')).pipe(
      map((res: AmAuditableItemObjectives) => {
        AmAuditTestPlanStore.setAuditableItemObjectives(res);
        return res;
      })
    );
  }


  setDocumentDetails(imageDetails, url) {
    AmAuditTestPlanStore.setDocumentDetails(imageDetails, url);
  }

  getFindingProgress(id: number): Observable<AmAuditProgressResponse> {
    return this._http.get<AmAuditProgressResponse>('/am-audit-test-plans/' + id + '/charts').pipe(
      map((res: AmAuditProgressResponse) => {
        AmAuditTestPlanStore.setFindingProgress(res);
        return res;
      })
    );
  }


  getDocumentVersionItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsDocumentsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmAuditTestPlanStore.msCurrentPage}`;
      if (AmAuditTestPlanStore.orderBy) params += `&order_by=${AmAuditTestPlanStore.orderItem}&order=${AmAuditTestPlanStore.orderBy}`;
    }
    if (AmAuditTestPlanStore.searchText) params += (params ? '&q=' : '?q=') + AmAuditTestPlanStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MsDocumentsPaginationResponse>('/documents' + (params ? params : '')).pipe(
      map((res: MsDocumentsPaginationResponse) => {
        AmAuditTestPlanStore.setDocumentVersionLists(res);
        return res;
      })
    );
  }


  getDocumentVersionContents(id: number): Observable<MsDocumentDetails[]> {
    return this._http.get<MsDocumentDetails[]>('/document-versions/' + id + '/contents').pipe(
      map((res: MsDocumentDetails[]) => {
        AmAuditTestPlanStore.setDocumentVersionContents(res)
        return res;
      })
    );
  }

  exportToExcel(additionalParams?) {
    let params = '';
    if (AmAuditTestPlanStore.orderBy) params += `?order=${AmAuditTestPlanStore.orderBy}`;
    if (AmAuditTestPlanStore.orderItem) params += `&order_by=${AmAuditTestPlanStore.orderItem}`;
    if (additionalParams) {
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if (RightSidebarLayoutStore.filterPageTag == 'am_audit_test_plan' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/am-audit-test-plans/export' + params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "audit-test-plans.xlsx");
        SubMenuItemStore.exportClicked = false;
      }
    )


  }


}
