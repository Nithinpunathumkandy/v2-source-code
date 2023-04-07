import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { KpiStore } from 'src/app/stores/strategy-management/kpi.store';
import { KpiflowDetail, KpiflowHistoryPaginationResponse } from 'src/app/core/models/strategy-management/kpi-workflow.model';
import { KpiWorkflowStore } from 'src/app/stores/strategy-management/kpi-workflow.store';

@Injectable({
  providedIn: 'root'
})
export class KpiWorkflowService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(id): Observable<KpiflowDetail> {
    return this._http.get<KpiflowDetail>('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+id+'/review').pipe((
      map((res:KpiflowDetail)=>{
        KpiWorkflowStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<KpiflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${KpiWorkflowStore.currentPage}`;
    return this._http.get<KpiflowHistoryPaginationResponse>('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+id+'/review-history' + (params ? params : '')).pipe(
      map((res: KpiflowHistoryPaginationResponse) => {
        KpiWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitProject(id,item?) {
    return this._http.put('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+ id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'KPI review  submitted successfuly');
        
        return res;
      })
    );
  }

  approveProject(id,comment) {
    return this._http.put('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'KPI review approved successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  revertProject(id,data) {
    return this._http.put('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'KPi review reverted successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'KPI review rejected successfuly');
        this.getItems(id).subscribe();
        return res;
      })
    );
  }

  getWorkFlow(id){
    return this._http.get('/strategy-profile-objective-kpi/'+KpiStore.selectedKpiId+'/review-frequency/'+id+'/review').pipe(
      map((res) => {
        // KpiWorkflowStore.setWorkflowHistory(res);
        return res;
      })
    );
  }
}
