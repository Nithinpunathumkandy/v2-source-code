import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityLoagsPaginationResponse } from 'src/app/core/models/kpi-management/kpi/activity-logs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { KpiActivityLogsStore } from 'src/app/stores/kpi-management/kpi/kpi-activity-logs-store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';


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
      params = `?page=${KpiActivityLogsStore.currentPage}`;
    }
    if (additionalParams) params += additionalParams;
  
    return this._http.get<ActivityLoagsPaginationResponse>(`/kpi-management/kpis/${KpisStore.kpiId}/activity-logs` + (params ? params : '')).pipe(
      map((res: ActivityLoagsPaginationResponse) => {
        KpiActivityLogsStore.setActivityLogs(res);
        return res;
      })
    );
  }
  
}
