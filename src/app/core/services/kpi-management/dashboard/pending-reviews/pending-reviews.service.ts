import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KpiPendingReviewsPaginationResponse, KpiScorePendingReviewsPaginationResponse } from 'src/app/core/models/kpi-management/dashboard/kpi-pending-reviews';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { KPIPendingRivewsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-pending-reviews';
import { KPIScorePendingRivewsDashboardStore } from 'src/app/stores/kpi-management/dashboard/kpi-score-pending-reviews';

@Injectable({
  providedIn: 'root'
})
export class PendingReviewsService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getByKpi(getAll: boolean = false, additionalParams?: string): Observable<KpiPendingReviewsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KPIPendingRivewsDashboardStore.currentPage}&status=all`;
      if (KPIPendingRivewsDashboardStore.orderBy) params += `&order_by=${KPIPendingRivewsDashboardStore.orderItem}&order=${KPIPendingRivewsDashboardStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiPendingReviewsPaginationResponse>('/kpi-management/dashboard/kpi-pending-review' + (params ? params : '')).pipe(
      map((res: KpiPendingReviewsPaginationResponse) => {
        KPIPendingRivewsDashboardStore.setKpiPendingReviews(res);
        return res;
      })
    );
  }


  getByKpiScore(getAll: boolean = false, additionalParams?: string): Observable<KpiScorePendingReviewsPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${KPIScorePendingRivewsDashboardStore.currentPage}&status=all`;
      if (KPIScorePendingRivewsDashboardStore.orderBy) params += `&order_by=${KPIScorePendingRivewsDashboardStore.orderItem}&order=${KPIScorePendingRivewsDashboardStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if(RightSidebarLayoutStore.filterPageTag == 'KPI_dashboard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<KpiScorePendingReviewsPaginationResponse>('/kpi-management/dashboard/kpi-score-pending-review' + (params ? params : '')).pipe(
      map((res: KpiScorePendingReviewsPaginationResponse) => {
        KPIScorePendingRivewsDashboardStore.setKpiScorePendingReviews(res);
        return res;
      })
    );
  }

}
