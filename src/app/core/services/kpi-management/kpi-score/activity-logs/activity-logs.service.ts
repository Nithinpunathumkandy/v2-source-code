import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLoagsPaginationResponse } from 'src/app/core/models/kpi-management/kpi-score/activity-logs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiScoreActivityLogsStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-activity-logs-store';
import { KpiScoreStore } from 'src/app/stores/kpi-management/kpi-score/kpi-score-store';

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
      params = `?page=${KpiScoreActivityLogsStore.currentPage}`;
    }
    if (additionalParams) params += additionalParams;
  
    return this._http.get<ActivityLoagsPaginationResponse>(`/kpi-management/kpi-scores/${KpiScoreStore.kpiScoreId}/activity-logs` + (params ? params : '')).pipe(
      map((res: ActivityLoagsPaginationResponse) => {
        KpiScoreActivityLogsStore.setActivityLogs(res);
        return res;
      })
    );
  }
  
}
