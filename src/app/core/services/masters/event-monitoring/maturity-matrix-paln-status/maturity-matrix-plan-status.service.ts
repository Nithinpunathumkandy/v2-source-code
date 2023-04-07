import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MaturityMatrixPlanStatusPaginationResponse } from 'src/app/core/models/masters/event-monitoring/maturity-matrix-plan-status';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MaturityMatrixPlanStatusMasterStore } from 'src/app/stores/masters/event-monitoring/maturity-matrix-plan-status-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MaturityMatrixPlanStatusService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<MaturityMatrixPlanStatusPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MaturityMatrixPlanStatusMasterStore.currentPage}`;
      if (MaturityMatrixPlanStatusMasterStore.orderBy)
        params += `&order_by=${MaturityMatrixPlanStatusMasterStore.orderItem}&order=${MaturityMatrixPlanStatusMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(MaturityMatrixPlanStatusMasterStore.searchText) params += (params ? '&q=' : '?q=')+MaturityMatrixPlanStatusMasterStore.searchText;

    
    return this._http
      .get<MaturityMatrixPlanStatusPaginationResponse>('/event-maturity-matrix-plan-statuses'+(params ? params : ''))
      .pipe(
        map((res: MaturityMatrixPlanStatusPaginationResponse) => {
          MaturityMatrixPlanStatusMasterStore.setMaturityMatrixPlanStatus(res);
          return res;
        })
      );
  }
  exportToExcel() {
    this._http.get('/event-maturity-matrix-plan-statuses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('maturity_matrix_plan_statuses')+".xlsx");
      }
    )
  }
  activate(id: number) {
    return this._http.put('/event-maturity-matrix-plan-statuses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_plan_statuses_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/event-maturity-matrix-plan-statuses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','event_maturity_matrix_plan_statuses_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }
  sortMaturityMatrixPlanStatusList(type:string, text:string) {
    if (!MaturityMatrixPlanStatusMasterStore.orderBy) {
      MaturityMatrixPlanStatusMasterStore.orderBy = 'asc';
      MaturityMatrixPlanStatusMasterStore.orderItem = type;
    }
    else{
      if (MaturityMatrixPlanStatusMasterStore.orderItem == type) {
        if(MaturityMatrixPlanStatusMasterStore.orderBy == 'asc') MaturityMatrixPlanStatusMasterStore.orderBy = 'desc';
        else MaturityMatrixPlanStatusMasterStore.orderBy = 'asc'
      }
      else{
        MaturityMatrixPlanStatusMasterStore.orderBy = 'asc';
        MaturityMatrixPlanStatusMasterStore.orderItem = type;
      }
    }
  }


}
