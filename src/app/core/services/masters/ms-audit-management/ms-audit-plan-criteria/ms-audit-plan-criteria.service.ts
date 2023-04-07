
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditPlanCriteriaMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-criteria-store';
import { MsAuditPlanCriteria, MsAuditPlanCriteriaPaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-plan-criteria';
@Injectable({
  providedIn: 'root'
})
export class MsAuditPlanCriteriaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }


  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditPlanCriteriaPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditPlanCriteriaMasterStore.currentPage}`;
      if (MsAuditPlanCriteriaMasterStore.orderBy) params += `&order_by=${MsAuditPlanCriteriaMasterStore.orderItem}&order=${MsAuditPlanCriteriaMasterStore.orderBy}`;
    }
    if (MsAuditPlanCriteriaMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditPlanCriteriaMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MsAuditPlanCriteriaPaginationResponse>('/ms-audit-plan-criteria' + (params ? params : '')).pipe(
      map((res: MsAuditPlanCriteriaPaginationResponse) => {
        MsAuditPlanCriteriaMasterStore.setMsAuditPlanCriteria(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<MsAuditPlanCriteria[]> {
    return this._http.get<MsAuditPlanCriteria[]>('/ms-audit-plan-criteria').pipe((
      map((res: MsAuditPlanCriteria[]) => {
        MsAuditPlanCriteriaMasterStore.setAllMsAuditPlanCriteria(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<MsAuditPlanCriteria> {
    return this._http.get<MsAuditPlanCriteria>('/ms-audit-plan-criteria/' + id).pipe((
      map((res: MsAuditPlanCriteria) => {
        MsAuditPlanCriteriaMasterStore.setIndividualMsAuditPlanCriteria(res);
        return res;
      })
    ))
  }

  saveItem(item: any) {
    return this._http.post('/ms-audit-plan-criteria', item).pipe(
      map((res: any) => {
        MsAuditPlanCriteriaMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  updateItem(id: number, item: any): Observable<any> {
    return this._http.put('/ms-audit-plan-criteria/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/ms-audit-plan-criteria/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MsAuditPlanCriteriaMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/ms-audit-plan-criteria/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/ms-audit-plan-criteria/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/ms-audit-plan-criteria/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_plan_criteria') + ".xlsx");
      }
    )
  }
  shareData(data) {
    return this._http.post('/ms-audit-plan-criteria/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  sortMsAuditPlanCriteriaList(type: string, text: string) {
    if (!MsAuditPlanCriteriaMasterStore.orderBy) {
      MsAuditPlanCriteriaMasterStore.orderBy = 'asc';
      MsAuditPlanCriteriaMasterStore.orderItem = type;
    }
    else {
      if (MsAuditPlanCriteriaMasterStore.orderItem == type) {
        if (MsAuditPlanCriteriaMasterStore.orderBy == 'asc') MsAuditPlanCriteriaMasterStore.orderBy = 'desc';
        else MsAuditPlanCriteriaMasterStore.orderBy = 'asc'
      }
      else {
        MsAuditPlanCriteriaMasterStore.orderBy = 'asc';
        MsAuditPlanCriteriaMasterStore.orderItem = type;
      }
    }
  }

  searchTextCriteria(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditPlanCriteriaPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditPlanCriteriaMasterStore.currentPage}`;
      if (MsAuditPlanCriteriaMasterStore.orderBy) params += `&order_by=ms_audit_plan_criteria.title&order=${MsAuditPlanCriteriaMasterStore.orderBy}`;
    }
    if (MsAuditPlanCriteriaMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditPlanCriteriaMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MsAuditPlanCriteriaPaginationResponse>('/ms-audit-plan-criteria' + (params ? params : '')).pipe(
      map((res: MsAuditPlanCriteriaPaginationResponse) => {

        return res;
      })
    );
  }

  selectRequiredCriteria(issues) {
    MsAuditPlanCriteriaMasterStore.addSelectedCriteria(issues);
  }
}
