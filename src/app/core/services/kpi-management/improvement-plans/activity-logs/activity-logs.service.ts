import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLoagsPaginationResponse } from 'src/app/core/models/kpi-management/improvement-plans/activity-logs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImprovementActivityLogsStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-activity-logs-store';
import { ImprovementPlansStore } from 'src/app/stores/kpi-management/improvement-plans/improvement-plans-store';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ActivityLoagsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ImprovementActivityLogsStore.currentPage}`;
    }
    if (additionalParams) params += additionalParams;
  
    return this._http.get<ActivityLoagsPaginationResponse>(`/kpi-management/kpi-improvement-plans/${ImprovementPlansStore.ImprovementPlansId}/activity-logs` + (params ? params : '')).pipe(
      map((res: ActivityLoagsPaginationResponse) => {
        ImprovementActivityLogsStore.setActivityLogs(res);
        return res;
      })
    );
  }
  
}
