import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLoagsPaginationResponse } from 'src/app/core/models/kpi-management/improvement-plans/activity-logs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuditPlanActivityLogsStore } from 'src/app/stores/ms-audit-management/audit-plan-activity-log/activity-log';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Injectable({
  providedIn: 'root'
})
export class MsAuditPlanActivityLogService {
  MsAuditSchedulesStore=MsAuditSchedulesStore;
  MsAuditStore = MsAuditStore
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ActivityLoagsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditPlanActivityLogsStore.currentPage}`;
    }
    if (additionalParams) params += additionalParams;
  
    return this._http.get<ActivityLoagsPaginationResponse>(`/ms-audit-plans/${MsAuditPlansStore.msAuditPlansId}/activity-logs` + (params ? params : '')).pipe(
      map((res: ActivityLoagsPaginationResponse) => {
        AuditPlanActivityLogsStore.setActivityLogs(res);
        return res;
      })
    );
  }

  getItemsScheduleActivityLog(getAll: boolean = false, additionalParams?: string): Observable<ActivityLoagsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditPlanActivityLogsStore.currentPage}`;
    }
    if (additionalParams) params += additionalParams;
  
    return this._http.get<ActivityLoagsPaginationResponse>(`/ms-audit-schedules/${MsAuditSchedulesStore.msAuditSchedulesId}/activity-logs` + (params ? params : '')).pipe(
      map((res: ActivityLoagsPaginationResponse) => {
        AuditPlanActivityLogsStore.setActivityLogs(res);
        return res;
      })
    );
  }

  getItemsAuditActivityLog(getAll: boolean = false, additionalParams?: string): Observable<ActivityLoagsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AuditPlanActivityLogsStore.currentPage}`;
    }
    if (additionalParams) params += additionalParams;
  
    return this._http.get<ActivityLoagsPaginationResponse>(`/ms-audits/${MsAuditStore.selectedMsAuditId}/activity-logs` + (params ? params : '')).pipe(
      map((res: ActivityLoagsPaginationResponse) => {
        AuditPlanActivityLogsStore.setActivityLogs(res);
        return res;
      })
    );
  }
  
}