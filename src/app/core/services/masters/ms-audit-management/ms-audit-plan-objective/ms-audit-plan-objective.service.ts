import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditPlanObjective, MsAuditPlanObjectivePaginationResponse } from 'src/app/core/models/masters/ms-audit-management/ms-audit-plan-objective';
import { MsAuditPlanObjectiveMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-objective-store';

@Injectable({
  providedIn: 'root'
})
export class MsAuditPlanObjectiveService {


  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditPlanObjectivePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditPlanObjectiveMasterStore.currentPage}`;
      if (MsAuditPlanObjectiveMasterStore.orderBy) params += `&order_by=${MsAuditPlanObjectiveMasterStore.orderItem}&order=${MsAuditPlanObjectiveMasterStore.orderBy}`;
    }
    if (MsAuditPlanObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditPlanObjectiveMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MsAuditPlanObjectivePaginationResponse>('/ms-audit-plan-objectives' + (params ? params : '')).pipe(
      map((res: MsAuditPlanObjectivePaginationResponse) => {
        MsAuditPlanObjectiveMasterStore.setMsAuditPlanObjective(res);
        return res;
      })
    );
  }


  getAllItems(): Observable<MsAuditPlanObjective[]> {
    return this._http.get<MsAuditPlanObjective[]>('/ms-audit-plan-objectives').pipe((
      map((res: MsAuditPlanObjective[]) => {
        MsAuditPlanObjectiveMasterStore.setAllMsAuditPlanObjective(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<MsAuditPlanObjective> {
    return this._http.get<MsAuditPlanObjective>('/ms-audit-plan-objectives/' + id).pipe((
      map((res: MsAuditPlanObjective) => {
        MsAuditPlanObjectiveMasterStore.setIndividualMsAuditPlanObjective(res);
        return res;
      })
    ))
  }
  saveItem(item: any) {
    return this._http.post('/ms-audit-plan-objectives', item).pipe(
      map((res: any) => {
        MsAuditPlanObjectiveMasterStore.setLastInsertedId(res['id']);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if (this._helperService.checkMasterUrl()) this.getItems(false, null, true).subscribe();
        else this.getItems(false, null).subscribe();
        return res;
      })
    );
  }

  updateItem(id: number, item: any): Observable<any> {
    return this._http.put('/ms-audit-plan-objectives/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/ms-audit-plan-objectives/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false, null, true).subscribe(resp => {
          if (resp.from == null) {
            MsAuditPlanObjectiveMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, null, true).subscribe();
          }
        });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/ms-audit-plan-objectives/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/ms-audit-plan-objectives/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/ms-audit-plan-objectives/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_audit_plan_objectives') + ".xlsx");
      }
    )
  }
  shareData(data) {
    return this._http.post('/ms-audit-plan-objectives/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'share_success');
        return res;
      })
    )
  }

  sortMsAuditPlanObjectiveList(type: string, text: string) {
    if (!MsAuditPlanObjectiveMasterStore.orderBy) {
      MsAuditPlanObjectiveMasterStore.orderBy = 'asc';
      MsAuditPlanObjectiveMasterStore.orderItem = type;
    }
    else {
      if (MsAuditPlanObjectiveMasterStore.orderItem == type) {
        if (MsAuditPlanObjectiveMasterStore.orderBy == 'asc') MsAuditPlanObjectiveMasterStore.orderBy = 'desc';
        else MsAuditPlanObjectiveMasterStore.orderBy = 'asc'
      }
      else {
        MsAuditPlanObjectiveMasterStore.orderBy = 'asc';
        MsAuditPlanObjectiveMasterStore.orderItem = type;
      }
    }
  }

  searchTextObjective(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<MsAuditPlanObjectivePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MsAuditPlanObjectiveMasterStore.currentPage}`;
      if (MsAuditPlanObjectiveMasterStore.orderBy) params += `&order_by=ms_audit_plan_objectives.title&order=${MsAuditPlanObjectiveMasterStore.orderBy}`;
    }
    if (MsAuditPlanObjectiveMasterStore.searchText) params += (params ? '&q=' : '?q=') + MsAuditPlanObjectiveMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<MsAuditPlanObjectivePaginationResponse>('/ms-audit-plan-objectives' + (params ? params : '')).pipe(
      map((res: MsAuditPlanObjectivePaginationResponse) => {

        return res;
      })
    );
  }

  selectRequiredObjective(issues) {
    MsAuditPlanObjectiveMasterStore.addSelectedObjective(issues);
  }
}
